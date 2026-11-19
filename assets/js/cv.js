'use strict';

/* ===================================================================
   Constructor de CV — lógica principal
   Datos: data.js (generado desde bloques-cv.json y paletas-colores.json)
   =================================================================== */

const STORAGE_KEY = 'cv-builder-state-v1';

// Bloques que se colocan en la columna lateral del diseño "Moderno"
const SIDEBAR_BLOCKS = [
  'habilidades', 'idiomas', 'certificaciones', 'logros', 'reconocimientos',
  'publicaciones', 'voluntariado', 'licencias', 'servicios', 'testimonios',
  'disponibilidad', 'referencias', 'intereses', 'datos_adicionales'
];

const $ = (sel) => document.querySelector(sel);
const blockById = (id) => BLOQUES_DATA.bloques.find((b) => b.id === id);
const designById = (id) => PALETAS_DATA.disenos.find((d) => d.id === id) || PALETAS_DATA.disenos[0];

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function nl2br(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/* ---------------------- Estado ---------------------- */

function initialState() {
  const preset = BLOQUES_DATA.presets.find((p) => p.id === 'profesional') || BLOQUES_DATA.presets[0];
  const custom = PALETAS_DATA.disenos[0].paletas.personalizada.tonos;
  return {
    preset: preset.id,
    selectedBlocks: preset.bloques.slice(),
    design: PALETAS_DATA.disenos[0].id,
    paletteMode: 'paleta_1',
    custom: Object.assign({}, custom),
    data: {},
    items: {}
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.selectedBlocks)) {
        return Object.assign(initialState(), parsed);
      }
    }
  } catch (e) { /* almacenamiento no disponible */ }
  return initialState();
}

let state = loadState();

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
}

function ensureData(blockId) {
  if (!state.data[blockId]) state.data[blockId] = {};
  return state.data[blockId];
}

/* ---------------------- Panel de control ---------------------- */

function renderPresets() {
  $('#presets').innerHTML = BLOQUES_DATA.presets.map((p) =>
    `<button type="button" class="preset-btn ${state.preset === p.id ? 'active' : ''}" data-preset="${p.id}">${escapeHtml(p.nombre)}</button>`
  ).join('');
}

function renderBlockList() {
  $('#block-list').innerHTML = BLOQUES_DATA.bloques.map((b) => {
    const active = state.selectedBlocks.includes(b.id);
    return `<div class="block-row ${active ? 'active' : ''} ${b.fijo ? 'fixed' : ''}">
      <input type="checkbox" data-block-toggle="${b.id}" ${active ? 'checked' : ''} ${b.fijo ? 'disabled' : ''}>
      <span class="block-name" data-block-toggle="${b.id}">${escapeHtml(b.nombre)}</span>
      <span class="block-cat">${escapeHtml(b.categoria)}</span>
      ${b.fijo ? '' : `
        <button type="button" class="btn btn-mini" data-block-up="${b.id}" title="Subir">↑</button>
        <button type="button" class="btn btn-mini" data-block-down="${b.id}" title="Bajar">↓</button>`}
    </div>`;
  }).join('');
}

function renderDesigns() {
  $('#designs').innerHTML = PALETAS_DATA.disenos.map((d) =>
    `<button type="button" class="chip ${state.design === d.id ? 'active' : ''}" data-design="${d.id}">${escapeHtml(d.nombre)}</button>`
  ).join('');
}

function renderPalettes() {
  const design = designById(state.design);
  $('#palettes').innerHTML = PALETAS_DATA.modos.map((m) => {
    const paleta = design.paletas[m.id];
    const label = m.id === 'personalizada' ? m.etiqueta : `${m.etiqueta}: ${paleta.nombre}`;
    return `<button type="button" class="chip ${state.paletteMode === m.id ? 'active' : ''}" data-palette="${m.id}" title="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
  }).join('');

  $('#custom-colors').hidden = state.paletteMode !== 'personalizada';
  if (state.paletteMode === 'personalizada') {
    $('#color-base').value = state.custom.base;
    $('#color-lineas').value = state.custom.lineas;
    $('#color-decorativo').value = state.custom.decorativo;
  }
}

/* ---------------------- Formulario dinámico ---------------------- */

function fieldsFor(block) {
  if (block.tipo === 'tags' && block.grupos && block.grupos.length) {
    return block.grupos.map((g) => ({
      clave: 'grupo_' + g.clave,
      etiqueta: g.etiqueta,
      tipo: 'texto',
      placeholder: 'Separadas por coma'
    }));
  }
  return block.campos || [];
}

function fieldHtml(field, value, blockId, itemIndex) {
  const idx = itemIndex === null || itemIndex === undefined ? '' : ` data-item="${itemIndex}"`;
  const attrs = `data-block="${blockId}" data-field="${field.clave}"${idx}`;
  const ph = escapeHtml(field.placeholder || '');
  let input;

  switch (field.tipo) {
    case 'textarea':
      input = `<textarea ${attrs} placeholder="${ph}">${escapeHtml(value || '')}</textarea>`;
      break;
    case 'opciones':
      input = `<select ${attrs}>${(field.opciones || []).map((o) =>
        `<option value="${escapeHtml(o)}" ${value === o ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}</select>`;
      break;
    case 'booleano':
      return `<div class="field field-check">
        <input type="checkbox" ${attrs} ${value ? 'checked' : ''}>
        <label>${escapeHtml(field.etiqueta)}</label>
      </div>`;
    case 'archivo':
      input = `<input type="file" accept="image/*" ${attrs}>`;
      break;
    case 'email':
    case 'url':
    case 'mes':
    case 'fecha':
      input = `<input type="${field.tipo}" ${attrs} value="${escapeHtml(value || '')}" placeholder="${ph}">`;
      break;
    default:
      input = `<input type="text" ${attrs} value="${escapeHtml(value || '')}" placeholder="${ph}">`;
  }

  return `<div class="field"><label>${escapeHtml(field.etiqueta)}</label>${input}</div>`;
}

function blockFormHtml(block) {
  const data = state.data[block.id] || {};
  let body;

  if (block.tipo === 'lista') {
    const items = state.items[block.id] || [];
    body = items.map((item, i) => `
      <div class="item-card">
        <div class="item-card-head">
          <span>Entrada ${i + 1}</span>
          <button type="button" class="btn btn-mini btn-danger" data-item-remove="${block.id}" data-index="${i}">Eliminar</button>
        </div>
        ${(block.item_campos || []).map((f) => fieldHtml(f, item[f.clave], block.id, i)).join('')}
      </div>`).join('') +
      `<button type="button" class="btn btn-mini" data-item-add="${block.id}">+ Agregar entrada</button>`;
  } else {
    body = fieldsFor(block).map((f) => fieldHtml(f, data[f.clave], block.id, null)).join('');
  }

  return `<section class="form-block" data-form-block="${block.id}">
    <header class="form-block-head">
      <h3>${escapeHtml(block.nombre)}</h3>
      ${block.fijo ? '' : `<button type="button" class="btn btn-mini btn-danger" data-block-remove="${block.id}">Quitar</button>`}
    </header>
    <div class="form-block-body">${body || '<p class="panel-hint">Sin campos configurados.</p>'}</div>
  </section>`;
}

function renderForm() {
  $('#form-root').innerHTML = state.selectedBlocks
    .map((id) => blockFormHtml(blockById(id)))
    .filter(Boolean)
    .join('');
}

/* ---------------------- Colores y contraste ---------------------- */

function luminance(hex) {
  const h = String(hex).replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x) : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
  const rgb = full.map((x) => parseInt(x, 16) / 255).map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(l1, l2) {
  const a = Math.max(l1, l2), b = Math.min(l1, l2);
  return (a + 0.05) / (b + 0.05);
}

const COLOR_CLARO = '#FFFFFF';
const COLOR_OSCURO = '#111827';
const CONTRASTE_MINIMO = 4.5;

function parseHex(hex) {
  const h = String(hex).replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x) : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
  return full.map((x) => parseInt(x, 16));
}

function rgbToHex(rgb) {
  return '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function mezclar(a, b, t) {
  const ca = parseHex(a), cb = parseHex(b);
  return rgbToHex(ca.map((v, i) => v + (cb[i] - v) * t));
}

function contrasteCon(hex, otro) {
  return contrastRatio(luminance(hex), luminance(otro));
}

// Elige blanco negro segun cual de los dos de mayor contraste sobre el color dado.
function mejorTextoSobre(hex) {
  return contrasteCon(hex, COLOR_CLARO) >= contrasteCon(hex, COLOR_OSCURO) ? COLOR_CLARO : COLOR_OSCURO;
}

// Oscurece un tono conservando su matiz hasta que sea legible como texto sobre blanco.
function oscurecerHastaContraste(hex, fondo, minimo) {
  let actual = hex;
  for (let i = 0; i < 30 && contrasteCon(actual, fondo) < minimo; i++) {
    actual = mezclar(actual, '#000000', 0.08);
  }
  return actual;
}

function getColors() {
  const design = designById(state.design);
  const tonos = state.paletteMode === 'personalizada'
    ? state.custom
    : (design.paletas[state.paletteMode] || design.paletas.paleta_1).tonos;

  const textoBase = mejorTextoSobre(tonos.base);
  const textoLineas = mejorTextoSobre(tonos.lineas);
  const textoDecorativo = mejorTextoSobre(tonos.decorativo);
  const baseLegible = oscurecerHastaContraste(tonos.base, COLOR_CLARO, CONTRASTE_MINIMO);
  const lineasLegible = oscurecerHastaContraste(tonos.lineas, COLOR_CLARO, CONTRASTE_MINIMO);

  return Object.assign({}, tonos, {
    textoBase, textoLineas, textoDecorativo, baseLegible, lineasLegible,
    ratio: contrasteCon(tonos.base, textoBase),
    ajustado: baseLegible.toLowerCase() !== tonos.base.toLowerCase() ||
              lineasLegible.toLowerCase() !== tonos.lineas.toLowerCase()
  });
}

/* ---------------------- Render del CV ---------------------- */

function renderHeader() {
  const d = state.data['cabecera'] || {};
  if (!d.nombre) return '';

  const contact = [];
  if (d.telefono) contact.push(`<span>${escapeHtml(d.telefono)}</span>`);
  if (d.email) contact.push(`<span><a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></span>`);
  if (d.ciudad_pais) contact.push(`<span>${escapeHtml(d.ciudad_pais)}</span>`);
  const links = [
    ['linkedin', d.linkedin, 'LinkedIn'],
    ['github_portafolio', d.github_portafolio, 'Portafolio'],
    ['sitio_web', d.sitio_web, 'Web']
  ];
  links.forEach(([key, val, label]) => {
    if (val) contact.push(`<span><a href="${escapeHtml(val)}" target="_blank" rel="noreferrer">${label}</a></span>`);
  });

  const foto = d.foto ? `<img class="cv-foto" src="${d.foto}" alt="">` : '';
  return `<header class="cv-header">
    ${foto}
    <h1 class="cv-name">${escapeHtml(d.nombre)}</h1>
    ${d.titulo_profesional ? `<div class="cv-title">${escapeHtml(d.titulo_profesional)}</div>` : ''}
    ${contact.length ? `<div class="cv-contact">${contact.join('')}</div>` : ''}
  </header>`;
}

function renderSection(block, inner) {
  if (!inner || !inner.trim()) return '';
  return `<section class="cv-section cv-section--${block.id}">
    <h2 class="cv-section-title">${escapeHtml(block.nombre)}</h2>
    <div class="cv-section-body">${inner}</div>
  </section>`;
}

function itemsOf(blockId) {
  return state.items[blockId] || [];
}

function renderExperiencia(block) {
  return itemsOf(block.id).map((it) => {
    const fechas = [it.fecha_inicio, it.actual ? 'Actual' : it.fecha_fin].filter(Boolean).join(' — ');
    const logros = it.logros
      ? `<ul>${it.logros.split('\n').filter((l) => l.trim()).map((l) => `<li>${escapeHtml(l.trim())}</li>`).join('')}</ul>`
      : '';
    const meta = it.empresa
      ? `<div class="cv-item-sub">${escapeHtml(it.empresa)}${it.ubicacion ? ' · ' + escapeHtml(it.ubicacion) : ''}</div>`
      : '';
    return `<div class="cv-item">
      <div class="cv-item-head">
        <span class="cv-item-title">${escapeHtml(it.puesto)}</span>
        <span class="cv-item-meta">${escapeHtml(fechas)}</span>
      </div>
      ${meta}
      ${logros}
      ${it.tecnologias ? `<div class="cv-item-meta" style="margin-top:3px">${escapeHtml(it.tecnologias)}</div>` : ''}
    </div>`;
  }).join('');
}

function renderProyectos(block) {
  return itemsOf(block.id).map((it) => {
    const enlace = it.enlace
      ? `<div class="cv-item-meta"><a href="${escapeHtml(it.enlace)}" target="_blank" rel="noreferrer">Ver proyecto ↗</a></div>`
      : '';
    const meta = [it.rol, it.periodo, it.resultado].filter(Boolean).map(escapeHtml).join(' · ');
    return `<div class="cv-item">
      <div class="cv-item-head">
        <span class="cv-item-title">${escapeHtml(it.nombre)}</span>
        <span class="cv-item-meta">${meta}</span>
      </div>
      ${it.descripcion ? `<p>${nl2br(it.descripcion)}</p>` : ''}
      ${it.tecnologias ? `<div class="cv-item-meta" style="margin-top:3px">${escapeHtml(it.tecnologias)}</div>` : ''}
      ${enlace}
    </div>`;
  }).join('');
}

function renderEducacion(block) {
  return itemsOf(block.id).map((it) => {
    const fechas = [it.fecha_inicio, it.fecha_fin].filter(Boolean).join(' — ');
    const extra = [it.estado, it.promedio_honores, it.cursos].filter(Boolean).map(escapeHtml).join(' · ');
    return `<div class="cv-item">
      <div class="cv-item-head">
        <span class="cv-item-title">${escapeHtml(it.titulo)}</span>
        <span class="cv-item-meta">${escapeHtml(fechas)}</span>
      </div>
      ${it.institucion ? `<div class="cv-item-sub">${escapeHtml(it.institucion)}${it.ubicacion ? ' · ' + escapeHtml(it.ubicacion) : ''}</div>` : ''}
      ${extra ? `<div class="cv-item-meta" style="margin-top:3px">${extra}</div>` : ''}
    </div>`;
  }).join('');
}

function renderHabilidades(block) {
  const d = state.data[block.id] || {};
  const makeTags = (raw) => String(raw).split(',').map((t) => t.trim()).filter(Boolean)
    .map((t) => `<span class="cv-tag">${escapeHtml(t)}</span>`).join('');

  if (block.grupos && block.grupos.length) {
    return block.grupos.map((g) => {
      const tags = makeTags(d['grupo_' + g.clave] || '');
      if (!tags) return '';
      return `<div class="cv-tag-group"><b>${escapeHtml(g.etiqueta)}</b><div class="cv-tags">${tags}</div></div>`;
    }).join('');
  }
  const tags = makeTags(d.habilidades || '');
  return tags ? `<div class="cv-tags">${tags}</div>` : '';
}

function renderIdiomas(block) {
  return itemsOf(block.id).map((it) => {
    const extra = [it.nivel, it.certificacion].filter(Boolean).map(escapeHtml).join(' · ');
    return `<div class="cv-item"><div class="cv-item-head">
      <span class="cv-item-title">${escapeHtml(it.idioma)}</span>
      <span class="cv-item-meta">${extra}</span>
    </div></div>`;
  }).join('');
}

function renderSimple(block) {
  const d = state.data[block.id] || {};
  return fieldsFor(block).map((f) => {
    const v = d[f.clave];
    if (v === undefined || v === null || v === '' || v === false) return '';
    const val = Array.isArray(v) ? v.join(', ') : v;
    if (f.tipo === 'textarea') return `<p>${nl2br(val)}</p>`;
    return `<div class="cv-field-row"><span class="k">${escapeHtml(f.etiqueta)}:</span><span class="v">${escapeHtml(val)}</span></div>`;
  }).join('');
}

function renderGenericList(block) {
  return itemsOf(block.id).map((item) => {
    const parts = (block.item_campos || []).map((f) => {
      const v = item[f.clave];
      if (v === undefined || v === null || v === '' || v === false) return '';
      if (f.tipo === 'textarea') return `<p>${nl2br(v)}</p>`;
      return `<div class="cv-field-row"><span class="k">${escapeHtml(f.etiqueta)}:</span><span class="v">${escapeHtml(v)}</span></div>`;
    }).join('');
    return parts ? `<div class="cv-item">${parts}</div>` : '';
  }).join('');
}

function renderBlock(id) {
  const block = blockById(id);
  if (!block) return '';
  if (block.id === 'cabecera') return renderHeader();

  let inner = '';
  switch (block.id) {
    case 'resumen':
    case 'objetivo': {
      const d = state.data[block.id] || {};
      inner = d.texto ? `<p>${nl2br(d.texto)}</p>` : '';
      if (d.palabras_clave) {
        inner += `<div class="cv-item-meta" style="margin-top:4px">Palabras clave: ${escapeHtml(d.palabras_clave)}</div>`;
      }
      break;
    }
    case 'experiencia': inner = renderExperiencia(block); break;
    case 'proyectos': inner = renderProyectos(block); break;
    case 'educacion': inner = renderEducacion(block); break;
    case 'habilidades': inner = renderHabilidades(block); break;
    case 'idiomas': inner = renderIdiomas(block); break;
    case 'referencias': {
      const d = state.data[block.id] || {};
      inner = d.modo === 'Disponibles a solicitud'
        ? '<p>Referencias disponibles a solicitud.</p>'
        : renderSimple(block);
      break;
    }
    default:
      inner = block.tipo === 'lista' ? renderGenericList(block) : renderSimple(block);
  }
  return renderSection(block, inner);
}

function renderPreview() {
  const colors = getColors();
  const preview = $('#preview');
  preview.className = 'cv cv--' + state.design;
  preview.style.setProperty('--base', colors.base);
  preview.style.setProperty('--lineas', colors.lineas);
  preview.style.setProperty('--decorativo', colors.decorativo);
  preview.style.setProperty('--texto-base', colors.textoBase);
  preview.style.setProperty('--texto-lineas', colors.textoLineas);
  preview.style.setProperty('--texto-decorativo', colors.textoDecorativo);
  preview.style.setProperty('--base-legible', colors.baseLegible);
  preview.style.setProperty('--lineas-legible', colors.lineasLegible);

  const ids = state.selectedBlocks;
  const header = ids.includes('cabecera') ? renderHeader() : '';

  if (state.design === 'moderno') {
    const side = ids.filter((id) => id !== 'cabecera' && SIDEBAR_BLOCKS.includes(id));
    const main = ids.filter((id) => id !== 'cabecera' && !SIDEBAR_BLOCKS.includes(id));
    preview.innerHTML = `
      <div class="cv-topband">${header}</div>
      <aside class="cv-sidebar">${side.map(renderBlock).join('')}</aside>
      <main class="cv-content">${main.map(renderBlock).join('')}</main>`;
  } else if (state.design === 'creativo') {
    const main = ids.filter((id) => id !== 'cabecera');
    preview.innerHTML = `
      <div class="cv-topband">${header}</div>
      <main class="cv-content">${main.map(renderBlock).join('')}</main>`;
  } else {
    preview.innerHTML = `<main class="cv-content">${ids.map(renderBlock).join('')}</main>`;
  }

  const warning = $('#color-warning');
  if (colors.ajustado) {
    warning.hidden = false;
    warning.textContent = '✓ Contraste ajustado automáticamente para mantener el texto legible.';
  } else {
    warning.hidden = true;
  }
}

function renderAll() {
  renderPresets();
  renderBlockList();
  renderDesigns();
  renderPalettes();
  renderForm();
  renderPreview();
  saveState();
}

/* ---------------------- Reglas de negocio ---------------------- */

function applyRulesForToggle(id, enabling) {
  if (enabling && id === 'objetivo' && state.selectedBlocks.includes('resumen')) {
    state.selectedBlocks = state.selectedBlocks.filter((x) => x !== 'resumen');
  }
  if (enabling && id === 'resumen' && state.selectedBlocks.includes('objetivo')) {
    state.selectedBlocks = state.selectedBlocks.filter((x) => x !== 'objetivo');
  }
  if (!enabling) {
    const core = ['experiencia', 'proyectos', 'educacion'];
    if (core.includes(id) && state.selectedBlocks.filter((x) => core.includes(x)).length === 1) {
      alert('Debe conservar al menos uno de: experiencia, proyectos o educación.');
      return false;
    }
  }
  return true;
}

function toggleBlock(id, enable) {
  const block = blockById(id);
  if (!block || block.fijo) return;
  const has = state.selectedBlocks.includes(id);
  if (enable && !has) {
    if (!applyRulesForToggle(id, true)) return;
    state.selectedBlocks.push(id);
  } else if (!enable && has) {
    if (!applyRulesForToggle(id, false)) return;
    state.selectedBlocks = state.selectedBlocks.filter((x) => x !== id);
  }
  renderAll();
}

function moveBlock(id, dir) {
  const i = state.selectedBlocks.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= state.selectedBlocks.length) return;
  const tmp = state.selectedBlocks[i];
  state.selectedBlocks[i] = state.selectedBlocks[j];
  state.selectedBlocks[j] = tmp;
  renderAll();
}

/* ---------------------- Eventos ---------------------- */

$('#block-list').addEventListener('change', (e) => {
  const el = e.target;
  if (el.matches('input[type="checkbox"][data-block-toggle]')) {
    toggleBlock(el.dataset.blockToggle, el.checked);
  }
});

$('#block-list').addEventListener('click', (e) => {
  const t = e.target.closest('[data-block-toggle], [data-block-up], [data-block-down], [data-block-remove]');
  if (!t || t.tagName === 'INPUT') return;
  if (t.dataset.blockToggle) toggleBlock(t.dataset.blockToggle, !state.selectedBlocks.includes(t.dataset.blockToggle));
  else if (t.dataset.blockUp) moveBlock(t.dataset.blockUp, -1);
  else if (t.dataset.blockDown) moveBlock(t.dataset.blockDown, 1);
});

$('#panel-left').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;

  if (t.dataset.preset) {
    const p = BLOQUES_DATA.presets.find((x) => x.id === t.dataset.preset);
    if (p) { state.preset = p.id; state.selectedBlocks = p.bloques.slice(); renderAll(); }
  } else if (t.dataset.design) {
    state.design = t.dataset.design;
    renderDesigns(); renderPalettes(); renderPreview(); saveState();
  } else if (t.dataset.palette) {
    state.paletteMode = t.dataset.palette;
    renderPalettes(); renderPreview(); saveState();
  } else if (t.dataset.blockRemove) {
    state.selectedBlocks = state.selectedBlocks.filter((x) => x !== t.dataset.blockRemove);
    renderAll();
  }
});

['base', 'lineas', 'decorativo'].forEach((key) => {
  $('#color-' + key).addEventListener('input', (e) => {
    state.custom[key] = e.target.value;
    saveState();
    renderPreview();
  });
});

function onFieldChange(e) {
  const el = e.target;
  const blockId = el.dataset.block;
  const field = el.dataset.field;
  if (!blockId || !field) return;

  if (el.type === 'file') {
    const file = el.files && el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      ensureData(blockId)[field] = reader.result;
      saveState();
      renderPreview();
    };
    reader.readAsDataURL(file);
    return;
  }

  const value = el.type === 'checkbox' ? el.checked : el.value;
  if (el.dataset.item !== undefined) {
    const idx = Number(el.dataset.item);
    if (!state.items[blockId]) state.items[blockId] = [];
    if (!state.items[blockId][idx]) state.items[blockId][idx] = {};
    state.items[blockId][idx][field] = value;
  } else {
    ensureData(blockId)[field] = value;
  }
  saveState();
  renderPreview();
}

$('#form-root').addEventListener('input', onFieldChange);
$('#form-root').addEventListener('change', onFieldChange);

$('#form-root').addEventListener('click', (e) => {
  const t = e.target.closest('[data-item-add], [data-item-remove], [data-block-remove]');
  if (!t) return;

  if (t.dataset.itemAdd) {
    const id = t.dataset.itemAdd;
    const block = blockById(id);
    const item = {};
    (block.item_campos || []).forEach((f) => { item[f.clave] = f.tipo === 'booleano' ? false : ''; });
    if (!state.items[id]) state.items[id] = [];
    state.items[id].push(item);
    saveState(); renderForm(); renderPreview();
  } else if (t.dataset.itemRemove) {
    const id = t.dataset.itemRemove;
    state.items[id].splice(Number(t.dataset.index), 1);
    saveState(); renderForm(); renderPreview();
  } else if (t.dataset.blockRemove) {
    state.selectedBlocks = state.selectedBlocks.filter((x) => x !== t.dataset.blockRemove);
    renderAll();
  }
});

$('#btn-print').addEventListener('click', () => window.print());

$('#btn-clear').addEventListener('click', () => {
  if (confirm('¿Borrar todos los datos y volver al perfil inicial?')) {
    state = initialState();
    saveState();
    renderAll();
  }
});

/* ---------------------- Inicio ---------------------- */
renderAll();
