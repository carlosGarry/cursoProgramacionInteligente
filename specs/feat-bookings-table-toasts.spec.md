# Feature: Mis reservas en tabla y mensajes emergentes

**Reference**: FR6 (PRD.md)
**Issue**: #6
**Status**: Completed

---

## Problem

"Mis reservas" muestra cada reserva como una tarjeta con texto suelto. Es difícil comparar reservas y no tiene la estructura visual del resto de la aplicación. Además, las acciones (reservar, entrar, salir) confirman el resultado con texto en la propia página, que se pierde fácilmente o pasa desapercibido.

## User Stories

- Como viajero, quiero ver mis reservas en una tabla ordenada por columnas (actividad, lugar, fecha, plazas, pago) para compararlas de un vistazo.
- Como viajero en el móvil, quiero que la tabla siga siendo legible sin desplazarme de lado.
- Como viajero, quiero un mensaje emergente al completar una acción (por ejemplo, "Reserva confirmada") para saber que se ha hecho aunque el formulario no cambie.

## Solution Overview

- **Tabla de reservas**: `<table>` con cabecera (`<thead>`) y una fila por reserva. Columnas: Lanzamiento, Lugar, Fecha, Plazas, Pago. El estado de pago se muestra como una etiqueta de color (Pagada en verde, Pendiente en naranja, Reembolsada en gris).
- **Responsive**: en pantallas menores de 600 px, cada fila se apila como bloque y cada celda muestra su nombre de columna (`data-label`), sin desplazamiento horizontal.
- **Mensajes emergentes (toasts)**: un contexto `ToastProvider` con un hook `useToast()` que expone `notify(message, kind)`, donde `kind` es `success` o `error`. Los mensajes aparecen en la esquina inferior, se cierran solos a los 4 segundos o con un botón, y usan `role="status"` (éxito) o `role="alert"` (error).
- **Acciones con mensaje**: reserva confirmada (éxito), error de reserva (error), inicio de sesión (éxito), registro (éxito) y cierre de sesión (éxito).
- El mensaje de éxito que aparecía dentro del formulario de reserva se sustituye por el toast. Los errores de la API de reserva también pasan a toast (no se duplican en el formulario). Los errores de validación local (plazas fuera de rango) siguen en línea.

## Acceptance Criteria

- [ ] "Mis reservas" muestra una tabla con las columnas Lanzamiento, Lugar, Fecha, Plazas y Pago.
- [ ] El estado de pago aparece como etiqueta de color.
- [ ] En 390 px de ancho la tabla se apila por filas, cada celda muestra su nombre de columna y no hay desplazamiento horizontal.
- [ ] Al reservar con éxito aparece un toast "Reserva confirmada: N plazas." con `role="status"`.
- [ ] Al fallar una reserva por capacidad aparece un toast de error con `role="alert"`. El error de API no se duplica en el formulario.
- [ ] Al iniciar sesión, registrarse o cerrar sesión aparece un toast de éxito.
- [ ] Los toasts se cierran solos a los 4 segundos y con su botón de cierre.
- [ ] Las pruebas Playwright existentes siguen pasando (ajustadas solo donde cambia la estructura de la tabla).

## Testing Strategy

- `tests/my-bookings.spec.ts`: la tabla tiene las columnas esperadas y una fila por reserva; las etiquetas de pago se muestran.
- `tests/my-bookings.spec.ts`: en móvil no hay desplazamiento horizontal y las celdas muestran `data-label`.
- `tests/booking-seats.spec.ts`: el toast de reserva confirmada aparece con `role="status"`.
- `tests/toasts.spec.ts`: el toast se cierra con su botón y desaparece solo a los 4 segundos; un error de API muestra `role="alert"`.

## Notes

- No se añaden rutas ni llamadas a la API. Los datos son los mismos de FR3.
- El toast es solo presentación. Los errores de validación del formulario siguen en línea para que sean asociables a su campo.
