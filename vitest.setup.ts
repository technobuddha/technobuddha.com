// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
/// <reference types="vite/client" />
import fs from 'node:fs/promises';
import path from 'node:path';

import jestExtended from 'jest-extended';
import jestMatcherDeepCloseTo from 'jest-matcher-deep-close-to';
import { beforeAll, expect } from 'vitest';

expect.extend(jestExtended);
expect.extend(jestMatcherDeepCloseTo);

if (import.meta.env.MODE === 'full') {
  type GlobalFixtures = { fixtures?: Record<string, unknown> };
  const globalFixtures = globalThis as GlobalFixtures;
  globalFixtures.fixtures ??= {};

  beforeAll(async () => {
    await fs.readdir('./fixtures', { withFileTypes: true }).then(async (files) => {
      for (const file of files) {
        if (
          file.isFile() &&
          path.parse(file.name).ext === '.json' &&
          file.name !== 'tsconfig.json' &&
          file.name !== 'tsdoc.json'
        ) {
          await fs.readFile(`./fixtures/${file.name}`, 'utf-8').then((json) => {
            globalFixtures.fixtures![path.parse(file.name).name] = JSON.parse(json);
          });
        }
      }
    });
  });
}
