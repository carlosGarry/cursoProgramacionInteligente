import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';
const SESSION_KEY = 'astrobookings.session';

const user = { id: 1, username: 'ana', email: 'ana@example.com', terms: true };
const session = { token: 'token-ana', user };

const activity = {
  id: 'activity-2',
  name: 'Luna Express',
  slug: 'luna-express',
  price: 2500,
  date: '2030-01-15T10:00:00.000Z',
  duration: 120,
  location: 'Base Lunar',
  minParticipants: 1,
  maxParticipants: 15,
  status: 'published',
  userId: 'admin',
  createdAt: '2025-01-01T00:00:00.000Z',
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization' },
    body: JSON.stringify(body),
  });
}

async function mockLaunch(page: Page, availableSeats = 5, status = 'published') {
  await page.route(`${API}/activities`, (route) => json(route, [{ ...activity, status }]));
  await page.route(`${API}/activities/${activity.id}`, (route) => json(route, { ...activity, status }));
  await page.route(`${API}/activities/${activity.id}/availability`, (route) =>
    json(route, {
      activityId: activity.id,
      maxParticipants: 15,
      bookedParticipants: 15 - availableSeats,
      availableSeats,
    }),
  );
}

async function signIn(page: Page) {
  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [SESSION_KEY, JSON.stringify(session)],
  );
}

async function storedSession(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), SESSION_KEY);
}

test.describe('Reservar plazas', () => {
  test('una reserva correcta envía el token y los participantes, y confirma', async ({ page }) => {
    await signIn(page);
    await mockLaunch(page, 5);

    let sentBody: unknown = null;
    let sentAuth: string | undefined;
    await page.route(`${API}/bookings`, (route) => {
      if (route.request().method() === 'OPTIONS') return json(route, {});
      sentBody = route.request().postDataJSON();
      sentAuth = route.request().headers().authorization;
      return json(
        route,
        { id: 'b-1', activityId: activity.id, userId: '1', participants: 2, createdAt: '2025-01-01', paymentId: 'p', paymentStatus: 'paid' },
        201,
      );
    });

    await page.goto(`/launches/${activity.id}`);
    await page.getByLabel('Número de plazas').fill('2');
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('status')).toHaveText('Reserva confirmada: 2 plazas.');
    expect(sentBody).toEqual({ activityId: activity.id, participants: 2 });
    expect(sentAuth).toBe('Bearer token-ana');
  });

  test('sin sesión no aparece el formulario y se ofrece el enlace a login', async ({ page }) => {
    await mockLaunch(page, 5);
    await page.goto(`/launches/${activity.id}`);

    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByLabel('Número de plazas')).toHaveCount(0);
  });

  test('no permite elegir más plazas que las disponibles', async ({ page }) => {
    await signIn(page);
    await mockLaunch(page, 3);
    let bookingCalled = false;
    await page.route(`${API}/bookings`, (route) => {
      bookingCalled = true;
      return json(route, {}, 201);
    });

    await page.goto(`/launches/${activity.id}`);
    await page.getByLabel('Número de plazas').fill('4');
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Elige entre 1 y 3 plazas.');
    await expect(page.locator('.form-error')).toHaveCount(0);
    expect(bookingCalled).toBe(false);
  });

  test('un 400 de capacidad muestra el mensaje de la API', async ({ page }) => {
    await signIn(page);
    await mockLaunch(page, 5);
    await page.route(`${API}/bookings`, (route) =>
      json(route, { message: 'Validation failed', errors: [{ field: 'participants', message: 'Capacity exceeded. Available: 1, Requested: 2' }] }, 400),
    );

    await page.goto(`/launches/${activity.id}`);
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('alert')).toContainText('Capacity exceeded. Available: 1, Requested: 2');
    expect(await storedSession(page)).not.toBeNull();
  });

  test('un 401 borra la sesión y pide volver a iniciar sesión', async ({ page }) => {
    await signIn(page);
    await mockLaunch(page, 5);
    await page.route(`${API}/bookings`, (route) => json(route, { message: 'Unauthorized' }, 401));

    await page.goto(`/launches/${activity.id}`);
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Tu sesión ha caducado. Vuelve a iniciar sesión para reservar.');
    expect(await storedSession(page)).toBeNull();
  });

  test('tras reservar se recargan las plazas disponibles', async ({ page }) => {
    await signIn(page);
    let seats = 5;
    await page.route(`${API}/activities`, (route) => json(route, [activity]));
    await page.route(`${API}/activities/${activity.id}`, (route) => json(route, activity));
    await page.route(`${API}/activities/${activity.id}/availability`, (route) =>
      json(route, { activityId: activity.id, maxParticipants: 15, bookedParticipants: 15 - seats, availableSeats: seats }),
    );
    await page.route(`${API}/bookings`, (route) => {
      seats = 2;
      return json(route, { id: 'b-1' }, 201);
    });

    await page.goto(`/launches/${activity.id}`);
    await expect(page.getByText('5 plazas libres')).toBeVisible();
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByText('2 plazas libres')).toBeVisible();
  });

  test('un lanzamiento agotado no muestra el formulario', async ({ page }) => {
    await signIn(page);
    await mockLaunch(page, 0, 'sold-out');
    await page.goto(`/launches/${activity.id}`);

    await expect(page.getByText('Agotado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).toHaveCount(0);
  });
});
