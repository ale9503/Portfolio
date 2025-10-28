const DEFAULT_SOURCE = resolveDefaultSource();
const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });

/**
 * Obtiene y normaliza la información de skills desde un endpoint JSON.
 * @param {string} [url]
 */
export async function loadSkillsData(url = DEFAULT_SOURCE) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`No se pudo cargar el detalle de skills. Código ${response.status}`);
    }

    const raw = await response.json();
    return normalizeSkills(raw);
  } catch (error) {
    if (url === DEFAULT_SOURCE) {
      const fallbackUrl = '/Files/skills_details.json';
      if (fallbackUrl !== url) {
        return loadSkillsData(fallbackUrl);
      }
    }
    throw error;
  }
}

/**
 * Normaliza los registros provenientes del CSV convertido a JSON.
 * @param {Array<Record<string, unknown>>} rawData
 */
export function normalizeSkills(rawData = []) {
  if (!Array.isArray(rawData)) {
    return createEmptyDataset();
  }

  const toolAccumulator = new Set();
  const typeAccumulator = new Map();
  const categoryAccumulator = new Set();
  let hasNoYear = false;
  let hasNoCategory = false;

  const items = rawData.map((entry, index) => {
    const title = safeText(entry['What did I learn?']);
    const learningType = safeText(entry['Learning Type*']);
    const tools = normalizeTools(entry['Skill/Tool']);
    const categories = normalizeCategories(entry['Categoria']);
    const description = safeText(entry['Description']);
    const dateInfo = parseDate(entry['Record Date (DD/MM/YYYY)']);

    if (tools.length) {
      tools.forEach(tool => toolAccumulator.add(tool.toLowerCase()));
    }

    if (learningType) {
      typeAccumulator.set(learningType, (typeAccumulator.get(learningType) || 0) + 1);
    }

    if (dateInfo.year === null) {
      hasNoYear = true;
    }

    if (categories.length) {
      categories.forEach(category => {
        categoryAccumulator.add(category);
      });
    } else {
      hasNoCategory = true;
    }

    return {
      id: `${dateInfo.iso || 'na'}-${index}`,
      title,
      learningType,
      tools,
      categories,
      description,
      date: dateInfo,
    };
  });

  const sortableItems = items.sort((a, b) => {
    const aTime = typeof a.date.sortable === 'number' ? a.date.sortable : -Infinity;
    const bTime = typeof b.date.sortable === 'number' ? b.date.sortable : -Infinity;
    return bTime - aTime;
  });

  const uniqueYears = new Set();
  sortableItems.forEach(item => {
    if (typeof item.date.year === 'number') {
      uniqueYears.add(item.date.year);
    }
  });

  const years = Array.from(uniqueYears).sort((a, b) => b - a).map(String);
  if (hasNoYear) {
    years.push('Sin fecha');
  }

  if (hasNoCategory) {
    categoryAccumulator.add('Sin categoría');
  }

  const categories = Array.from(categoryAccumulator)
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

  const latestWithDate = sortableItems.find(item => typeof item.date.sortable === 'number');

  return {
    items: sortableItems,
    years,
    categories,
    meta: {
      total: sortableItems.length,
      uniqueTools: toolAccumulator.size,
      lastUpdate: latestWithDate?.date.display ?? 'Sin registros',
    },
    types: Object.fromEntries(typeAccumulator),
  };
}

function createEmptyDataset() {
  return {
    items: [],
    years: [],
    categories: [],
    meta: {
      total: 0,
      uniqueTools: 0,
      lastUpdate: 'Sin registros',
    },
    types: {},
  };
}

function safeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeCategories(value) {
  if (value === null || value === undefined) return [];

  const source = Array.isArray(value) ? value : [value];

  return source
    .flatMap(token => {
      const text = safeText(token);
      if (!text) return [];
      return text.split(/[\n,;•·\u2022\u2013\u2014]+/);
    })
    .map(token => safeText(token).replace(/^[\-–—]\s*/, ''))
    .map(token => token.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function normalizeTools(value) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : String(value);
  return raw
    .split(/[\n,;•·\u2022\u2013\u2014]+/)
    .map(token => token.replace(/^[\-–—]\s*/, '').trim())
    .filter(Boolean);
}

function parseDate(value) {
  const rawText = safeText(value);
  if (!rawText) {
    return {
      raw: '',
      iso: null,
      display: 'Sin fecha',
      year: null,
      yearLabel: 'Sin fecha',
      sortable: null,
    };
  }

  const normalized = rawText.replace(/\s+/g, ' ');
  const match = normalized.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (match) {
    const [, d, m, y] = match;
    const day = Number.parseInt(d, 10);
    const month = Number.parseInt(m, 10);
    let year = Number.parseInt(y, 10);
    if (year < 100) {
      year += 2000;
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    if (!Number.isNaN(date.getTime())) {
      return {
        raw: rawText,
        iso: date.toISOString(),
        display: DATE_FORMATTER.format(date),
        year,
        yearLabel: String(year),
        sortable: date.getTime(),
      };
    }
  }

  const yearOnlyMatch = normalized.match(/(19|20)\d{2}/);
  if (yearOnlyMatch) {
    const year = Number.parseInt(yearOnlyMatch[0], 10);
    const date = new Date(Date.UTC(year, 0, 1));
    return {
      raw: rawText,
      iso: date.toISOString(),
      display: String(year),
      year,
      yearLabel: String(year),
      sortable: date.getTime(),
    };
  }

  return {
    raw: rawText,
    iso: null,
    display: rawText,
    year: null,
    yearLabel: 'Sin fecha',
    sortable: null,
  };
}

export function getLearningTypeSlug(type) {
  return safeText(type)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
}

function resolveDefaultSource() {
  if (typeof window !== 'undefined' && window?.location?.href) {
    try {
      return new URL('../Files/skills_details.json', window.location.href).toString();
    } catch (error) {
      console.warn('No se pudo resolver la ruta base de skills_details.json, se usará el path absoluto.', error);
    }
  }

  return '/Files/skills_details.json';
}
