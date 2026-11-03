# Launch Catalog Specification

- **Reference**: [PRD](/PRD.md) FR1, [ADD](/ADD.md) API contract.
- **Issue**: #1 (`feat-launch-catalog`, label `enhancement`).
- **Status**: Completed

## Problem Description

Customers need to see which rocket launches are available, with their price and free seats, before they can book. The API exposes activities (launches) but not their remaining seats in the list response, so the client must query the availability endpoint added in the API (`GET /activities/:id/availability`).

### User Stories

- As a **customer**, I want **to see the list of upcoming launches** so that **I can choose one to book**.
- As a **customer**, I want **to see the rocket, price and free seats of each launch** so that **I can compare options**.
- As a **customer**, I want **to see launches that are sold out** so that **I know they exist even though I cannot book them**.
- As a **customer**, I want **to open a launch's details** so that **I can read its full information before booking**.

## Solution Overview

### User/App interface

- Route `/` (launch list): cards or rows with name (rocket), date, price and available seats.
- Route `/launches/:id` (launch detail): full information and seats, plus a "Reservar" button. The button is enabled only for bookable launches; its action is added in FR2.
- Launches with status `published` or `confirmed` are bookable (if they have seats).
- Launches with status `sold-out` show "Agotado" and the "Reservar" button is disabled.
- Other statuses (`draft`, `done`, `cancelled`) are not listed.
- Loading, empty and error states are visible to the user.

### Model and logic

- Mapping from API to view model:
  - Launch = API activity.
  - Rocket = activity `name` (the API has no separate rocket field).
  - Price = `price`.
  - Seats = `availableSeats` from `GET /activities/:id/availability`.
- Data access goes through `src/services/` (HTTP client and activities service); components never call `fetch` directly.
- Seats are fetched per launch after the list loads. A failed seat request shows the launch with seats marked as unknown, without hiding the other launches.
- The base URL comes from `VITE_API_URL` (default `http://localhost:3000`).
- Public endpoints only: no JWT is needed for this feature.

### Acceptance Criteria

- [ ] WHEN the customer opens `/` THE [System] SHALL request `GET /activities` and display every activity whose status is `published`, `confirmed` or `sold-out`.
- [ ] WHEN the list is displayed THE [System] SHALL show, for each launch, its name, price and available seats.
- [ ] WHEN a launch is `sold-out` THE [System] SHALL show it with 0 seats and SHALL NOT enable its booking action.
- [ ] WHEN a launch is `draft`, `done` or `cancelled` THE [System] SHALL NOT display it.
- [ ] WHEN the list is loading THE [System] SHALL show a loading indicator.
- [ ] WHEN the API is unreachable THE [System] SHALL show an error message with a retry action.
- [ ] WHEN the list is empty THE [System] SHALL show an empty-state message.
- [ ] WHEN the availability request for one launch fails THE [System] SHALL show that launch's seats as unknown and SHALL keep displaying the other launches.
- [ ] WHEN the customer opens `/launches/:id` THE [System] SHALL request `GET /activities/:id` and display its details and available seats.
- [ ] WHEN the customer opens `/launches/:id` for an unknown id THE [System] SHALL show a "not found" message.
- [ ] THE [System] SHALL read the API base URL from `VITE_API_URL`.
