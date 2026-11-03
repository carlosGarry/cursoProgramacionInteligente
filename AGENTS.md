# Agents Instructions

## Product Overview
- AstroBookings client: a React web app to consume the AstroBookings API.
- Customers browse rocket launches with rocket, price and seats.
- Customers book seats without exceeding available seats.
- Customers see booking status and their own bookings.
- AstroBookings is fictional. Demonstration and training only.

## Technical Implementation

### Tech Stack
- **Language**: TypeScript (strict mode)
- **UI**: React
- **Build**: Vite
- **Testing**: Playwright for E2E tests
- **Backend**: AstroBookings API (activity-bookings-express), consumed over REST
- **API URL**: local, `http://localhost:3000` (`npm run dev` in activity-bookings-express)
- **Auth**: JWT from the API, sent in the `Authorization` header

### Development workflow

```bash
# Set up the project (step 2)
npm install

# Run the project
npm run dev          # Development mode
npm run build        # Production build
npm run preview      # Serve the production build

# Test the project
npm test             # E2E tests with Playwright

# Type-check only
npm run typecheck
```

### Folder structure
```text
.                         # Project root
├── src/                  # Source code
│   ├── main.tsx          # Entry point
│   ├── app/              # Router and app shell
│   ├── pages/            # One page per screen
│   ├── components/       # Presentational components
│   ├── hooks/            # Feature hooks (state, async)
│   ├── services/         # API client and feature services
│   ├── types/            # API contract types
│   └── utils/            # Shared utilities
├── tests/                # E2E tests (Playwright)
├── specs/                # Acceptance criteria specifications
├── AGENTS.md             # This file
├── ADD.md                # Architectural Design Document
└── PRD.md                # Product Requirements Document
```

## Environment
- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Sacrifice grammar for conciseness when needed to fit response limits.
- This is a windows environment using git bash terminal.
- Mind the available **agent skills** when performing tasks.
- When using templates, ensure to replace {placeholders} with actual values.
- Follow layered architecture: Components → Hooks → Services → Types.
- Components never call fetch. Only services call the API.
- Use API contract types from `src/types/`.
- Read the API base URL from `VITE_API_URL`. Never hardcode it.
- Send the JWT only to protected endpoints (`/bookings`).
- Validate form input before calling services. The API is the final check.
- Handle API errors shaped as `{ message, errors }`.

### Naming Conventions

Use slugs with hyphens for any identifiers or non code file names.

Use this table to determine the prefixes :

| Spec        | GitHub Label  | Git Branch    | Commit  |
|-------------|---------------|---------------|---------|
| feat-<slug> | enhancement   | feat/<slug>   | feat:   |
| bug-<slug>  | bug           | fix/<slug>    | fix:    |
| chore-<slug>| chore         | chore/<slug>  | chore:  |

Default git branch is `main` unless specified otherwise.
