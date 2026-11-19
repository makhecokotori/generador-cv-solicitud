# Sistema de paletas de color para los 3 diseños de CV

## Idea central

Cada uno de los 3 diseños ofrece **3 modos de color**:

1. **Paleta 1** — combinación predefinida de 3 tonos.
2. **Paleta 2** — combinación predefinida alternativa de 3 tonos.
3. **Personalizada** — el usuario elige los 3 tonos con selectores de color.

Los 3 tonos son siempre los mismos conceptualmente:

| Tono | Nombre en la app | Función |
|---|---|---|
| `base` | Color base | Nombre, encabezados, títulos de sección y, según el diseño, fondo de la cabecera o barra lateral. |
| `lineas` | Color de líneas | Divisores, bordes, viñetas y detalles finos. |
| `decorativo` | Color decorativo | Fondos suaves de tarjetas, etiquetas, iconos y realces. |

> El modo **Personalizada** se define una sola vez y se aplica al diseño que esté activo; los colores elegidos se conservan al cambiar de diseño.

---

## Los 3 diseños y sus paletas

### 1. Clásico / ATS
Sobrio y de alto contraste. Cumple con lectores automáticos (ATS): el texto principal sigue siendo oscuro y las líneas son discretas.

| Modo | Nombre | Base | Líneas | Decorativo |
|---|---|---|---|---|
| Paleta 1 | Tinta y Acero | `#1F2937` | `#6B7280` | `#D1D5DB` |
| Paleta 2 | Azul Corporativo | `#1E3A5F` | `#3D6C99` | `#C9DEEE` |
| Personalizada | (la elige el usuario) | `#1F2937` | `#6B7280` | `#D1D5DB` |

**Uso:** `base` → nombre y títulos de sección · `lineas` → divisores bajo cada título · `decorativo` → viñetas y fondos muy tenues.

### 2. Moderno / Lateral
Tiene una columna lateral para contacto y habilidades. El color base tiñe esa columna.

| Modo | Nombre | Base | Líneas | Decorativo |
|---|---|---|---|---|
| Paleta 1 | Verde Profesional | `#1F4E3D` | `#3E8E6E` | `#D7EDE2` |
| Paleta 2 | Grafito y Cobre | `#2B2B2B` | `#B87333` | `#E8D9C5` |
| Personalizada | (la elige el usuario) | `#1F4E3D` | `#3E8E6E` | `#D7EDE2` |

**Uso:** `base` → fondo de la barra lateral · `lineas` → separadores dentro de la barra y del cuerpo · `decorativo` → etiquetas de habilidades e iconos.

### 3. Creativo / Tarjeta
El más visual: cabecera con color y secciones en tarjetas.

| Modo | Nombre | Base | Líneas | Decorativo |
|---|---|---|---|---|
| Paleta 1 | Terracota | `#8C3B2E` | `#D98E73` | `#F4E3D3` |
| Paleta 2 | Índigo Eléctrico | `#3B2E8C` | `#7A6BD9` | `#E4DFF7` |
| Personalizada | (la elige el usuario) | `#8C3B2E` | `#D98E73` | `#F4E3D3` |

**Uso:** `base` → cabecera y nombre · `lineas` → bordes de tarjetas · `decorativo` → fondo de tarjetas y pastillas de información.

---

## Regla de contraste automático (todos los tonos)

Cada vez que el usuario cambia un color —o cambia de paleta o de diseño— la app recalcula el contraste **en tiempo real** y decide el color del texto por sí sola.

### 1. Texto sobre un tono de color

Para **cada uno de los 3 tonos** se calcula qué color de texto da mayor contraste, usando la fórmula WCAG de luminancia relativa:

| Superficie | Variable generada | Resultado |
|---|---|---|
| Fondo `base` (cabecera / barra lateral) | `--texto-base` | `#FFFFFF` u `#111827` |
| Fondo `lineas` (etiquetas en el diseño Moderno) | `--texto-lineas` | `#FFFFFF` u `#111827` |
| Fondo `decorativo` (etiquetas de habilidades) | `--texto-decorativo` | `#FFFFFF` u `#111827` |

Se compara el ratio de contraste contra blanco y contra oscuro, y se elige **el que dé mayor ratio** (no un umbral fijo), de modo que siempre gana la opción más legible.

### 2. Tonos usados como texto sobre fondo blanco

Cuando un tono se usa como **color de texto** (títulos de sección, título profesional, etiquetas de grupo), un color claro sería ilegible sobre el papel blanco. La app lo **oscurece conservando su matiz** hasta alcanzar al menos **4.5:1**:

| Uso | Variable generada |
|---|---|
| Títulos de sección | `--base-legible` |
| Título profesional / etiquetas de grupo | `--lineas-legible` |

Si el tono original ya cumple el contraste, se usa tal cual; si no, se ajusta automáticamente y se muestra el aviso: *"Contraste ajustado automáticamente para mantener el texto legible."*

### 3. Casos especiales

- En el diseño **Moderno**, los títulos de la barra lateral usan directamente `--texto-base` (blanco o negro según el fondo), para no depender del color decorativo.
- Los tres tonos no deben ser idénticos entre sí (se valida en la app).

---

## Cómo se verá en la interfaz

En el panel de **Diseño** (Fase 1) habrá, para el diseño activo:

```
Diseño:  [ Clásico ] [ Moderno ] [ Creativo ]

Color:   [ Paleta 1 ] [ Paleta 2 ] [ Personalizada ]

   (si Personalizada)
   Base:        [selector de color] #______
   Líneas:      [selector de color] #______
   Decorativo:  [selector de color] #______
   [✓] Vista previa en vivo
```

Al cambiar de paleta o de tono, la vista previa se actualiza al instante sin recargar.

---

## Archivos generados

- **`paletas-colores.json`** — definición machine-readable: tonos, 3 modos, 3 diseños con sus 2 paletas, defaults para personalizada, mapeo de uso y reglas de contraste.
- **`PALETAS-COLORES.md`** — este documento.

La app leerá `paletas-colores.json` junto con `bloques-cv.json` para construir el panel de diseño y aplicar los colores a los 3 diseños.
