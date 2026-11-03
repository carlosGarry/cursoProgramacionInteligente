import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';
const SESSION_KEY = 'astrobookings.session';

const user = { id: 1, username: 'ana', email: 'ana@example.com', terms: true };
const session = { token: 'token-ana', user };

const launch = {
  id: 'activity-3', name: 'Venus', slug: 'venus', price: 150, date: '2026-12-04', duration: 60,
  location: 'Orbita', minParticipants: 1, maxParticipants: 6, status: 'published', userId: 'u', createdAt: '2026-01-01T00:00:00Z',
};

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

test.describe('Mensajes de formulario como notificaciones', () => {
  test('elegir más plazas que las libres muestra un toast y no cambia el formulario', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/activities`, (route) => json(route, [launch]));
    await page.route(`${API}/activities/activity-3`, (route) => json(route, launch));
    await page.route(`${API}/activities/activity-3/availability`, (route) =>
      json(route, { activityId: 'activity-3', maxParticipants: 6, bookedParticipants: 2, availableSeats: 4 }),
    );
    let bookingCalled = false;
    await page.route(`${API}/bookings`, (route) => {
      if (route.request().method() !== 'POST') return json(route, {}, 405);
      bookingCalled = true;
      return json(route, {}, 201);
    });
    await page.goto('/launches/activity-3');

    const form = page.locator('form.booking-form');
    const heightBefore = (await form.boundingBox())?.height;

    await page.getByLabel('Número de plazas').fill('6');
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Elige entre 1 y 4 plazas.');
    await expect(page.locator('.form-error')).toHaveCount(0);
    await expect(page.getByLabel('Número de plazas')).toHaveValue('6');
    expect((await form.boundingBox())?.height).toBe(heightBefore);
    expect(bookingCalled).toBe(false);
  });

  test('un error de validación del registro muestra un único toast con los mensajes de campo', async ({ page }) => {
    await page.route(`${API}/users`, (route) =>
      json(
        route,
        {
          message: 'Validation error',
          errors: [
            { field: 'username', message: 'Username is already taken' },
            { field: 'email', message: 'Email is already registered' },
          ],
        },
        400,
      ),
    );
    await page.goto('/register');

    await page.getByLabel('Nombre de usuario').fill('ana');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('123456');
    await page.getByLabel('Acepto los términos y condiciones').check();
    await page.getByRole('button', { name: 'Registrarse' }).click();

    await expect(page.getByRole('alert')).toHaveText('Username is already taken Email is already registered');
    await expect(page.locator('.form-error')).toHaveCount(0);
  });

  test('credenciales incorrectas en el login muestran un toast de error', async ({ page }) => {
    await page.route(`${API}/login`, (route) => json(route, { message: 'Invalid email or password' }, 401));
    await page.goto('/login');

    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('mal');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
    await expect(page.locator('.form-error')).toHaveCount(0);
  });
});
