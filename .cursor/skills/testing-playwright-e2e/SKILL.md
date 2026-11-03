---
name: testing-playwright-e2e
description: >
  Writes end-to-end browser tests with Playwright for the AstroBookings React client.
  To be used for verifying acceptance criteria of specs through the user interface.
---

# Playwright E2E Testing Skill

Write end-to-end tests that drive the client in a real browser against a running AstroBookings API. Tests verify acceptance criteria from the specification.

## Project Structure

```
tests/
├── launch-catalog.spec.ts      # One file per feature or spec
└── booking-creation.spec.ts
specs/
└── feat-launch-catalog.spec.md # Acceptance criteria in EARS format
```

- Use kebab-case file names with the `.spec.ts` suffix.
- One test file per spec. Name tests after the acceptance criterion they verify.

## Test Structure

Group tests with `test.describe()` and write one scenario per `test()`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Launch catalog', () => {
  test('THE client SHALL display rocket, price and available seats for each launch', async ({ page }) => {
    // Arrange
    await page.goto('/');

    // Act
    const firstLaunch = page.getByRole('listitem').first();

    // Assert
    await expect(firstLaunch).toContainText(/Seats/i);
  });
});
```

## Patterns

- **Arrange-Act-Assert** in every test.
- Locate elements by role, label, or text (`getByRole`, `getByLabel`, `getByText`). Avoid CSS selectors.
- Use web-first assertions (`expect(locator).toBeVisible()`), which auto-wait. Avoid fixed timeouts.
- Register users through the UI or the API in `beforeEach`. Do not depend on test order.
- Cover error paths: unauthenticated booking, booking more seats than available, and API errors shown to the user.

## Running

- Start the API and the client, then run `npx playwright test`.
- Report failing acceptance criteria instead of weakening assertions.
