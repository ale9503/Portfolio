import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSkills, getLearningTypeSlug } from '../scripts/skills-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadFixture(name) {
  const filePath = resolve(__dirname, 'fixtures', `${name}.json`);
  const file = await readFile(filePath, 'utf8');
  return JSON.parse(file);
}

test('normalizeSkills procesa correctamente el fixture legacy', async t => {
  const raw = await loadFixture('skills-legacy');
  const dataset = normalizeSkills(raw);

  assert.equal(dataset.meta.total, 3, 'debe conservar el total de registros');
  assert.equal(dataset.meta.uniqueTools, 4, 'debe calcular las herramientas únicas');
  assert.deepEqual(dataset.years, ['2022', '2021', 'Sin fecha']);
  assert.equal(dataset.items[0].title, 'React Hooks fundamentals');
  assert.ok(dataset.meta.lastUpdate.includes('2022'));

  await t.test('agrupar tipos de aprendizaje', () => {
    assert.deepEqual(dataset.types, {
      Autodidacta: 1,
      Formal: 1,
      Mentoría: 1,
    });
  });
});

test('normalizeSkills ordena, resume y agrega métricas en el fixture actual', async () => {
  const raw = await loadFixture('skills-current');
  const dataset = normalizeSkills(raw);

  assert.equal(dataset.items.length, 4);
  assert.equal(dataset.meta.uniqueTools, 8);
  assert.deepEqual(dataset.years, ['2024', '2023', '2022', 'Sin fecha']);
  assert.equal(dataset.items[0].title, 'Automatización de design tokens');
  assert.ok(dataset.meta.lastUpdate.includes('2024'));
  assert.deepEqual(dataset.types, {
    Autodidacta: 1,
    Formal: 1,
    Proyecto: 1,
    Mentoría: 1,
  });
});

test('getLearningTypeSlug genera slugs legibles y consistentes', () => {
  assert.equal(getLearningTypeSlug('Aprendizaje Formal'), 'aprendizaje-formal');
  assert.equal(getLearningTypeSlug('Mentoría / Coaching'), 'mentoria-coaching');
  assert.equal(getLearningTypeSlug('  '), '');
});
