# Generador de CV y Solicitud de Empleo

Herramientas locales, privadas y sin costo para crear currículums profesionales y llenar una solicitud de empleo imprimible. Todo funciona en el navegador: sin servidor, sin internet y sin que los datos salgan de la PC.

## Probarlo en línea

**Demo pública:** https://makhecokotori.github.io/generador-cv-solicitud/

- Constructor de CV: https://makhecokotori.github.io/generador-cv-solicitud/cv/
- Solicitud de empleo: https://makhecokotori.github.io/generador-cv-solicitud/solicitud/

Los datos se guardan solo en el navegador de cada persona (`localStorage`); no se envían a ningún servidor.

## Cómo usar

1. Abre **`index.html`** con doble clic (también funciona con un servidor local).
2. Elige una de las dos herramientas:

### Constructor de CV (`cv/index.html`)
- Elige un perfil inicial o activa/desactiva los **20 bloques** según tu experiencia.
- Completa el formulario: la vista previa se actualiza en vivo.
- Selecciona uno de los **3 diseños** (Clásico/ATS, Moderno/Lateral, Creativo/Tarjeta).
- Cada diseño tiene **2 paletas de 3 tonos** y un modo **Personalizado** con contraste automático.
- Pulsa **Guardar en PDF**.

### Solicitud de empleo (`solicitud/index.html`)
- Llena directamente el **formato fijo de 2 páginas** (sin módulos).
- Pulsa **Ver vista previa** y elige el tema: **Blanco/negro** o **Beige/marrón**.
- Pulsa **Guardar en PDF**.

Los datos se guardan automáticamente en `localStorage` del navegador. El botón **Limpiar** los borra.

## Estructura

```
.
├── index.html               Portada con las dos herramientas
├── cv/index.html            Constructor de CV
├── solicitud/index.html     Solicitud de empleo
├── assets/
│   ├── css/                 base, cv, solicitud y print (A4)
│   └── js/                  cv.js, solicitud.js y data.js (generado)
├── bloques-cv.json          Definición de los 20 bloques y 6 presets
├── paletas-colores.json     Paletas de los 3 diseños
├── ESTRUCTURA-CV.md         Documentación de los bloques
├── PALETAS-COLORES.md       Documentación del sistema de color
├── PLAN.md                  Plan de trabajo y estado
├── logo-muestras.html       Propuestas de logo
├── logo.svg                 Logo vectorial (monograma)
└── logo-completo.svg        Logo vectorial con texto
```

## Desarrollo local

Opcional, para servir por HTTP en lugar de abrir el archivo directo:

```bash
python -m http.server 8765
```

Luego abre `http://localhost:8765`.

> Nota: `assets/js/data.js` se genera desde los dos JSON. Si editas los JSON, vuelve a generarlo para que la app lo refleje.

## Estado

- ✅ Constructor de CV (bloques, diseños, paletas, contraste, PDF)
- ✅ Solicitud de empleo (formato, vista previa, temas, PDF)
- ✅ Logo e identidad visual
- ⬜ Pulido final y documentación ampliada
