# AstroBookings Client Product Requirements Document

A React web client that consumes the AstroBookings REST API so customers can browse rocket launches, book seats without overbooking, and review their bookings.

## Vision and Scope

**Vision**: Give customers a simple web interface to discover space travel launches and reserve seats, using the AstroBookings API as the only source of truth.

**Target Users**:
- **Customers**: Individuals who browse launches and book seats (identified by email, with password).

**Problems Solved**:
- Browsing available launches with rocket, price and seats
- Preventing bookings that exceed available seats
- Checking booking status and reviewing past bookings

### Scope

**In Scope**:
- Launch catalog with details (rocket, price, seats)
- Seat booking on a launch
- Booking status and "my bookings" view
- Login and registration needed to call the protected API endpoints

**Out of Scope**:
- Backend implementation (the AstroBookings API is consumed, not built here)
- Payment processing and refunds
- Launch creation or management
- Production security hardening (the project is for demonstration and training)
- Terminal (CLI) interface

## Functional Requirements

### FR1: Launch Catalog
- **Description**: Customers see the list of available launches with rocket name, price, and remaining seats. They can open a launch to see its details.
- **Priority**: High
- **Status**: Completed
- **Description**: Customers book a number of seats on a launch. The client blocks requests above the remaining seats and shows the API error when the booking fails.
- **Priority**: High
- **Status**: NotStarted

### FR3: Booking Status and My Bookings
- **Description**: Customers see the status of each booking and a list of their own bookings with the launch they belong to.
- **Priority**: High
- **Status**: NotStarted

### FR4: Authentication
- **Description**: Customers register and log in with email and password. The client keeps the JWT and uses it for booking endpoints.
- **Priority**: High
- **Status**: Completed

## Technical Requirements

### TR1: Typed API Client
- **Description**: All HTTP calls go through a service layer with types that mirror the AstroBookings API contracts. The base URL comes from `VITE_API_URL`.
- **Priority**: High
- **Status**: NotStarted

### TR2: JWT Handling
- **Description**: The JWT is stored after login and sent in the `Authorization` header for protected endpoints. Expired or missing tokens redirect the customer to login.
- **Priority**: High
- **Status**: NotStarted

### TR3: TypeScript Strict Mode
- **Description**: All code is TypeScript with `strict` enabled. No `any` types.
- **Priority**: High
- **Status**: NotStarted

### TR4: Error Handling
- **Description**: The client handles the API error format `{ message: string, errors: ValidationError[] }` and displays the message and field errors to the customer.
- **Priority**: Medium
- **Status**: NotStarted

### TR5: End-to-End Tests with Playwright
- **Description**: Acceptance criteria of each spec are verified with Playwright tests in a real browser against the running API.
- **Priority**: Medium
- **Status**: NotStarted
