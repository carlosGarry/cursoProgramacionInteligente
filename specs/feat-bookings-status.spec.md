# Feature: Estado de reservas y "Mis reservas"

**Reference**: FR3 (PRD.md)
**Issue**: #4
**Status**: Completed

---

## Problem

Tras reservar, el viajero no tiene forma de ver sus reservas ni su estado. No puede comprobar si el pago de una reserva está confirmado ni a qué lanzamiento pertenece.

## User Stories

- Como viajero autenticado, quiero ver la lista de mis reservas para saber qué lanzamientos tengo reservados.
- Como viajero, quiero ver el estado de pago de cada reserva (pagada, pendiente o reembolsada).
- Como viajero, quiero ver el lanzamiento al que pertenece cada reserva (nombre, fecha, lugar) y el número de plazas.
- Como viajero sin sesión, quiero que la página "Mis reservas" me pida iniciar sesión.

## Solution Overview

- Nueva página `/bookings` ("Mis reservas") protegida por sesión.
- Sin sesión, `RequireAuth` redirige a `/login`.
- La página llama a `GET /bookings` con el token Bearer. La API devuelve solo las reservas del usuario, con `paymentStatus` y los datos del lanzamiento en `activity`.
- Cada reserva muestra: nombre del lanzamiento, fecha, lugar, número de plazas, estado de pago y fecha de la reserva.
- Etiquetas de estado de pago: `paid` → "Pagada", `pending` → "Pendiente", `refunded` → "Reembolsada".
- Lista vacía: mensaje "Todavía no tienes reservas" con enlace al catálogo.
- Un `401` cierra la sesión local y redirige a `/login`.
- En el header aparece el enlace "Mis reservas" cuando hay sesión.

## Acceptance Criteria

- [ ] Con sesión, `/bookings` llama a `GET /bookings` con `Authorization: Bearer <token>`.
- [ ] Cada reserva muestra nombre, fecha, lugar, plazas y estado de pago.
- [ ] Los estados `paid`, `pending` y `refunded` se muestran con su etiqueta en español.
- [ ] Sin sesión, `/bookings` redirige a `/login`.
- [ ] Sin reservas, se muestra el mensaje de lista vacía con enlace al catálogo.
- [ ] Un `401` borra la sesión y redirige a `/login`.
- [ ] Un error de red o del servidor muestra el mensaje de error con "Reintentar".
- [ ] El header muestra "Mis reservas" solo con sesión.

## Testing Strategy

- Playwright (`tests/my-bookings.spec.ts`) con `page.route` para simular la API:
  - Lista con varias reservas y sus estados de pago.
  - Lista vacía.
  - Sin sesión: redirección a login.
  - 401: sesión borrada y redirección a login.
  - Error del servidor con reintento.
- Verificación manual con la API local y el cliente Vite.

## Notes

- "Estado de la reserva" se interpreta como el estado de pago (`paymentStatus`), que es el único estado de reserva que expone la API.
