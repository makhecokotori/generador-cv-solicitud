'use strict';

/* ===================================================================
   Solicitud de empleo — formato fijo (sin modulos)
   El formulario y la vista previa usan el MISMO diseno de 2 paginas.
   En la vista previa se elige el tema: blanco/negro o beige/marron.
   =================================================================== */

const STORAGE_KEY = 'solicitud-empleo-v1';
const $ = (sel) => document.querySelector(sel);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.values && typeof parsed.values === 'object') {
        return { values: parsed.values, theme: parsed.theme === 'beige' ? 'beige' : 'white' };
      }
    }
  } catch (e) { /* almacenamiento no disponible */ }
  return { values: {}, theme: 'white' };
}

let state = loadState();

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
}

function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ---------- Constructores de campos ---------- */

function field(key, label, mode) {
  const v = esc(state.values[key] || '');
  if (mode === 'edit') {
    return `<span class="sol-label">${label}</span><input class="sol-input" type="text" data-key="${key}" value="${v}" autocomplete="off">`;
  }
  return `<span class="sol-label">${label}</span><div class="sol-value">${v}</div>`;
}

function area(key, label, mode, rows) {
  const v = esc(state.values[key] || '');
  if (mode === 'edit') {
    return `<span class="sol-label">${label}</span><textarea class="sol-input" rows="${rows}" data-key="${key}">${v}</textarea>`;
  }
  return `<span class="sol-label">${label}</span><div class="sol-value">${v.replace(/\n/g, '<br>')}</div>`;
}

function val(key, mode) {
  const v = esc(state.values[key] || '');
  if (mode === 'edit') {
    return `<input class="sol-input" type="text" data-key="${key}" value="${v}" autocomplete="off">`;
  }
  return `<div class="sol-value">${v}</div>`;
}

function cell(content, colspan) {
  return `<td class="sol-cell" ${colspan ? `colspan="${colspan}"` : ''}>${content}</td>`;
}

function row(cells) {
  return `<tr>${cells.join('')}</tr>`;
}

function tbl(widths, rowsHtml) {
  const rows = Array.isArray(rowsHtml) ? rowsHtml.join('') : rowsHtml;
  return `<table class="sol-tbl"><colgroup>${widths.map((w) => `<col style="width:${w}%">`).join('')}</colgroup><tbody>${rows}</tbody></table>`;
}

function titledTable(title, headers, widths, bodyRows) {
  const head = `<tr><td class="sol-table-title" colspan="${headers.length}">${title}</td></tr>` +
    `<tr>${headers.map((h) => `<th class="sol-th">${h}</th>`).join('')}</tr>`;
  return tbl(widths, head + bodyRows);
}

function fullcell(content) {
  return `<div class="sol-fullcell">${content}</div>`;
}

function footer(page) {
  return `<div class="sol-footer">Solicitud de empleo &middot; Completa &middot; Página ${page} de 2</div>`;
}

/* ---------- Página 1 ---------- */

function page1(mode) {
  let h = '<section class="sol-page">';
  h += '<h1 class="sol-title">SOLICITUD DE EMPLEO</h1>';

  h += '<h2 class="sol-section">VACANTE</h2>';
  h += tbl([40, 25, 35], [
    row([
      cell(field('vac_puesto', 'Puesto que solicita', mode)),
      cell(field('vac_sueldo', 'Sueldo mensual pretendido', mode)),
      cell(field('vac_fecha', 'Fecha', mode))
    ]),
    row([
      cell(field('vac_inicio', 'Puede empezar', mode)),
      cell(field('vac_como', 'Cómo se enteró de la vacante', mode), 2)
    ])
  ]);

  h += '<h2 class="sol-section">DATOS PERSONALES</h2>';
  h += tbl([27, 27, 35, 11], [
    row([
      cell(field('pers_apellido1', 'Primer apellido', mode)),
      cell(field('pers_apellido2', 'Segundo apellido', mode)),
      cell(field('pers_nombre', 'Nombre o nombres', mode)),
      cell(field('pers_edad', 'Edad', mode))
    ]),
    row([
      cell(field('pers_calle', 'Calle y número', mode)),
      cell(field('pers_colonia', 'Colonia', mode)),
      cell(field('pers_cp', 'C.P.', mode)),
      cell(field('pers_tel', 'Teléfono o celular', mode))
    ]),
    row([
      cell(field('pers_municipio', 'Municipio o alcaldía y estado', mode)),
      cell(field('pers_email', 'Correo electrónico', mode)),
      cell(field('pers_nacionalidad', 'Nacionalidad', mode), 2)
    ])
  ]);
  h += tbl([50, 50], [
    row([
      cell(field('pers_nacimiento', 'Fecha de nacimiento', mode)),
      cell(field('pers_estado_nac', 'Estado donde nació', mode))
    ])
  ]);

  h += '<h2 class="sol-section">DOCUMENTACIÓN</h2>';
  h += tbl([30, 23, 26, 21], [
    row([
      cell(field('doc_curp', 'CURP', mode)),
      cell(field('doc_rfc', 'RFC', mode)),
      cell(field('doc_ss', 'Número de seguridad social', mode)),
      cell(field('doc_afore', 'AFORE', mode))
    ])
  ]);
  h += tbl([40, 33, 27], [
    row([
      cell(field('doc_licencia', 'Licencia de manejo (tipo y número)', mode)),
      cell(field('doc_cartilla', 'Cartilla del servicio militar', mode)),
      cell(field('doc_pasaporte', 'Pasaporte', mode))
    ])
  ]);
  h += fullcell(field('doc_extranjero', 'Siendo extranjero, qué documento le permite trabajar en el país', mode));

  h += '<h2 class="sol-section">ESCOLARIDAD</h2>';
  h += tbl([28, 49, 23], [
    row([
      cell(field('esc_nivel', 'Último nivel de estudios', mode)),
      cell(field('esc_escuela', 'Escuela', mode)),
      cell(field('esc_estudios', 'Estudios', mode))
    ])
  ]);

  const niveles = [
    ['primaria', 'Primaria'],
    ['secundaria', 'Secundaria'],
    ['bachillerato', 'Bachillerato o carrera técnica'],
    ['profesional', 'Profesional'],
    ['otros', 'Otros estudios']
  ];
  const filas = niveles.map(([id, etiqueta]) => row([
    `<td class="sol-cell"><b>${etiqueta}</b></td>`,
    cell(val('esc_' + id + '_nombre', mode)),
    cell(val('esc_' + id + '_periodo', mode)),
    cell(val('esc_' + id + '_doc', mode))
  ])).join('');
  h += titledTable(
    'ESCOLARIDAD, NIVEL POR NIVEL',
    ['Nivel', 'Nombre de la escuela', 'De cuándo a cuándo', 'Documento que recibió'],
    [17, 35, 22, 26],
    filas
  );

  h += fullcell(field('esc_estudiando', 'Estudia algo en este momento (qué, dónde y en qué horario)', mode));
  h += footer(1);
  h += '</section>';
  return h;
}

/* ---------- Página 2 ---------- */

function page2(mode) {
  let h = '<section class="sol-page">';

  const empleos = [1, 2, 3].map((i) => row([
    cell(val('emp_empresa_' + i, mode)),
    cell(val('emp_puesto_' + i, mode)),
    cell(val('emp_periodo_' + i, mode)),
    cell(val('emp_sueldo_' + i, mode)),
    cell(val('emp_tel_' + i, mode)),
    cell(val('emp_motivo_' + i, mode))
  ])).join('');
  h += titledTable(
    'EMPLEO ACTUAL Y ANTERIORES',
    ['Empresa', 'Puesto', 'De cuándo a cuándo', 'Sueldo', 'Teléfono', 'Motivo de separación'],
    [20, 15, 18, 9, 10, 28],
    empleos
  );

  h += fullcell(field('emp_informes', 'Se pueden pedir informes de usted en esos empleos', mode));

  h += '<h2 class="sol-section">CONOCIMIENTOS</h2>';
  h += fullcell(area('con_programas', 'Programas, equipos, licencias y funciones que domina', mode, 3));
  h += tbl([35, 65], [
    row([
      cell(field('con_idiomas', 'Idiomas', mode)),
      cell(field('con_maquinas', 'Máquinas o equipo que sabe manejar', mode))
    ])
  ]);

  const referencias = [1, 2, 3].map((i) => row([
    cell(val('ref_nombre_' + i, mode)),
    cell(val('ref_ocupacion_' + i, mode)),
    cell(val('ref_tel_' + i, mode)),
    cell(val('ref_tiempo_' + i, mode))
  ])).join('');
  h += titledTable(
    'REFERENCIAS PERSONALES',
    ['Referencia personal', 'Ocupación', 'Teléfono', 'Tiempo de conocerla'],
    [34, 23, 18, 25],
    referencias
  );

  h += '<h2 class="sol-section">DATOS GENERALES</h2>';
  h += tbl([53, 19, 28], [
    row([
      cell(field('gen_conocidos', 'Parientes o conocidos en la empresa', mode)),
      cell(field('gen_viajar', 'Puede viajar', mode)),
      cell(field('gen_residencia', 'Cambiaría de residencia', mode))
    ])
  ]);

  h += '<p class="sol-note">Declaro que la información de esta solicitud es verdadera.</p>';

  const firma = mode === 'edit'
    ? `<input class="sol-input" type="text" data-key="gen_firma" value="${esc(state.values.gen_firma || '')}" autocomplete="off">`
    : `<div class="sol-value">${esc(state.values.gen_firma || '')}</div>`;
  h += `<div class="sol-signature">${firma}<div class="sol-signature-line"></div><div class="sol-signature-label">Firma de la persona solicitante</div></div>`;

  h += footer(2);
  h += '</section>';
  return h;
}

/* ---------- Render ---------- */

function renderForm() {
  $('#form-root').innerHTML = page1('edit') + page2('edit');
}

function renderPreview() {
  const root = $('#preview-root');
  root.className = 'sol-preview theme-' + state.theme;
  root.innerHTML = page1('preview') + page2('preview');
  root.hidden = false;
  $('#preview-empty').hidden = true;
  document.querySelectorAll('[data-theme]').forEach((b) => {
    b.classList.toggle('active', b.dataset.theme === state.theme);
  });
}

function ensurePreview() {
  if ($('#preview-root').hidden) renderPreview();
}

/* ---------- Eventos ---------- */

function onFieldChange(e) {
  const el = e.target;
  if (!el.dataset || !el.dataset.key) return;
  state.values[el.dataset.key] = el.value;
  saveState();
  if (!$('#preview-root').hidden) renderPreview();
}

$('#form-root').addEventListener('input', onFieldChange);
$('#form-root').addEventListener('change', onFieldChange);

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.addEventListener('click', () => {
    state.theme = button.dataset.theme;
    saveState();
    renderPreview();
  });
});

$('#btn-preview').addEventListener('click', renderPreview);

$('#btn-print').addEventListener('click', () => {
  ensurePreview();
  window.print();
});

$('#btn-clear').addEventListener('click', () => {
  if (!confirm('¿Borrar todos los datos de la solicitud?')) return;
  state = { values: {}, theme: 'white' };
  saveState();
  renderForm();
  const root = $('#preview-root');
  root.hidden = true;
  root.innerHTML = '';
  $('#preview-empty').hidden = false;
  document.querySelectorAll('[data-theme]').forEach((b) => b.classList.remove('active'));
});

/* ---------- Inicio ---------- */
// Atazos opcionales por URL: ?preview=1 abre la vista previa, &theme=beige elige el tema.
const params = new URLSearchParams(location.search);
if (params.get('theme') === 'beige' || params.get('theme') === 'white') {
  state.theme = params.get('theme');
  saveState();
}

renderForm();
document.querySelectorAll('[data-theme]').forEach((b) => {
  b.classList.toggle('active', b.dataset.theme === state.theme);
});
if (params.get('preview') === '1') renderPreview();
