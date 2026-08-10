import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getDailyConstellation,
  getPublicConstellation,
} from '../api/constellation-data.js';
import previewHandler from '../api/index.js';

test('uses one deterministic constellation for the same UTC date', () => {
  const date = new Date('2026-08-10T12:00:00.000Z');

  assert.deepEqual(getDailyConstellation(date), getDailyConstellation(date));
});

test('returns a deployment-local absolute artwork URL', () => {
  const request = {
    headers: {
      host: 'constellations.example',
      'x-forwarded-proto': 'https',
    },
  };
  const constellation = getPublicConstellation(request, {
    name: 'Andromeda',
    latin: 'Andromeda',
    description: 'Example',
    image: '/constellations/andromeda.png',
  });

  assert.equal(constellation.image, 'https://constellations.example/constellations/andromeda.png');
});

test('preview uses the same local artwork URL as the data endpoint', () => {
  let body = '';
  const response = {
    setHeader() {},
    status() {
      return this;
    },
    send(value) {
      body = value;
      return this;
    },
  };

  previewHandler({ headers: { host: 'constellations.example' } }, response);

  assert.match(body, /https:\/\/constellations\.example\/constellations\/[a-z]+\.png/);
  assert.doesNotMatch(body, /noirlab\.edu/);
});
