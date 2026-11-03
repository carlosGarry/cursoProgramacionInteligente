# Authentication Specification

- **Reference**: [PRD](/PRD.md) FR4, TR2, TR4, [ADD](/ADD.md) API contract.
- **Issue**: pending (`feat-auth`, label `enhancement`).
- **Status**: Completed

## Problem Description

Customers must be logged in to book seats. The API protects `POST /bookings` with a JWT, so the client needs to register, log in, keep the token and send it on protected requests. Without this feature, the booking feature (FR2) cannot be tested end to end.

### User Stories

- As a **new customer**, I want **to register with username, email and password** so that **I can book launches**.
- As a **customer**, I want **to log in with my email and password** so that **I can access my bookings**.
- As a **customer**, I want **to be sent to the login page when my session is missing or expired** so that **I know I must log in again**.
- As a **customer**, I want **to log out** so that **my session is closed on this device**.

## Solution Overview

### User/App interface

- Route `/register`: form with username, email, password and terms checkbox. Shows field errors from the API.
- Route `/login`: form with email and password. Shows the API error message on failure.
- Header shows "Entrar" when logged out and "Salir" when logged in.
- After a successful login the customer is redirected to `/`.
- Route guards and redirects for protected pages are added in FR2/FR3, together with the first protected screen.

### API contract (as implemented in `activity-bookings-express`)

- `POST /users` with `{ username, email, password, terms: true }` returns `201 { user: { id, username, email, terms }, accessToken }`. Errors: `400 { message, errors[] }`.
- `POST /login` with `{ email, password }` returns `200 { user, accessToken }`. Wrong credentials return `401 { message: 'Invalid email or password', errors: [] }`.
- Protected endpoints require header `Authorization: Bearer <accessToken>`. Missing or invalid token returns `401`.

### Model and logic

- Service layer: `src/services/auth.service.ts` (register, login) uses `src/services/http.ts`.
- Session: the token and the user are stored in `localStorage` under one key. Storage is read through `src/services/session.ts` so components do not touch `localStorage` directly.
- `http.ts` provides a request helper that accepts a token and sends `Authorization: Bearer <token>`. It is not used by any screen until FR2.
- Logout only clears the local session; the API has no logout endpoint.
- The base URL comes from `VITE_API_URL` (already in place from FR1).

### Acceptance Criteria

- [x] WHEN the customer submits valid data on `/register` THE [System] SHALL call `POST /users`, store the returned token and user, and show the user as logged in.
- [x] WHEN the API rejects the registration THE [System] SHALL show the API `message` and the message of each field error next to its field.
- [x] WHEN the customer submits valid credentials on `/login` THE [System] SHALL call `POST /login`, store the returned token and user, and redirect to `/`.
- [x] WHEN the customer submits wrong credentials THE [System] SHALL show "Invalid email or password" and SHALL NOT store any token.
- [x] WHEN the customer reloads the page while logged in THE [System] SHALL keep the session from `localStorage`.
- [x] WHEN the customer clicks "Salir" THE [System] SHALL remove the stored session and show the user as logged out.
- [x] THE [System] SHALL NOT store the password in `localStorage`.

## Testing Strategy

- Playwright tests in `tests/auth.spec.ts` against the running client and the API on port 3000.
- Mocked routes (`page.route`) for error states (validation errors, wrong credentials).
- One smoke test that registers a new unique email against the real API and then logs in with it.
