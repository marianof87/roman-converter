// server/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'], // Ignora client
    globals: true,
    environment: 'node',
  },
})


