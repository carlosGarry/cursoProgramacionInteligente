# Feature: Diseño visual moderno estilo Metro y responsive

**Reference**: FR5 (PRD.md)
**Issue**: pendiente (crear en GitHub y poner el número aquí)
**Status**: Completed

---

## Problem

La interfaz funciona, pero su aspecto es básico: fondo oscuro plano, tarjetas sin jerarquía visual y un header sin identidad. En móviles, el header y el formulario de reserva se quedan estrechos o se desbordan.

## User Stories

- Como viajero, quiero una interfaz con un estilo moderno y limpio, parecido al lenguaje visual Metro, para reconocer rápido cada lanzamiento.
- Como viajero en el móvil, quiero poder navegar, leer el catálogo y reservar sin hacer zoom ni desplazarme de lado.
- Como viajero en escritorio, quiero ver varios lanzamientos a la vez en una cuadrícula de mosaicos.

## Solution Overview

- Estilo Metro: colores planos y saturados, sin sombras ni bordes redondeados, tipografía grande y en negrita para títulos.
- Cada tarjeta de lanzamiento es un mosaico con color de acento propio (rotando entre los colores de la paleta).
- Paleta de acento: azul `#1ba1e2`, verde `#60a917`, naranja `#fa6800`, morado `#aa00ff`, rojo `#e51400`.
- Fondo oscuro `#111111`, texto blanco y texto secundario gris claro.
- Cuadrícula responsive: 1 columna en móvil (menos de 600px), 2 en tablet y 3 o más en escritorio.
- Header que se apila en móvil y mantiene el enlace "Mis reservas" y "Salir" accesibles.
- Controles táctiles de al menos 44 px de altura en móvil.
- Formularios a ancho completo en móvil.
- Sin cambios en la lógica, las rutas ni los textos de las pruebas existentes.

## Acceptance Criteria

- [ ] Las tarjetas de lanzamiento son mosaicos con color de acento y sin sombras ni esquinas redondeadas.
- [ ] En un viewport de 390 px de ancho (móvil) el catálogo se muestra en una columna y no hay desplazamiento horizontal.
- [ ] En un viewport de 1280 px de ancho (escritorio) el catálogo se muestra en tres o más columnas.
- [ ] En móvil, los botones y los campos del formulario tienen al menos 44 px de altura.
- [ ] El header se apila en móvil y sigue mostrando la marca, el enlace "Mis reservas" (con sesión) y "Salir".
- [ ] Las pruebas Playwright existentes siguen pasando.

## Testing Strategy

- Playwright (`tests/modern-ui.spec.ts`) con la API simulada:
  - Catálogo en móvil: una columna y sin desbordamiento horizontal.
  - Catálogo en escritorio: tres columnas.
  - Controles táctiles de al menos 44 px en móvil.
- Verificación visual manual en el navegador, en escritorio y en móvil.

## Notes

- Solo cambia la presentación. No se añaden rutas, llamadas a la API ni textos nuevos.
- El diseño usa CSS plano (sin librerías de UI) para mantener el proyecto simple.
