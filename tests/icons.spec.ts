import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';
const SESSION_KEY = 'astrobookings.session';

const user = { id: 1, username: 'ana', email: 'ana@example.com', terms: true };
const session = { token: 'token-ana', user };

const activities = [
  { id: 'activity-1', name: 'Luna', slug: 'luna', price: 100, date: '2026-12-01', duration: 60, location: 'Cabo', minParticipants: 1, maxParticipants: 5, status: 'published', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
];

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  });
}

async function mockApi(page: Page) {
  await page.route(`${API}/activities`, (route) => json(route, activities));
  await page.route(`${API}/activities/*/availability`, (route) => {
    const id = route.request().url().split('/').at(-2)!;
    return json(route, { activityId: id, maxParticipants: 5, bookedParticipants: 0, availableSeats: 3 });
  });
}

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

test.describe('Iconografía', () => {
  test('la cabecera muestra iconos decorativos y los enlaces conservan su nombre', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');

    const header = page.locator('.app-header');
    await expect(header.locator('svg.icon')).toHaveCount(3);
    await expect(header.locator('svg.icon').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible();
  });

  test('cada tarjeta de lanzamiento muestra iconos de lugar, fecha, precio y plazas', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');

    const card = page.getByTestId('launch-card').first();
    await expect(card.locator('.meta-row svg.icon')).toHaveCount(4);
    await expect(card.locator('svg.icon').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(card.getByRole('link', { name: 'Luna' })).toBeVisible();
  });

  test('el toast de éxito muestra su icono', async ({ page }) => {
    await page.addInitScript(
      ([key, value]) => localStorage.setItem(key, value),
      [SESSION_KEY, JSON.stringify(session)],
    );
    await page.route(`${API}/activities`, (route) => json(route, []));
    await page.goto('/');

    await page.getByRole('button', { name: 'Salir' }).click();
    const toast = page.locator('.toast-success');
    await expect(toast.locator('svg.toast-icon')).toHaveCount(1);
    await expect(toast.locator('svg.toast-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  test('en móvil la cabecera y las tarjetas con iconos no desbordan', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockApi(page);
    await page.goto('/');

    await expect(page.getByTestId('launch-card')).toHaveCount(1);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});
