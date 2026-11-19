# Proyecto: Generador de CV + Solicitud de Empleo

## Objetivo
Herramienta local (sin servidor, sin internet requerido) con dos páginas:

1. **Constructor de CV** — formulario para rellenar los datos + vista previa en vivo con **3 diseños adaptativos** (responsive).
2. **Formato de solicitud de empleo** — formulario para rellenar y **imprimir / guardar en PDF**.

Todo corre en el navegador. Los datos no salen de la PC (privacidad total, ideal para los clientes).

---

## Stack tecnológico recomendado

**HTML + CSS + JavaScript puro (sin build, sin dependencias).**

Razones:
- Cero instalación de paquetes: abre `index.html` en el navegador y funciona.
- Sin costo, sin servidor, sin base de datos.
- El "Guardar en PDF" se hace con la función nativa del navegador (`window.print()` + CSS `@media print`), sin librerías.
- Compatible con el equipo actual (Windows 11 + Edge).

Opcional más adelante (NO necesario para empezar):
- **Vite** (dev server con recarga automática) — se instala con `npm i -D vite`.
- **jsPDF** — solo si se quiere un botón "Descargar PDF" directo sin pasar por el diálogo de impresión.

---

## Estructura de archivos propuesta

```
CVs/
├── PLAN.md                 ← este documento
├── ESTRUCTURA-CV.md        ← catálogo legible de los bloques del CV
├── bloques-cv.json         ← definición machine-readable (20 bloques, 6 presets, 7 reglas)
├── PALETAS-COLORES.md      ← sistema de color de los 3 diseños
├── paletas-colores.json    ← 3 diseños × (2 paletas + personalizada), 3 tonos c/u + reglas
├── index.html              ← inicio / selector de las 2 herramientas
├── cv/
│   ├── index.html          ← formulario del CV + vista previa
│   └── ...
├── solicitud/
│   ├── index.html          ← formulario de solicitud + impresión
│   └── ...
└── assets/
    ├── css/
    │   ├── base.css        ← reset, variables, tipografía
    │   ├── cv.css          ← los 3 diseños de CV
    │   └── print.css       ← estilos específicos para PDF
    └── js/
        ├── cv.js           ← lógica del CV (datos → plantilla)
        └── solicitud.js    ← lógica del formulario
```

> **Nota:** La estructura modular del CV ya está definida en `ESTRUCTURA-CV.md` y `bloques-cv.json`.
> La app leerá `bloques-cv.json` para generar los checkboxes, los campos, la vista previa,
> los 3 diseños y aplicar las reglas/presets. Ese es el punto de partida de la Fase 1.

## Estado actual (2026-11-19)

- ✅ **Fase 0 — Base:** completada. Estructura de carpetas, `base.css` y portada (`index.html`).
- ✅ **Fase 1 — Constructor de CV:** completada y probada en navegador.
  - Panel de presets, 20 bloques activables y ordenables.
  - Formulario dinámico generado desde `data.js`, con entradas múltiples.
  - 3 diseños con 2 paletas predefinidas + modo personalizado (3 tonos).
  - Contraste automático WCAG y advertencia si baja de 4.5:1.
  - Vista previa en vivo, guardado local (`localStorage`) y botón "Guardar en PDF".
  - Sin errores de consola; diseños y reglas verificados.
- ✅ **Fase 2 — Solicitud de empleo:** completada y probada.
  - Formato fijo de 2 páginas tomado del PDF del usuario (sin módulos).
  - 83 campos escritos directamente sobre el formato original.
  - Vista previa obligatoria antes del PDF, con selector **Blanco/negro** o **Beige/marrón**.
  - Impresión A4 verificada: genera exactamente 2 páginas, sin controles de la interfaz.
  - Guardado local y atajo `?preview=1&theme=beige`.
- ⬜ **Fase 3 — Pulido:** pendiente (validación de campos y pruebas finales).
- ⬜ **Fase 4 — Entrega:** pendiente (README y ZIP).

---

## Los 3 diseños de CV (adaptativos)

| # | Nombre | Descripción |
|---|--------|-------------|
| 1 | **Clásico / ATS** | Una columna, tipografía limpia, alto contraste. Ideal para que lo lean sistemas automáticos (ATS). |
| 2 | **Moderno / Lateral** | Columna lateral para contacto y habilidades, cuerpo principal a la derecha. |
| 3 | **Creativo / Tarjeta** | Cabecera con color, secciones en tarjetas, más visual para perfiles de diseño/marketing. |

Los tres se generan desde **los mismos datos** del formulario: cambias el diseño y el contenido se reutiliza. Todos son `responsive` (se adaptan a móvil, tablet y escritorio) y tienen estilo de impresión A4.

---

## Fases de trabajo

### Fase 0 — Base (30 min)
- Estructura de carpetas y archivos.
- `base.css` con variables de color, tipografía y reset.
- `index.html` como menú de las dos herramientas.

### Fase 1 — Constructor de CV (la parte principal)
- Formulario con secciones: datos personales, resumen/profesional, experiencia, educación, habilidades, idiomas, proyectos.
- Botones para **agregar/quitar** entradas de experiencia y educación.
- Vista previa en vivo (lo que escribes aparece al instante).
- Selector de los 3 diseños.
- Botón **Imprimir / Guardar PDF**.

### Fase 2 — Solicitud de empleo
- Formulario con: datos del solicitante, puesto, carta/observaciones, firma, fecha.
- Vista previa en formato A4.
- Botón **Imprimir / Guardar PDF** usando `@media print`.

### Fase 3 — Pulido
- Validación básica de campos.
- Guardado local en `localStorage` para no perder lo escrito al recargar.
- Pruebas de impresión en Edge (A4, márgenes, saltos de página).
- Ajustes responsive en móvil.

### Fase 4 — Entrega
- README con instrucciones de uso.
- (Opcional) Empaquetar como ZIP para entregar a clientes.

---

## Herramientas necesarias y estado del equipo

| Herramienta | Para qué | Estado |
|---|---|---|
| Windows 11 Pro | Sistema base | ✅ Instalado (10.0.26300) |
| Node.js + npm | Solo si se usa Vite (opcional) | ✅ Instalado (Node v24.20.0 / npm 11.19.0) |
| Python | No necesario, disponible por si acaso | ✅ Instalado (3.12.10) |
| Git | Control de versiones | ✅ Instalado (2.55.0) |
| VS Code | Editar el código | ✅ Instalado |
| Navegador | Probar y exportar a PDF | ✅ Microsoft Edge instalado |
| RAM | Multitarea | ✅ 31.4 GB (sobrada) |
| Disco | Archivos del proyecto | ✅ 98.2 GB libres |

### ¿Hay que agregar algo?
**No es obligatorio agregar nada** para construir y usar el proyecto. Todo lo esencial está presente.

Mejoras opcionales (cuando haya presupuesto):
- **Otro navegador** (Chrome/Firefox) para probar compatibilidad cruzada (Edge ya es suficiente para empezar).
- **Un monitor más grande** o segundo monitor (comodidad, no necesidad).
- **GitHub / cuenta en la nube** para respaldo del código (gratis; se puede hacer cuando quieras).
- **Dominio + hosting** solo si más adelante quieres ofrecer la herramienta como servicio online (no necesario para vender el servicio local).

---

## Nota de negocio
Esta herramienta es el "producto" que sugiere el plan para generar ingresos: la usas para **entregar CVs y solicitudes de empleo profesionales a clientes** cobrando por cada entrega. Primero la construyes (Fases 0–4), luego consigues los primeros clientes con el guion de ventas y reinviertes.
