import { loadSkillsData, getLearningTypeSlug } from '../scripts/skills-data.js';

const NUMBER_FORMATTER = new Intl.NumberFormat('es-ES');

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const tableBody = document.querySelector('[data-skills-body]');
  const insightsGrid = document.querySelector('[data-insights-grid]');
  const selectYear = document.getElementById('skills-year');
  const countLabel = document.querySelector('[data-results-count]');
  const emptyState = document.querySelector('[data-empty-state]');

  if (!tableBody || !insightsGrid || !selectYear || !countLabel || !emptyState) {
    console.warn('No se encontraron los elementos necesarios para renderizar la vista de skills.');
    return;
  }

  try {
    const dataset = await loadSkillsData();
    renderInsights(insightsGrid, dataset);
    populateYearFilter(selectYear, dataset.years);

    const renderer = createTableRenderer({
      tableBody,
      countLabel,
      emptyState,
      total: dataset.meta.total,
    });

    renderer.update(dataset.items, 'all');

    selectYear.addEventListener('change', event => {
      const value = event.target.value;
      renderer.update(dataset.items, value);
    });
  } catch (error) {
    console.error(error);
    countLabel.textContent = 'No pudimos recuperar el resumen en este momento.';
    showError(emptyState, 'No se pudo cargar la información de habilidades. Intenta nuevamente más tarde.');
  }
}

function populateYearFilter(select, years) {
  if (!Array.isArray(years)) return;
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year === 'Sin fecha' ? 'Sin fecha exacta' : year;
    select.appendChild(option);
  });
}

function renderInsights(container, dataset) {
  container.innerHTML = '';
  const metaCards = [
    {
      title: 'Aprendizajes registrados',
      value: dataset.meta.total,
      caption: 'Entradas acumuladas en el registro',
    },
    {
      title: 'Herramientas mencionadas',
      value: dataset.meta.uniqueTools,
      caption: 'Conteo único de tecnologías o métodos',
    },
    {
      title: 'Última actualización',
      value: dataset.meta.lastUpdate,
      caption: 'Fecha más reciente registrada',
    },
  ];

  metaCards.forEach(card => {
    container.appendChild(buildInsightCard(card));
  });

  Object.entries(dataset.types).forEach(([type, count]) => {
    const slug = getLearningTypeSlug(type);
    container.appendChild(buildInsightCard({
      title: type,
      value: count,
      caption: 'Registros con este enfoque',
      badge: slug,
    }));
  });
}

function buildInsightCard({ title, value, caption, badge }) {
  const article = document.createElement('article');
  article.className = 'insight-card';

  if (badge) {
    article.dataset.variant = badge;
  }

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.className = 'insight-card__title';

  const strong = document.createElement('p');
  strong.className = 'insight-card__value';
  strong.textContent = formatValue(value);

  const small = document.createElement('p');
  small.className = 'insight-card__caption';
  small.textContent = caption || '';

  article.append(heading, strong, small);
  return article;
}

function createTableRenderer({ tableBody, countLabel, emptyState, total }) {
  return {
    update(items, filterValue) {
      const filtered = filterByYear(items, filterValue);
      renderRows(tableBody, filtered);
      updateCount(countLabel, filtered.length, total, filterValue);
      toggleEmptyState(emptyState, filtered.length === 0);
    },
  };
}

function filterByYear(items, yearValue) {
  if (!Array.isArray(items)) return [];
  if (!yearValue || yearValue === 'all') return items;

  return items.filter(item => {
    if (yearValue === 'Sin fecha') {
      return item.date.year === null;
    }
    return String(item.date.year) === yearValue;
  });
}

function renderRows(tableBody, items) {
  tableBody.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('tr');
    row.dataset.year = item.date.yearLabel ?? 'Sin fecha';

    row.appendChild(buildCell('th', item.title || 'Sin título', {
      scope: 'row',
      className: 'skill-name',
    }));

    const typeCell = document.createElement('td');
    typeCell.appendChild(buildBadge(item.learningType));
    row.appendChild(typeCell);

    const toolsCell = document.createElement('td');
    toolsCell.appendChild(buildToolsList(item.tools));
    row.appendChild(toolsCell);

    row.appendChild(buildCell('td', item.date.display || 'Sin fecha'));
    row.appendChild(buildCell('td', item.description || '—', { className: 'skill-description' }));

    tableBody.appendChild(row);
  });
}

function buildCell(tag, text, { scope, className } = {}) {
  const cell = document.createElement(tag);
  if (scope) cell.setAttribute('scope', scope);
  if (className) cell.className = className;
  cell.textContent = text;
  return cell;
}

function buildBadge(type) {
  const span = document.createElement('span');
  span.className = 'learning-badge';
  if (!type) {
    span.textContent = 'No especificado';
    span.dataset.variant = 'sin-categoria';
    return span;
  }

  const slug = getLearningTypeSlug(type) || 'sin-categoria';
  span.textContent = type;
  span.dataset.variant = slug;
  return span;
}

function buildToolsList(tools) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tool-tags';

  if (!Array.isArray(tools) || tools.length === 0) {
    wrapper.textContent = '—';
    return wrapper;
  }

  tools.forEach(tool => {
    const tag = document.createElement('span');
    tag.className = 'tool-tag';
    tag.textContent = tool;
    wrapper.appendChild(tag);
  });

  return wrapper;
}

function updateCount(target, current, total, yearValue) {
  if (!target) return;
  const label = yearValue === 'all' || !yearValue
    ? 'todos los años'
    : yearValue === 'Sin fecha'
      ? 'registros sin fecha exacta'
      : `el año ${yearValue}`;

  target.textContent = `Mostrando ${formatValue(current)} de ${formatValue(total)} aprendizajes para ${label}.`;
}

function toggleEmptyState(element, shouldShow) {
  if (!element) return;
  element.hidden = !shouldShow;
}

function showError(container, message) {
  if (!container) return;
  container.hidden = false;
  container.textContent = message;
  container.classList.add('skills-empty--error');
}

function formatValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return NUMBER_FORMATTER.format(value);
  }
  if (value === undefined || value === null || value === '') {
    return '—';
  }
  return String(value);
}
