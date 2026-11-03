import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';

const activities = [
  { id: 'activity-1', name: 'Luna', slug: 'luna', price: 100, date: '2026-12-01', duration: 60, location: 'Cabo', minParticipants: 1, maxParticipants: 5, status: 'published', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'activity-2', name: 'Marte', slug: 'marte', price: 200, date: '2026-12-02', duration: 60, location: 'Base', minParticipants: 1, maxParticipants: 4, status: 'sold-out', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'activity-3', name: 'Borrador', slug: 'borrador', price: 300, date: '2026-12-03', duration: 60, location: 'Nada', minParticipants: 1, maxParticipants: 3, status: 'draft', userId: 'u', createdAt: '2026-01-01T00:00:00Z' },
];

const seats: Record<string, number> = { 'activity-1': 3, 'activity-2': 0 };

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  });
}

async function mockApi(page: Page, options: { failAvailabilityFor?: string } = {}) {
  await page.route(`${API}/activities`, (route) => json(route, activities));
  await page.route(`${API}/activities/*/availability`, (route) => {
    const id = route.request().url().split('/').at(-2)!;
    if (id === options.failAvailabilityFor) return json(route, { message: 'boom' }, 500);
    return json(route, { activityId: id, maxParticipants: 5, bookedParticipants: 0, availableSeats: seats[id] ?? 0 });
  });
  await page.route(`${API}/activities/*`, (route) => {
    const id = route.request().url().split('/').at(-1)!;
    const activity = activities.find((a) => a.id === id);
    return activity ? json(route, activity) : json(route, { message: 'Activity not found', errors: [] }, 404);
  });
}

test.describe('Catálogo de lanzamientos', () => {
  test('muestra solo published y sold-out con precio y plazas', async ({ page }) => {
    await mockApi(page);
    await page.goto('/');

    const cards = page.getByTestId('launch-card');
    await expect(cards).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Luna' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Marte' })).toBeVisible();
    await expect(page.getByText('Borrador')).toHaveCount(0);
    await expect(cards.filter({ hasText: 'Luna' }).getByText('3 plazas libres')).toBeVisible();
    await expect(cards.filter({ hasText: 'Luna' }).getByText('100 €')).toBeVisible();
  });

  test('un lanzamiento agotado se muestra sin plazas y no es reservable', async ({ page }) => {
    await mockApi(page);
    await page.goto('/launches/activity-2');

    await expect(page.getByRole('heading', { name: 'Marte' })).toBeVisible();
    await expect(page.getByText('Agotado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeDisabled();
  });

  test('un lanzamiento publicado con plazas es reservable en el detalle', async ({ page }) => {
    await mockApi(page);
    await page.goto('/launches/activity-1');

    await expect(page.getByText('3 plazas libres')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeEnabled();
  });

  test('si falla la disponibilidad de un lanzamiento, los demás siguen visibles', async ({ page }) => {
    await mockApi(page, { failAvailabilityFor: 'activity-1' });
    await page.goto('/');

    await expect(page.getByTestId('launch-card')).toHaveCount(2);
    await expect(page.getByText('Plazas no disponibles')).toBeVisible();
    await expect(page.getByText('Agotado')).toBeVisible();
  });

  test('si la API no responde muestra un error con reintentar', async ({ page }) => {
    await page.route(`${API}/activities`, (route) => route.abort('connectionrefused'));
    await page.goto('/');

    await expect(page.getByRole('alert')).toContainText('No se pudo conectar con la API');
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  });

  test('un lanzamiento desconocido muestra mensaje de no encontrado', async ({ page }) => {
    await mockApi(page);
    await page.goto('/launches/activity-999');

    await expect(page.getByText('Lanzamiento no encontrado.')).toBeVisible();
  });
});

test('smoke: carga el catálogo desde la API real', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('launch-card').first()).toBeVisible();
});
