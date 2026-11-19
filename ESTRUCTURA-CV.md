# Estructura de un CV profesional — Sistema modular por bloques

## Principios de diseño

1. **Todo es un bloque.** Cada sección del CV es independiente: tiene nombre, campos propios y una plantilla de render.
2. **El usuario elige.** Activa o desactiva bloques según su experiencia y ordénalos como prefiera.
3. **Un dato, varias vistas.** Los campos se llenan una sola vez; los 3 diseños (Clásico, Moderno, Creativo) solo cambian la presentación.
4. **Esencial vs. opcional.** Hay bloques obligatorios (sin ellos no hay CV) y bloques condicionales que aportan valor solo a ciertos perfiles.
5. **Pensado para ATS.** Los bloques esenciales usan encabezados estándar y texto simple (sin tablas ni columnas) para que los sistemas automáticos de lectura de CVs lo interpreten bien.

---

## Catálogo de bloques

Leyenda de categoría:
- **Esencial** — siempre debe estar.
- **EsencialCond** — obligatorio salvo que el perfil lo justifique (ej. alguien sin experiencia laboral no incluye "Experiencia").
- **Recomendado** — añade valor en la mayoría de los casos.
- **Opcional** — solo si aplica al perfil.
- **Avanzado** — perfiles específicos (académicos, freelance).

| # | ID del bloque | Nombre | Categoría |
|---|---|---|---|
| 1 | `cabecera` | Datos personales y contacto | Esencial |
| 2 | `resumen` | Resumen profesional / Perfil | Recomendado |
| 3 | `objetivo` | Objetivo profesional | Opcional (alternativa a `resumen`) |
| 4 | `experiencia` | Experiencia laboral | EsencialCond |
| 5 | `proyectos` | Proyectos destacados / Portafolio | Opcional |
| 6 | `educacion` | Educación | EsencialCond |
| 7 | `habilidades` | Habilidades y competencias | Recomendado |
| 8 | `idiomas` | Idiomas | Recomendado |
| 9 | `certificaciones` | Certificaciones y cursos | Opcional |
| 10 | `logros` | Logros profesionales | Opcional |
| 11 | `reconocimientos` | Premios, becas y honores | Opcional |
| 12 | `publicaciones` | Publicaciones e investigación | Avanzado |
| 13 | `voluntariado` | Voluntariado | Opcional |
| 14 | `licencias` | Licencias y permisos | Opcional |
| 15 | `servicios` | Servicios / Especialidades | Opcional (freelance) |
| 16 | `testimonios` | Testimonios de clientes | Opcional (freelance) |
| 17 | `disponibilidad` | Disponibilidad y expectativas | Opcional |
| 18 | `referencias` | Referencias | Opcional |
| 19 | `intereses` | Intereses y aficiones | Opcional (baja prioridad) |
| 20 | `datos_adicionales` | Datos adicionales | Opcional (privacidad) |

---

## Detalle de cada bloque

### 1. `cabecera` — Datos personales y contacto
**Estado:** Esencial. Siempre va primero y no se puede desactivar.
- **Campos:** nombre completo *, título profesional, teléfono *, correo electrónico *, ciudad y país, LinkedIn, GitHub / portafolio, sitio web, foto (opcional).
- **Notas:** El título profesional debe ir pegado al nombre (ej. "Ana Torres — Diseñadora UX"). La foto es opcional y se desaconseja en mercados con leyes anti-discriminación (EE. UU., Reino Unido); por defecto va desactivada.

### 2. `resumen` — Resumen profesional / Perfil
**Estado:** Recomendado. 3–4 líneas que responden: quién eres, años de experiencia, especialidad y valor que aportas.
- **Campos:** texto del resumen, palabras clave (para ATS).
- **Notas:** Es la alternativa moderna al `objetivo`. Usar **uno u otro**, nunca ambos.

### 3. `objetivo` — Objetivo profesional
**Estado:** Opcional. En desuso, pero todavía se pide en algunos formularios públicos y en Latinoamérica.
- **Campos:** texto del objetivo.
- **Notas:** Mutuamente excluyente con `resumen`. Si el usuario no sabe qué elegir, seleccionar `resumen`.

### 4. `experiencia` — Experiencia laboral
**Estado:** EsencialCond. Incluir si se ha trabajado (incluye prácticas y freelance).
- **Campos (por entrada):** puesto *, empresa *, ubicación, fecha de inicio *, fecha de fin (o "actual"), descripción/logros en viñetas, tecnologías o herramientas usadas.
- **Notas:** Entre 3 y 5 viñetas por puesto, empezando con verbo en pretérito ("Lideré", "Reduje", "Implementé"). Orden cronológico inverso (el más reciente primero).

### 5. `proyectos` — Proyectos destacados / Portafolio
**Estado:** Opcional. Muy valioso para perfiles técnicos, creativos y juniors sin experiencia formal.
- **Campos (por entrada):** nombre del proyecto *, descripción, rol, tecnologías, enlace (GitHub, Behance, demo), periodo, resultado medible.
- **Notas:** Si el usuario tiene poco historial laboral, este bloque puede sustituir a `experiencia`.

### 6. `educacion` — Educación
**Estado:** EsencialCond. Imprescindible para estudiantes y primer empleo; sigue siendo útil en perfiles senior.
- **Campos (por entrada):** título o carrera *, institución *, ubicación, fecha de inicio, fecha de fin, estado (en curso / graduado), promedio u honores, cursos relevantes.
- **Notas:** En perfiles senior se recomienda reducirlo a 2–3 líneas y priorizar `experiencia`.

### 7. `habilidades` — Habilidades y competencias
**Estado:** Recomendado.
- **Campos:** grupos de habilidades (técnicas / duras, blandas, herramientas, stack tecnológico) como etiquetas.
- **Notas:** Separar por categorías mejora la lectura y el ATS. Ejemplo: "Técnicas: JavaScript, SQL, Figma · Blandas: Comunicación, Liderazgo".

### 8. `idiomas` — Idiomas
**Estado:** Recomendado si el puesto lo requiere o si el candidato es bilingüe.
- **Campos (por entrada):** idioma *, nivel (A1–C2 / nativo / profesional), certificación (opcional).
- **Notas:** Usar escalas reconocidas (MCER) para evitar ambigüedad.

### 9. `certificaciones` — Certificaciones y cursos
**Estado:** Opcional. Clave en tecnología, marketing, salud y oficios regulados.
- **Campos (por entrada):** nombre *, entidad emisora, fecha de obtención, ID/URL de credencial, vigencia.
- **Notas:** Priorizar certificaciones vigentes y relevantes al puesto.

### 10. `logros` — Logros profesionales
**Estado:** Opcional. Se usa cuando los logros destacan más que las responsabilidades.
- **Campos (por entrada):** título *, descripción, fecha o periodo, métrica (ej. "+35% de conversión").
- **Notas:** Alternativa a repetir logros dentro de `experiencia`; no conviene duplicar.

### 11. `reconocimientos` — Premios, becas y honores
**Estado:** Opcional. Perfiles académicos, creativos y de investigación.
- **Campos (por entrada):** nombre *, entidad, fecha, motivo.
- **Notas:** Agrupa premios, becas, menciones honoríficas y "empleado del mes".

### 12. `publicaciones` — Publicaciones e investigación
**Estado:** Avanzado. Perfiles académicos y científicos.
- **Campos (por entrada):** título *, autores, revista/editorial, año, tipo (artículo, libro, ponencia), DOI o enlace.
- **Notas:** Solo incluir si son relevantes al puesto.

### 13. `voluntariado` — Voluntariado
**Estado:** Opcional. Aporta valores y habilidades blandas,尤其是 para juniors.
- **Campos (por entrada):** organización *, rol, periodo, descripción, causa.
- **Notas:** Útil para llenar un CV con poca experiencia laboral.

### 14. `licencias` — Licencias y permisos
**Estado:** Opcional. Relevante para choferes, técnicos, salud, seguridad, aviación.
- **Campos (por entrada):** tipo *, número, entidad emisora, fecha de emisión, vigencia.
- **Notas:** Omitir si no se exige para el puesto.

### 15. `servicios` — Servicios / Especialidades
**Estado:** Opcional, enfocado a freelance e independientes.
- **Campos:** lista de servicios ofrecidos, nichos atendidos, modalidades de trabajo.
- **Notas:** Reemplaza o complementa al `resumen` en CVs de freelance.

### 16. `testimonios` — Testimonios de clientes
**Estado:** Opcional, enfocado a freelance e independientes.
- **Campos (por entrada):** nombre del cliente, cargo/empresa, texto del testimonio.
- **Notas:** Solo con permiso del cliente; 2–3 testimonios breves son suficientes.

### 17. `disponibilidad` — Disponibilidad y expectativas
**Estado:** Opcional.
- **Campos:** disponibilidad inmediata o a plazo, jornada (completa/parcial), modalidad (remoto/híbrido/presencial), expectativa salarial, disposición a viajar.
- **Notas:** En algunos países se omite el salario; dejar configurable.

### 18. `referencias` — Referencias
**Estado:** Opcional.
- **Campos:** opción "Referencias disponibles a solicitud" o entradas con nombre, cargo, empresa y contacto.
- **Notas:** La opción "disponibles a solicitud" es la más usada hoy; ahorra espacio.

### 19. `intereses` — Intereses y aficiones
**Estado:** Opcional, baja prioridad.
- **Campos:** lista de intereses.
- **Notas:** Solo si conecta con el puesto o la cultura de la empresa. De lo contrario, ocupa espacio valioso.

### 20. `datos_adicionales` — Datos adicionales
**Estado:** Opcional, **oculto por defecto por privacidad**.
- **Campos:** fecha de nacimiento / edad, estado civil, nacionalidad, género.
- **Notas:** No recomendado en la mayoría de los países por riesgos de discriminación. Incluir solo si el formulario lo pide explícitamente.

---

## Reglas de combinación

1. `cabecera` siempre incluido y en primer lugar.
2. `resumen` y `objetivo` son **mutuamente excluyentes** (recomendado `resumen`).
3. Debe incluirse **al menos uno** de: `experiencia`, `proyectos`, `educacion`.
4. `logros` no debe duplicar lo ya escrito en `experiencia`.
5. `datos_adicionales` empieza desactivado y se advierte sobre privacidad.
6. Longitud recomendada: **1 página** si hay menos de 5 años de experiencia; **2 páginas** para perfiles senior o académicos.
7. Los bloques esenciales (`cabecera`, `experiencia`, `educacion`, `habilidades`) se renderizan con encabezados estándar y sin columnas, para compatibilidad ATS.

---

## Perfiles predefinidos (presets)

El usuario puede partir de un preset y luego ajustar bloques:

| Preset | Bloques incluidos |
|---|---|
| **Básico** | cabecera, resumen, experiencia, educación, habilidades |
| **Primer empleo / Estudiante** | cabecera, resumen, educación, proyectos, habilidades, idiomas, certificaciones, voluntariado |
| **Profesional con experiencia** | cabecera, resumen, experiencia, educación, habilidades, idiomas, certificaciones, logros, proyectos |
| **Técnico / TI** | cabecera, resumen, experiencia, proyectos, habilidades, educación, certificaciones, idiomas, logros |
| **Freelance / Independiente** | cabecera, resumen, servicios, experiencia, proyectos, testimonios, habilidades, certificaciones, idiomas |
| **Académico / Investigación** | cabecera, resumen, educación, publicaciones, experiencia, proyectos, reconocimientos, idiomas, certificaciones |

---

## Orden recomendado por defecto

`cabecera → resumen → experiencia → proyectos → educación → habilidades → idiomas → certificaciones → logros → reconocimientos → publicaciones → voluntariado → licencias → servicios → testimonios → disponibilidad → referencias → intereses → datos_adicionales`

El usuario podrá reordenar los bloques con botones subir/bajar o arrastrar y soltar.

---

## Siguiente paso

La definición legible de arriba se tradujo al archivo **`bloques-cv.json`**, que la aplicación leerá para:
- Dibujar el panel de selección de bloques (con checkboxes).
- Generar automáticamente los campos del formulario.
- Construir la vista previa y los 3 diseños.
- Aplicar las reglas de exclusión y los presets.
