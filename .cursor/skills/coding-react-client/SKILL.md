---
name: coding-react-client
description: >
  Writes React + TypeScript client code that consumes the AstroBookings REST API following layered architecture.
  To be used when implementing screens, components, API services, or hooks for the client.
---

# Coding React Client Skill

Write small, typed React components on top of a typed API service layer.

## Layered Architecture

```
UI Components (src/components)  →  Hooks (src/hooks)  →  Services (src/services)  →  AstroBookings API
                                          ↓
                                  Types (src/types)  ← API contracts
```

- **Components**: presentation and user events only. No `fetch` calls.
- **Hooks**: state, loading and error handling for a feature. Call services.
- **Services**: HTTP calls to the API, JWT header, response parsing, error mapping.
- **Types**: request/response contracts in `src/types/`. Mirror the API types.

## Steps

1. Read the specification and its plan in the issue.
2. Define or update contract types in `src/types/` (one file per entity, e.g. `launch.type.ts`).
3. Add or extend the service in `src/services/` using a single configured HTTP helper.
4. Add a hook in `src/hooks/` when a screen needs state or async logic.
5. Build components in `src/components/`, one per file, with typed props.
6. Handle every API error status (400, 401, 404) and show the `message` and `errors` fields.

## Rules

- Read the API base URL from an environment variable (`VITE_API_URL`). Never hardcode it.
- Send the JWT in the `Authorization` header for protected endpoints only.
- Keep `strict` TypeScript. Do not use `any`.
- Validate form input before calling the service; the API remains the source of truth.
- Prevent booking more seats than available in the UI, but rely on the API for the final check.
- Use named exports. Use `kebab-case` file names.
