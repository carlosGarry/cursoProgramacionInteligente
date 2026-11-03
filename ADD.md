# AstroBookings Client Architectural Design Document

A React and TypeScript single-page application that consumes the AstroBookings REST API. The client follows a layered architecture: components render the UI, hooks manage state, services call the API, and types define the contracts.

### Table of Contents
- [Stack and tooling](#stack-and-tooling)
- [Systems Architecture](#systems-architecture)
- [Software Architecture](#software-architecture)
- [API contract](#api-contract)
- [Architecture Decisions Record (ADR)](#architecture-decisions-record-adr)

## Stack and tooling

### Technology Stack
- **Language**: TypeScript (strict mode)
- **UI Library**: React
- **Build Tool and Dev Server**: Vite
- **Routing**: React Router
- **Authentication**: JWT stored in memory or localStorage, sent in the `Authorization` header
- **End-to-end testing**: Playwright
- **Backend**: AstroBookings API (`activity-bookings-express`), consumed over REST. Runs locally at `http://localhost:3000` (`npm run dev`).

### Development Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript compiler (`tsc --noEmit`)
- **Scripts** (to be created in step 2):
  - `dev`: Run the Vite dev server
  - `build`: Type-check and build for production
  - `preview`: Serve the production build
  - `test`: Run Playwright tests
  - `typecheck`: Type checking only
- **Environment**: Windows with Git Bash terminal
- **Version Control**: Git (default branch: main), remote `origin` on GitHub

## Systems Architecture

The client is a single-page web app. It runs in the browser and talks to the AstroBookings API over HTTP. The client holds no business data of its own; the API is the source of truth for launches, seats and bookings.

### Main Components

1. **UI Components**: Screens for the launch catalog, launch details, booking form, login/registration, and my bookings.
2. **Hooks**: Feature state, loading and error handling.
3. **API Services**: HTTP calls to the AstroBookings API with the JWT header.
4. **Types**: Request and response contracts that mirror the API.
5. **Router**: Maps URLs to screens and protects routes that need login.

### Component Interactions

```
Browser
    ↓
Router (src/app)
    ↓
UI Components (src/components, src/pages)
    ↓
Hooks (src/hooks)
    ↓
API Services (src/services)  ──HTTP/JSON + JWT──▶  AstroBookings API
    ↓
Types (src/types)
```

### Architecture Diagram (C4 Model - Level 1: System Context)

```
┌──────────────┐
│   Customer   │
└──────┬───────┘
       │ Browser
┌──────▼───────────────────────┐        HTTP/REST + JWT       ┌───────────────────────────┐
│   AstroBookings Web Client   │ ───────────────────────────▶ │   AstroBookings API       │
│   (React + Vite)             │                              │   (activity-bookings-     │
└──────────────────────────────┘                              │    express)               │
                                                              └───────────────────────────┘
```

## Software Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────┐
│   UI Layer (Components/Pages)   │  ← Rendering and user events
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Hooks Layer (State)           │  ← Loading, errors, feature state
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Services Layer (API)          │  ← HTTP, JWT header, error mapping
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Types Layer (Contracts)       │  ← Request/response types
└─────────────────────────────────┘
```

### Project Structure (planned for step 2)

```
├── src/
│   ├── main.tsx              # Application entry point
│   ├── app/                  # Router and app shell
│   ├── pages/                # One page per screen
│   ├── components/           # Reusable presentational components
│   ├── hooks/                # Feature hooks (state, async)
│   ├── services/             # API client and feature services
│   ├── types/                # API contract types
│   └── utils/                # Shared utilities
├── tests/                    # Playwright E2E tests
├── specs/                    # Acceptance criteria specifications
├── .github/                  # Copilot agents, prompts, skills, instructions
├── .cursor/                  # Cursor commands, skills, rules
├── AGENTS.md                 # Agent instructions
├── ADD.md                    # This document
├── PRD.md                    # Product Requirements Document
└── CHANGELOG.md              # Keep a Changelog format
```

## API contract

The client consumes these AstroBookings API endpoints (base URL from `VITE_API_URL`).

| Method | Endpoint          | Auth | Purpose                                  |
|--------|-------------------|------|------------------------------------------|
| POST   | `/users`          | No   | Register a customer                      |
| POST   | `/login`          | No   | Log in and receive a JWT                 |
| GET    | `/activities`     | No   | Launch catalog (launches with seats)     |
| GET    | `/activities/:id` | No   | Launch details                           |
| POST   | `/bookings`       | Yes  | Book seats on a launch                   |
| GET    | `/bookings`       | Yes  | List the customer's bookings             |
| GET    | `/bookings/:id`   | Yes  | Booking details and status               |

**Mapping from the briefing**: a *launch* is an API *activity*. *Rocket* and *price* come from the activity fields. *Seats* are `maxParticipants` minus existing bookings.

**Error format**: `{ message: string, errors: ValidationError[] }`.

## Architecture Decisions Record (ADR)

### ADR-001: React with Vite for the client
- **Status**: Proposed
- **Context**: The briefing allows any web or terminal stack. The course prefers a web client.
- **Decision**: Use React with TypeScript and Vite.
- **Consequences**: Fast dev server and simple build. Requires a small amount of routing setup.

### ADR-002: Services isolate HTTP from components
- **Status**: Proposed
- **Context**: Components must stay testable and independent of the API shape.
- **Decision**: Components never call `fetch`. Services own HTTP and map errors; hooks own state.
- **Consequences**: Clear layers. More files, but each file has one job.

### ADR-003: JWT stored by the client, sent per request
- **Status**: Proposed
- **Context**: The API protects booking endpoints with JWT (TR2 of the API).
- **Decision**: Store the token after login and send it in the `Authorization` header from the service layer.
- **Consequences**: Simple to implement. Not production-grade storage; acceptable for training.

### ADR-004: Playwright for end-to-end tests
- **Status**: Proposed
- **Context**: Acceptance criteria are user-visible behaviour.
- **Decision**: Test each spec in a real browser with Playwright against the running API.
- **Consequences**: Slower than unit tests, but it verifies the full flow.
