# Feature: Reservar plazas en un lanzamiento

**Reference**: FR2 (PRD.md)
**Issue**: pendiente (crear en GitHub y poner el número aquí)
**Status**: Completed

---

## Problem

El detalle de un lanzamiento muestra el botón "Reservar", pero no hace nada. Un viajero no puede reservar plazas, por lo que el catálogo no cumple su objetivo principal.

## User Stories

- Como viajero autenticado, quiero elegir cuántas plazas reservar en un lanzamiento para viajar acompañado.
- Como viajero, quiero que el sistema me impida reservar más plazas de las que quedan libres.
- Como viajero sin sesión, quiero que se me pida iniciar sesión antes de reservar.
- Como viajero, quiero ver un mensaje claro si mi reserva se confirma o se rechaza.

## Solution Overview

- En `LaunchDetailPage`, el botón "Reservar" se sustituye por un formulario con un selector de número de plazas (`participants`).
- El selector tiene como máximo las plazas disponibles del lanzamiento y como mínimo 1.
- Si no hay sesión, el formulario no se muestra y se muestra un enlace a `/login`.
- La reserva llama a `POST /bookings` con el token Bearer y el cuerpo `{ activityId, participants }`.
- Tras una reserva correcta se muestra un mensaje de confirmación y se recargan las plazas disponibles.
- Un `401` cierra la sesión local y pide volver a iniciar sesión.
- Un `400` (capacidad excedida o validación) muestra el mensaje devuelto por la API.
- Un `404` muestra "Lanzamiento no encontrado" y un `402` muestra el error de pago.

## Acceptance Criteria

- [ ] Con sesión y plazas disponibles, el formulario permite elegir entre 1 y las plazas disponibles.
- [ ] La petición `POST /bookings` incluye `Authorization: Bearer <token>` y el cuerpo `{ activityId, participants }`.
- [ ] Sin sesión, no se muestra el formulario y aparece un enlace a `/login`.
- [ ] Si el lanzamiento no es reservable (estado o sin plazas), no se muestra el formulario.
- [ ] Tras reservar, aparece el mensaje de confirmación y se actualizan las plazas disponibles.
- [ ] Un `400` de capacidad muestra el mensaje de la API y no cambia la sesión.
- [ ] Un `401` borra la sesión guardada y muestra el aviso para volver a iniciar sesión.
- [ ] Un `402` muestra el mensaje de error de pago.

## Testing Strategy

- Playwright (`tests/booking-seats.spec.ts`) con `page.route` para simular la API:
  - Reserva correcta con verificación del cuerpo y la cabecera Authorization.
  - Sin sesión: enlace a login y sin formulario.
  - Capacidad excedida (400) mostrando el mensaje.
  - Token inválido (401) limpiando la sesión.
  - Lanzamiento sin plazas: sin formulario.
- Verificación manual con la API local (`http://localhost:3000`) y el cliente Vite.

## Notes

- La API calcula la disponibilidad como `maxParticipants - suma de participantes`. El cliente no calcula plazas por su cuenta: confía en `GET /activities/:id/availability` y en la validación del `POST /bookings`.
