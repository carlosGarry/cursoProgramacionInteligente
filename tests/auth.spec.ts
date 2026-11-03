import { test, expect, type Page, type Route } from '@playwright/test';

const API = 'http://localhost:3000';
const SESSION_KEY = 'astrobookings.session';

const user = { id: 1, username: 'ana', email: 'ana@example.com', terms: true };

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  });
}

async function mockCatalog(page: Page) {
  await page.route(`${API}/activities`, (route) => json(route, []));
}

async function storedSession(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), SESSION_KEY);
}

test.describe('Autenticación', () => {
  test('el registro muestra los errores de campo que devuelve la API', async ({ page }) => {
    await mockCatalog(page);
    await page.route(`${API}/users`, (route) =>
      json(route, { message: 'Validation failed', errors: [{ field: 'email', message: 'Email is already registered' }] }, 400),
    );
    await page.goto('/register');

    await page.getByLabel('Nombre de usuario').fill('ana');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('secret1');
    await page.getByLabel('Acepto los términos y condiciones').check();
    await page.getByRole('button', { name: 'Registrarse' }).click();

    await expect(page.getByText('Email is already registered')).toBeVisible();
    expect(await storedSession(page)).toBeNull();
  });

  test('credenciales incorrectas muestran error y no guardan sesión', async ({ page }) => {
    await mockCatalog(page);
    await page.route(`${API}/login`, (route) =>
      json(route, { message: 'Invalid email or password', errors: [] }, 401),
    );
    await page.goto('/login');

    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('mal-password');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
    expect(await storedSession(page)).toBeNull();
  });

  test('login correcto guarda la sesión, sobrevive a recargas y se cierra con Salir', async ({ page }) => {
    await mockCatalog(page);
    await page.route(`${API}/login`, (route) => json(route, { user, accessToken: 'token-test' }));
    await page.goto('/login');

    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Contraseña').fill('secret1');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Hola, ana')).toBeVisible();
    expect(await storedSession(page)).not.toContain('secret1');

    await page.reload();
    await expect(page.getByText('Hola, ana')).toBeVisible();

    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    expect(await storedSession(page)).toBeNull();
  });
});

test('registro real contra la API levanta sesión y permite volver a entrar', async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'secret1';
  await page.goto('/register');

  await page.getByLabel('Nombre de usuario').fill('smoke');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByLabel('Acepto los términos y condiciones').check();
  await page.getByRole('button', { name: 'Registrarse' }).click();

  await expect(page.getByText('Hola, smoke')).toBeVisible();
  await page.getByRole('button', { name: 'Salir' }).click();

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Hola, smoke')).toBeVisible();
});
