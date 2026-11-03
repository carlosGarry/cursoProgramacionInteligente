import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';
const SESSION_KEY = 'astrobookings.session';

const user = { id: 1, username: 'ana', email: 'ana@example.com', terms: true };
const session = { token: 'token-ana', user };

const bookings = [
  {
    id: 'b-1',
    activityId: 'activity-2',
    userId: '1',
    participants: 2,
    createdAt: '2025-01-02T10:00:00.000Z',
    paymentId: 'p-1',
    paymentStatus: 'paid',
    activity: {
      name: 'Luna Express',
      slug: 'luna-express',
      price: 2500,
      date: '2030-01-15T10:00:00.000Z',
      duration: 120,
      location: 'Base Lunar',
      status: 'published',
    },
  },
  {
    id: 'b-2',
    activityId: 'activity-3',
    userId: '1',
    participants: 1,
    createdAt: '2025-01-03T10:00:00.000Z',
    paymentId: 'p-2',
    paymentStatus: 'pending',
    activity: {
      name: 'Marte Sur',
      slug: 'marte-sur',
      price: 9000,
      date: '2030-06-01T10:00:00.000Z',
      duration: 240,
      location: 'Polo Sur de Marte',
      status: 'confirmed',
    },
  },
];

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization' },
    body: JSON.stringify(body),
  });
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

test.describe('Mis reservas', () => {
  test('lista las reservas del usuario con su estado de pago y su lanzamiento', async ({ page }) => {
    await signIn(page);
    let sentAuth: string | undefined;
    await page.route(`${API}/bookings`, (route) => {
      if (route.request().method() !== 'GET') return json(route, {}, 405);
      sentAuth = route.request().headers().authorization;
      return json(route, bookings);
    });

    await page.goto('/bookings');

    await expect(page.getByRole('heading', { name: 'Mis reservas' })).toBeVisible();
    const cards = page.getByTestId('booking-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.first().getByRole('heading', { name: 'Luna Express' })).toBeVisible();
    await expect(cards.first().getByText('Base Lunar')).toBeVisible();
    await expect(cards.first().getByText('2 plazas')).toBeVisible();
    await expect(cards.first().getByText('Pago: Pagada')).toBeVisible();
    await expect(cards.last().getByText('Pago: Pendiente')).toBeVisible();
    expect(sentAuth).toBe('Bearer token-ana');
  });

  test('muestra el mensaje de lista vacía con enlace al catálogo', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/bookings`, (route) => json(route, []));

    await page.goto('/bookings');

    await expect(page.getByText('Todavía no tienes reservas.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver lanzamientos' })).toBeVisible();
  });

  test('sin sesión redirige a login', async ({ page }) => {
    await page.route(`${API}/bookings`, (route) => json(route, bookings));

    await page.goto('/bookings');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('un 401 borra la sesión y redirige a login', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/bookings`, (route) => json(route, { message: 'Unauthorized' }, 401));

    await page.goto('/bookings');

    await expect(page).toHaveURL(/\/login$/);
    expect(await storedSession(page)).toBeNull();
  });

  test('un error del servidor muestra reintentar y recupera la lista', async ({ page }) => {
    await signIn(page);
    let failing = true;
    await page.route(`${API}/bookings`, (route) =>
      failing ? json(route, { message: 'boom' }, 500) : json(route, bookings),
    );

    await page.goto('/bookings');

    await expect(page.getByRole('alert')).toContainText('Ha ocurrido un error al cargar los datos.');
    failing = false;
    await page.getByRole('button', { name: 'Reintentar' }).click();
    await expect(page.getByTestId('booking-card')).toHaveCount(2);
  });

  test('el header enlaza a Mis reservas solo con sesión', async ({ page }) => {
    await page.route(`${API}/activities`, (route) => json(route, []));
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Mis reservas' })).toHaveCount(0);

    await signIn(page);
    await page.route(`${API}/bookings`, (route) => json(route, []));
    await page.goto('/');
    await page.getByRole('link', { name: 'Mis reservas' }).click();
    await expect(page).toHaveURL(/\/bookings$/);
  });
});
