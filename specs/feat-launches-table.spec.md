# Feature: Tabla de lanzamientos con botón de reserva

**Reference**: FR9 (PRD.md)
**Issue**: #9
**Status**: Completed

---

## Problem

El catálogo muestra cada lanzamiento como una tarjeta con el nombre como enlace al detalle. Es visualmente repetitivo, ocupa mucho espacio para comparar lanzamientos y no deja claro cómo iniciar una reserva. Además, el enlace del título no comunica acción.

## User Stories

- Como viajero, quiero ver los lanzamientos en una tabla moderna, para compararlos de un vistazo por lugar, fecha, precio y plazas.
- Como viajero, quiero un botón al final de cada fila para iniciar la reserva, para saber de forma directa qué puedo reservar.
- Como viajero, quiero que los lanzamientos que no admiten reservas lo indiquen claramente, para no intentar reservarlos.

## Solution Overview

- **Tabla semántica**: `LaunchTable` (`src/components/LaunchTable.tsx`) renderiza una `<table class="launches-table">` con cabecera y una fila `data-testid="launch-row"` por lanzamiento. Sustituye al grid de tarjetas `LaunchCard`, que se elimina.
- **Columnas**: Lanzamiento (nombre en texto plano, sin enlace), Lugar, Fecha, Precio, Plazas y Acción. Lugar, fecha, precio y plazas mantienen los iconos de FR7 dentro de `.meta-row`.
- **Botón Reservar**: si `isBookable(launch)`, la columna Acción muestra un botón con icono de entrada y texto "Reservar" (`aria-label` "Reservar {nombre}"). Al pulsarlo se navega a `/launches/{id}` con `useNavigate`. Si no es reservable, muestra un badge "No reservable" sin botón.
- **Estilo**: la tabla reutiliza el estilo de `.bookings-table` (FR6) y añade un borde de color por fila. En móvil (`max-width: 599px`) cada fila se apila y cada celda muestra su etiqueta con `data-label`, igual que en "Mis reservas".
- **Fuera de alcance**: no cambia la API, ni el detalle del lanzamiento, ni la lógica de `isBookable` y `seatsLabel` (solo se mueve `seatsLabel` al nuevo componente).

## Acceptance Criteria

- [ ] El catálogo muestra una tabla con cabecera de seis columnas en escritorio, y el nombre del lanzamiento no es un enlace.
- [ ] Cada lanzamiento reservable tiene un botón "Reservar" que abre `/launches/{id}`.
- [ ] Un lanzamiento agotado o no reservable muestra "No reservable" y no tiene botón.
- [ ] En móvil la cabecera se oculta, las filas se apilan y no hay desbordamiento horizontal.
- [ ] Los iconos de lugar, fecha, precio y plazas siguen presentes y son decorativos.
- [ ] `LaunchCard.tsx` y las reglas CSS `.launch-grid` y `.launch-card` se eliminan.
- [ ] Las pruebas Playwright siguen pasando.

## Testing Strategy

- `tests/launch-catalog.spec.ts`: filas con nombre, plazas y precio; botón "Reservar Luna" navega al detalle; "No reservable" sin botón para Marte.
- `tests/modern-ui.spec.ts`: en móvil la cabecera está oculta y no hay desbordamiento; en escritorio la cabecera tiene seis columnas.
- `tests/icons.spec.ts`: cada fila muestra cuatro iconos de `.meta-row` que son decorativos.

## Notes

- El título del lanzamiento deja de ser un enlace. La navegación al detalle se hace solo con el botón de la fila, así que el detalle sigue accesible por URL.
- El estado de "No reservable" usa la misma regla que el detalle (`isBookable`), para que lista y detalle no se contradigan.
