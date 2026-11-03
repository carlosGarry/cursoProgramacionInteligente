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

test.describe('Mensajes emergentes', () => {
  test('al iniciar sesión aparece un toast de éxito', async ({ page }) => {
    await page.route(`${API}/login`, (route) => json(route, { accessToken: 'token-ana', user }));
    await page.route(`${API}/activities`, (route) => json(route, []));
    await page.goto('/login');

    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('status')).toHaveText('Sesión iniciada como ana.');
  });

  test('al cerrar sesión aparece un toast que se puede cerrar con su botón', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/activities`, (route) => json(route, []));
    await page.goto('/');

    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page.getByRole('status')).toHaveText('Has cerrado sesión.');

    await page.getByRole('button', { name: 'Cerrar notificación' }).click();
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('el toast desaparece solo a los 4 segundos', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/activities`, (route) => json(route, []));
    await page.goto('/');

    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0, { timeout: 6000 });
  });

  test('una reserva rechazada muestra un toast de error', async ({ page }) => {
    await signIn(page);
    await page.route(`${API}/activities`, (route) => json(route, [launch]));
    await page.route(`${API}/activities/*/availability`, (route) =>
      json(route, { activityId: 'activity-3', maxParticipants: 6, bookedParticipants: 0, availableSeats: 4 }),
    );
    await page.route(`${API}/activities/activity-3`, (route) => json(route, launch));
    await page.route(`${API}/bookings`, (route) => {
      if (route.request().method() !== 'POST') return json(route, {}, 405);
      return json(route, { message: 'Capacity exceeded. Available: 4, Requested: 6' }, 400);
    });
    await page.goto('/launches/activity-3');

    await page.getByLabel('Número de plazas').fill('4');
    await page.getByRole('button', { name: 'Reservar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Capacity exceeded. Available: 4, Requested: 6');
  });
});
