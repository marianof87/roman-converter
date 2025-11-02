import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'], // solo tests de React
    setupFiles: './src/test/setup.ts', // si tienes setup
  },
})
