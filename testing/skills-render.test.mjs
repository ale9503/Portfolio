import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { JSDOM } from 'jsdom';

const stubDataset = {
  items: [
    {
      id: '2024-0',
      title: 'Automatización de design tokens',
      learningType: 'Autodidacta',
      tools: ['Figma Tokens', 'Style Dictionary'],
      description: 'Pipeline para sincronizar design tokens con el repositorio front.',
      date: {
        raw: '10/01/2024',
        iso: '2024-01-10T00:00:00.000Z',
        display: '10 de enero de 2024',
        year: 2024,
        yearLabel: '2024',
        sortable: Date.UTC(2024, 0, 10),
      },
    },
    {
      id: '2023-1',
      title: 'Moderación de entrevistas con usuarios',
      learningType: 'Formal',
      tools: ['Dovetail', 'Miro'],
      description: 'Curso certificado para entrevistas remotas.',
      date: {
        raw: '05/09/2023',
        iso: '2023-09-05T00:00:00.000Z',
        display: '5 de septiembre de 2023',
        year: 2023,
        yearLabel: '2023',
        sortable: Date.UTC(2023, 8, 5),
      },
    },
    {
      id: 'na-2',
      title: 'Coaching de equipo cross-funcional',
      learningType: 'Mentoría',
      tools: [],
      description: 'Acompañamiento continuo para PMs y designers junior.',
      date: {
        raw: '',
        iso: null,
        display: 'Sin fecha',
        year: null,
        yearLabel: 'Sin fecha',
        sortable: null,
      },
    },
  ],
  years: ['2024', '2023', 'Sin fecha'],
  meta: {
    total: 3,
    uniqueTools: 4,
    lastUpdate: '10 de enero de 2024',
  },
  types: {
    Autodidacta: 1,
    Formal: 1,
    Mentoría: 1,
  },
};

test('skills view renderiza métricas y soporta filtrado por año', async () => {
  const dom = new JSDOM(
    `<!DOCTYPE html>
      <html lang="es">
        <body>
          <section>
            <div data-insights-grid></div>
            <p data-results-count></p>
            <div class="skills-empty" data-empty-state hidden>Sin datos</div>
            <label>
              Año
              <select id="skills-year">
                <option value="all">Todos</option>
              </select>
            </label>
            <table>
              <tbody data-skills-body></tbody>
            </table>
          </section>
        </body>
      </html>`,
    { url: 'https://example.com/skills/' }
  );

  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.Event = window.Event;
  globalThis.Node = window.Node;

  mock.module('../scripts/skills-data.js', () => ({
    loadSkillsData: async () => stubDataset,
    getLearningTypeSlug: value =>
      String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-'),
  }));

  await import('../skills/skills.js');
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  await new Promise(resolve => setTimeout(resolve, 0));

  const insightCards = window.document.querySelectorAll('.insight-card');
  assert.equal(insightCards.length, 6);
  assert.equal(window.document.querySelector('[data-results-count]').textContent.trim(), 'Mostrando 3 de 3 aprendizajes para todos los años.');

  let rows = window.document.querySelectorAll('tbody tr');
  assert.equal(rows.length, 3);
  assert.equal(rows[0].querySelector('th').textContent, 'Automatización de design tokens');

  const select = window.document.getElementById('skills-year');
  select.value = '2023';
  select.dispatchEvent(new window.Event('change'));
  await new Promise(resolve => setTimeout(resolve, 0));

  rows = window.document.querySelectorAll('tbody tr');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].dataset.year, '2023');
  assert.equal(window.document.querySelector('[data-results-count]').textContent.trim(), 'Mostrando 1 de 3 aprendizajes para el año 2023.');

  select.value = '2099';
  select.dispatchEvent(new window.Event('change'));
  await new Promise(resolve => setTimeout(resolve, 0));

  rows = window.document.querySelectorAll('tbody tr');
  assert.equal(rows.length, 0);
  assert.equal(window.document.querySelector('[data-results-count]').textContent.trim(), 'Mostrando 0 de 3 aprendizajes para el año 2099.');
  assert.equal(window.document.querySelector('[data-empty-state]').hidden, false);

  mock.restoreAll();
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.HTMLElement;
  delete globalThis.CustomEvent;
  delete globalThis.Event;
  delete globalThis.Node;
});
