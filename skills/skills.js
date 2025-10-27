import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { loadSkillsData, getLearningTypeSlug } from '../scripts/skills-data.js';

const NUMBER_FORMATTER = new Intl.NumberFormat('es-ES');

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const tableBody = document.querySelector('[data-skills-body]');
  const insightsGrid = document.querySelector('[data-insights-grid]');
  const selectYear = document.getElementById('skills-year');
  const countLabel = document.querySelector('[data-results-count]');
  const emptyState = document.querySelector('[data-empty-state]');
  const treemapContainer = document.getElementById('treemap-skills');
  const legendContainer = document.getElementById('treemap-legend');

  if (!tableBody || !insightsGrid || !selectYear || !countLabel || !emptyState || !treemapContainer || !legendContainer) {
    console.warn('No se encontraron los elementos necesarios para renderizar la vista de skills.');
    return;
  }

  treemapContainer.dataset.placeholder = treemapContainer.textContent.trim() || 'El mapa se cargará automáticamente cuando JavaScript esté disponible.';

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

    const treemapData = buildTreemapDataset(dataset.items);
    const treemapResult = renderTreemap(treemapContainer, treemapData);
    renderLegend(legendContainer, treemapResult?.legendItems ?? [], treemapResult?.colorScale);
  } catch (error) {
    console.error(error);
    countLabel.textContent = 'No pudimos recuperar el resumen en este momento.';
    showError(emptyState, 'No se pudo cargar la información de habilidades. Intenta nuevamente más tarde.');
    resetTreemap(treemapContainer, legendContainer);
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
      caption: 'Conteo único de tecnologías, métodologias y herramientas',
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

function buildTreemapDataset(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return { root: null, legend: [] };
  }

  const groups = new Map();

  items.forEach(item => {
    const categories = Array.isArray(item.categories) && item.categories.length
      ? item.categories
      : ['Sin categoría'];
    const value = Array.isArray(item.tools) && item.tools.length ? item.tools.length : 1;
    const nodeName = item.title || 'Sin título';

    categories.forEach(category => {
      const label = category || 'Sin categoría';
      const slug = getLearningTypeSlug(label) || 'sin-categoria';

      if (!groups.has(label)) {
        groups.set(label, {
          name: label,
          slug,
          total: 0,
          children: [],
        });
      }

      const group = groups.get(label);
      group.total += value;
      group.children.push({
        name: nodeName,
        slug,
        value,
      });
    });
  });

  if (groups.size === 0) {
    return { root: null, legend: [] };
  }

  const children = Array.from(groups.values()).map(group => ({
    name: group.name,
    slug: group.slug,
    children: group.children,
    value: group.total,
  }));

  const legend = children
    .map(group => ({ name: group.name, value: group.value, slug: group.slug }))
    .sort((a, b) => b.value - a.value);

  return {
    root: {
      name: 'Aprendizajes',
      children,
    },
    legend,
  };
}

function renderTreemap(container, treemapData) {
  if (!container || !treemapData?.root || !treemapData.root.children.length) {
    resetTreemap(container, null);
    return null;
  }

  const rect = container.getBoundingClientRect();
  const width = Math.max(Math.floor(rect.width) || 640, 320);
  const height = Math.max(container.clientHeight || 360, 320);

  const colorScale = d3.scaleOrdinal()
    .domain(treemapData.legend.map(item => item.slug))
    .range([
      '#005B96',
      '#00A6FB',
      '#0084A8',
      '#FF8C42',
      '#C8553D',
      '#7B5BA5',
      '#2A9D8F',
      '#264653',
      '#E76F51',
      '#1D3557',
    ]);

  const hierarchy = d3.hierarchy(treemapData.root)
    .sum(d => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  const layout = d3.treemap()
    .size([width, height])
    .paddingInner(6)
    .paddingOuter(4)
    .round(true);

  layout(hierarchy);

  container.classList.add('has-chart');
  container.setAttribute('aria-label', 'Distribución de habilidades por categorías y enfoques de aprendizaje.');
  container.innerHTML = '';

  const svg = d3.select(container)
    .append('svg')
    .attr('class', 'treemap-chart')
    .attr('role', 'presentation')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('aria-hidden', 'true');

  const leaves = hierarchy.leaves();

  const nodes = svg.selectAll('g')
    .data(leaves)
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  nodes.append('rect')
    .attr('class', d => `treemap-node treemap-node--${d.data.slug}`)
    .attr('width', d => Math.max(d.x1 - d.x0, 0))
    .attr('height', d => Math.max(d.y1 - d.y0, 0))
    .attr('fill', d => colorScale(d.data.slug))
    .attr('rx', 8)
    .attr('ry', 8);

  nodes.append('text')
    .attr('class', 'treemap-node__label')
    .attr('x', 10)
    .attr('y', 20)
    .text(d => d.data.name)
    .attr('data-visible', d => ((d.x1 - d.x0) > 96 && (d.y1 - d.y0) > 32 ? 'true' : 'false'))
    .style('opacity', d => ((d.x1 - d.x0) > 96 && (d.y1 - d.y0) > 32 ? 1 : 0));

  nodes.append('title')
    .text(d => `${d.parent?.data.name ?? 'Aprendizaje'} · ${d.data.name}`);

  return {
    colorScale,
    legendItems: treemapData.legend,
  };
}

function renderLegend(container, legendItems, colorScale) {
  if (!container) return;

  container.classList.add('treemap-legend');
  container.innerHTML = '';

  if (!Array.isArray(legendItems) || legendItems.length === 0 || !colorScale) {
    container.classList.remove('has-legend');
    return;
  }

  container.classList.add('has-legend');

  const list = document.createElement('ul');
  list.className = 'treemap-legend__list';

  legendItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'treemap-legend__item';

    const swatch = document.createElement('span');
    swatch.className = 'treemap-legend__swatch';
    swatch.style.backgroundColor = colorScale(item.slug);

    const label = document.createElement('span');
    label.className = 'treemap-legend__label';
    label.textContent = `${item.name} (${formatValue(item.value)})`;

    listItem.append(swatch, label);
    list.appendChild(listItem);
  });

  container.appendChild(list);
}

function resetTreemap(container, legendContainer) {
  if (container) {
    container.classList.remove('has-chart');
    container.innerHTML = '';
    const fallback = container.dataset.placeholder || 'El mapa se cargará automáticamente cuando JavaScript esté disponible.';
    container.textContent = fallback;
  }

  if (legendContainer) {
    legendContainer.classList.remove('has-legend', 'treemap-legend');
    legendContainer.innerHTML = '';
  }
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
