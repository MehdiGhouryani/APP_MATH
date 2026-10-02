import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/learning-runtime/src/__tests__/**/*.test.ts', 'packages/offline-sync/src/**/*.test.ts', 'apps/mobile/src/**/*.test.ts', 'apps/web/lib/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    globals: true,
  },
});
