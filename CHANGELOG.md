# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Project structure for Spec-Driven Development: agents, prompts, skills, and instructions for GitHub Copilot and Cursor.
- Product Requirements Document (`PRD.md`) for the AstroBookings client.
- Architectural Design Document (`ADD.md`) and agent instructions (`AGENTS.md`).
- Launch catalog (FR1): list of published, confirmed and sold-out launches with price and available seats, and a detail page. Seats come from the API endpoint `GET /activities/:id/availability`.
- Playwright E2E tests for the launch catalog (`tests/launch-catalog.spec.ts`).
- Authentication (FR4): registration on `/register`, login on `/login`, session kept in `localStorage`, and logout. Playwright tests in `tests/auth.spec.ts`.
- Seat booking (FR2): the launch detail page books a number of seats through `POST /bookings` with the session token. The form is limited to the available seats, and it asks for login when there is no session. Playwright tests in `tests/booking-seats.spec.ts`.
- My bookings (FR3): `/bookings` ("Mis reservas") lists the user's bookings from `GET /bookings` with the launch data and the payment status, and redirects to login without a session. Playwright tests in `tests/my-bookings.spec.ts`.

### Fixed
- API: registration and login now share one `UserService` instance, so users registered while the server runs can log in (`activity-bookings-express`, branch `fix/shared-user-service`).
