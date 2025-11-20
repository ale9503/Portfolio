const DEFAULT_LOCALE = detectLocale();
const DEFAULT_SOURCE = resolveDefaultSource();

const LABELS = {
  es: {
    noCategory: 'Sin categoría',
    noDate: 'Sin fecha',
    noExactDate: 'Sin fecha exacta',
    noRecords: 'Sin registros',
  },
  en: {
    noCategory: 'No category',
    noDate: 'No date',
    noExactDate: 'No exact date',
    noRecords: 'No records',
  },
};

export function getLocaleConfig(locale = DEFAULT_LOCALE) {
  const lang = normalizeLocale(locale);
  const intlLocale = lang === 'en' ? 'en-US' : 'es-ES';
  return { lang, intlLocale, labels: LABELS[lang] };
}

/**
 * Obtiene y normaliza la información de skills desde un endpoint JSON.
 * @param {string} [url]
 * @param {string} [locale]
 */
export async function loadSkillsData(url = DEFAULT_SOURCE, locale = DEFAULT_LOCALE) {
  const config = getLocaleConfig(locale);
  const dateFormatter = buildDateFormatter(config.intlLocale);

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`No se pudo cargar el detalle de skills. Código ${response.status}`);
    }

    const raw = await response.json();
    return normalizeSkills(raw, { config, dateFormatter });
  } catch (error) {
    if (url === DEFAULT_SOURCE) {
      const fallbackUrl = '/Files/skills_details.json';
      if (fallbackUrl !== url) {
        return loadSkillsData(fallbackUrl, locale);
      }
    }
    throw error;
  }
}

/**
 * Normaliza los registros provenientes del CSV convertido a JSON.
 * @param {Array<Record<string, unknown>>} rawData
 * @param {{ config?: ReturnType<typeof getLocaleConfig>, dateFormatter?: Intl.DateTimeFormat, labels?: typeof LABELS[keyof typeof LABELS], locale?: string }} options
 */
export function normalizeSkills(rawData = [], options = {}) {
  const config = options.config ?? getLocaleConfig(options.locale);
  const labels = options.labels ?? config.labels;
  const dateFormatter = options.dateFormatter ?? buildDateFormatter(config.intlLocale);
  const collatorLocale = config.intlLocale;

  if (!Array.isArray(rawData)) {
    return createEmptyDataset(labels);
  }

  const toolAccumulator = new Set();
  const typeAccumulator = new Map();
  const categoryAccumulator = new Map();
  let hasNoYear = false;

  const items = rawData.map((entry, index) => {
    const title = safeText(entry['What did I learn?']);
    const learningType = safeText(entry['Learning Type*']);
    const tools = normalizeTools(entry['Skill/Tool']);
    const categories = normalizeCategories(entry['Categoria']);
    const description = safeText(entry['Description']);
    const dateInfo = parseDate(entry['Record Date (DD/MM/YYYY)'], { labels, dateFormatter });

    if (tools.length) {
      tools.forEach(tool => toolAccumulator.add(tool.toLowerCase()));
    }

    if (learningType) {
      typeAccumulator.set(learningType, (typeAccumulator.get(learningType) || 0) + 1);
    }

    if (dateInfo.year === null) {
      hasNoYear = true;
    }

    let normalizedCategories = Array.from(new Set(categories));
    if (!normalizedCategories.length) {
      normalizedCategories = [labels.noCategory];
    }

    normalizedCategories.forEach(category => {
      const label = category || labels.noCategory;
      categoryAccumulator.set(label, (categoryAccumulator.get(label) || 0) + 1);
    });

    return {
      id: `${dateInfo.iso || 'na'}-${index}`,
      title,
      learningType,
      tools,
      categories: normalizedCategories,
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
    years.push(labels.noDate);
  }

  const categories = Array.from(categoryAccumulator.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0], collatorLocale, { sensitivity: 'base' });
    })
    .map(([name]) => name);

  const latestWithDate = sortableItems.find(item => typeof item.date.sortable === 'number');

  return {
    items: sortableItems,
    years,
    categories,
    meta: {
      total: sortableItems.length,
      uniqueTools: toolAccumulator.size,
      lastUpdate: latestWithDate?.date.display ?? labels.noRecords,
      labels,
    },
    types: Object.fromEntries(typeAccumulator),
  };
}

function createEmptyDataset(labels) {
  return {
    items: [],
    years: [],
    categories: [],
    meta: {
      total: 0,
      uniqueTools: 0,
      lastUpdate: labels.noRecords,
      labels,
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

function parseDate(value, { labels, dateFormatter }) {
  const rawText = safeText(value);
  if (!rawText) {
    return {
      raw: '',
      iso: null,
      display: labels.noDate,
      year: null,
      yearLabel: labels.noDate,
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
        display: dateFormatter.format(date),
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
    yearLabel: labels.noDate,
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

function detectLocale() {
  if (typeof document !== 'undefined' && document?.documentElement?.lang) {
    return document.documentElement.lang;
  }
  if (typeof navigator !== 'undefined' && navigator?.language) {
    return navigator.language;
  }
  return 'es';
}

function normalizeLocale(locale) {
  if (!locale || typeof locale !== 'string') return 'es';
  return locale.toLowerCase().startsWith('en') ? 'en' : 'es';
}

function buildDateFormatter(localeTag) {
  return new Intl.DateTimeFormat(localeTag, { dateStyle: 'long' });
}
