# Feature: Mensajes de error como notificaciones emergentes

**Reference**: FR8 (PRD.md)
**Issue**: #8
**Status**: Completed

---

## Problem

Los errores de validación y de API se muestran en línea, debajo de cada campo o del formulario. Al aparecer, añaden un bloque de texto que desplaza el contenido y rompe la composición visual de los formularios. Por ejemplo, elegir 6 plazas cuando solo quedan 4 muestra "Elige entre 1 y 4 plazas." debajo del campo y cambia la altura del formulario. Además, los errores de API ya se muestran como notificación en la reserva, pero no en el resto de formularios, así que la experiencia es distinta según la acción.

## User Stories

- Como viajero, quiero que un error al elegir plazas o al enviar un formulario aparezca como notificación emergente, para que el formulario no cambie de forma.
- Como viajero, quiero que todos los errores de la aplicación se presenten del mismo modo, para entender rápido qué ha pasado.

## Solution Overview

- **Un único canal para mensajes de acción**: todos los errores de validación y de API de los formularios (reserva, registro e inicio de sesión) usan `notify(message, 'error')` del `ToastProvider` existente (FR6). Se muestran con `role="alert"` y se cierran solos a los 4 segundos o con su botón.
- **Varios errores de campo**: los mensajes de campo devueltos por la API se unen en un único toast, separados por espacio, igual que en la reserva.
- **Sin texto en línea en formularios**: se eliminan los párrafos `form-error` de `BookingForm`, `RegisterPage` y `LoginPage`, y la clase `.form-error` de `styles.css`.
- **Fuera de alcance**: los mensajes de carga de página (`ErrorMessage` con botón "Reintentar") y los mensajes informativos ("Este lanzamiento no admite reservas", "Inicia sesión para reservar"). No son errores de un formulario.
- Esta spec reemplaza la decisión de FR6 que mantenía en línea los errores de validación de plazas.

## Acceptance Criteria

- [ ] Elegir más plazas que las disponibles (por ejemplo 6 con 4 libres) muestra el toast de error "Elige entre 1 y 4 plazas." con `role="alert"`.
- [ ] El formulario de reserva no muestra texto de error en línea y no cambia de altura al producirse el error.
- [ ] Un error de validación o de API en el registro muestra un toast de error con los mensajes de los campos.
- [ ] Un error de inicio de sesión (credenciales) muestra un toast de error.
- [ ] No queda ningún elemento `.form-error` en la aplicación, y la clase se elimina de `styles.css`.
- [ ] Los toasts de error se cierran solos a los 4 segundos y con su botón.
- [ ] Las pruebas Playwright existentes siguen pasando.

## Testing Strategy

- `tests/form-messages.spec.ts`: plazas fuera de rango muestran toast de error, no hay `.form-error` y el valor del campo se conserva.
- `tests/form-messages.spec.ts`: error de credenciales en el login muestra toast con `role="alert"`.
- `tests/form-messages.spec.ts`: error de validación de la API en el registro muestra toast con los mensajes de campo.
- `tests/booking-seats.spec.ts`: el error de plazas fuera de rango sale como toast y no hay `.form-error`.

## Notes

- No se añaden rutas ni llamadas a la API. Es solo presentación y reutiliza el `ToastProvider` de FR6.
- Los campos siguen siendo accesibles: el texto del error vive en el toast, no asociado al campo. Los campos mantienen su nombre accesible por `<label>`.
