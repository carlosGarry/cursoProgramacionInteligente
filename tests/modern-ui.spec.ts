import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';

const activities = [
  { id: 'activity-1', name: 'Luna', slug: 'luna', price: 100, date: '2026-12-01', duration: 60, location: 'Cabo', minParticipants: 1, maxParticipants: 5, status: 'published', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'activity-2', name: 'Marte', slug: 'marte', price: 200, date: '2026-12-02', duration: 60, location: 'Base', minParticipants: 1, maxParticipants: 4, status: 'sold-out', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'activity-3', name: 'Venus', slug: 'venus', price: 150, date: '2026-12-04', duration: 60, location: 'Orbita', minParticipants: 1, maxParticipants: 6, status: 'published', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
];

const seats: Record<string, number> = { 'activity-1': 3, 'activity-2': 0, 'activity-3': 4 };

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
    return json(route, { activityId: id, maxParticipants: 5, bookedParticipants: 0, availableSeats: seats[id] ?? 0 });
  });
}

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

async function visibleHeaderCount(page: Page) {
  return page.locator('.launches-table thead th').evaluateAll((ths) => ths.filter((th) => getComputedStyle(th).display !== 'none').length);
}

test.describe('Diseño moderno y responsive', () => {
  test('en móvil la tabla de lanzamientos apila las filas y no hay desbordamiento horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockApi(page);
    await page.goto('/');

    await expect(page.getByTestId('launch-row')).toHaveCount(3);
    await expect(page.locator('.launches-table thead')).toBeHidden();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test('en escritorio la tabla de lanzamientos muestra la cabecera con sus seis columnas', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await mockApi(page);
    await page.goto('/');

    await expect(page.getByTestId('launch-row')).toHaveCount(3);
    await expect(page.locator('.launches-table thead')).toBeVisible();
    expect(await visibleHeaderCount(page)).toBe(6);
  });

  test('en móvil los controles del formulario tienen al menos 44 px de alto', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login');

    const input = page.locator('input').first();
    const button = page.locator('form button').first();
    await expect(input).toBeVisible();
    expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test('en móvil el header se apila sin desbordar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('.app-header')).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});
