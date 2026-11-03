# Feature: Iconografía

**Reference**: FR7 (PRD.md)
**Issue**: pendiente (crear en GitHub y poner el número aquí)
**Status**: Completed

---

## Problem

La interfaz usa solo texto en enlaces, datos y mensajes. Por eso se ve menos cuidada de lo que debería. Los datos clave (lugar, fecha, precio, plazas) y las acciones (entrar, salir, reservar) se leen igual que el resto del texto, y los toasts no distinguen a simple vista un éxito de un error.

## User Stories

- Como viajero, quiero reconocer de un vistazo el tipo de dato (lugar, fecha, precio, plazas) para leer un lanzamiento más rápido.
- Como viajero, quiero iconos en las acciones principales (entrar, salir, mis reservas) para encontrarlas sin leer.
- Como viajero, quiero que los toasts de éxito y de error tengan un icono distinto para entender el resultado al instante.

## Solution Overview

- **Componente `Icon`** (`src/components/Icon.tsx`): SVG en línea con un conjunto cerrado de nombres (`rocket`, `pin`, `calendar`, `tag`, `users`, `ticket`, `user`, `user-plus`, `login`, `logout`, `card`, `check-circle`, `alert-circle`, `x`, `arrow-left`). Usa `currentColor`, así que hereda el color del texto. No añade dependencias.
- **Accesibilidad**: los iconos son decorativos (`aria-hidden="true"`, `focusable="false"`). El texto visible sigue siendo el que da el nombre accesible, así que no cambian los roles ni los textos que usan los tests.
- **Puntos de uso**:
  - Cabecera: logotipo con cohete; "Hola" con usuario; "Mis reservas" con ticket; "Entrar", "Registrarse" y "Salir" con sus iconos.
  - Tarjeta de lanzamiento y detalle: lugar (pin), fecha (calendario), precio (etiqueta) y plazas (usuarios).
  - Detalle: enlace de volver con flecha.
  - Reservas: etiqueta de pago con icono de tarjeta; título con ticket.
  - Toasts: éxito con check, error con alerta; el botón de cierre usa la X.

## Acceptance Criteria

- [ ] La cabecera muestra un icono junto a cada acción (entrar, registrarse, mis reservas, salir) y junto al logotipo.
- [ ] Cada tarjeta de lanzamiento muestra iconos de lugar, fecha, precio y plazas.
- [ ] Los toasts de éxito y de error muestran iconos distintos.
- [ ] Los iconos no tienen texto accesible propio y no cambian los nombres de los botones y enlaces.
- [ ] Los iconos se ven bien en móvil (no rompen el layout ni provocan desplazamiento horizontal).
- [ ] Las pruebas Playwright existentes siguen pasando.

## Testing Strategy

- `tests/icons.spec.ts`: la cabecera, las tarjetas y el toast de éxito contienen SVG decorativos (`aria-hidden="true"`).
- `tests/icons.spec.ts`: en 390 px no hay desplazamiento horizontal con iconos en la cabecera y en las tarjetas.
- Regresión: la suite completa existente sigue en verde, porque los nombres accesibles de enlaces y botones no cambian.

## Notes

- Se usa un conjunto propio de SVG en lugar de una librería de iconos para no añadir dependencias al proyecto de curso.
- Los iconos son decorativos: el significado siempre lo transmite el texto visible.
