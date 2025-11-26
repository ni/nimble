/* eslint-disable import/no-extraneous-dependencies, import/no-default-export */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const packageRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: packageRoot,
    base: './',
    server: {
        fs: {
            // Ensure Vite serves files from packageRoot only
            allow: [packageRoot],
            strict: true
        }
    },
    test: {
        globals: true,
        include: ['src/**/*.spec.ts'],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                {
                    browser:
                        (process.env.BROWSER as
                            | 'chromium'
                            | 'firefox'
                            | 'webkit') || 'chromium'
                }
            ],
            headless: true,
            screenshotFailures: true,
            // Isolate each test file for more stable execution in CI
            isolate: true
        },
        // Increase timeout for browser tests (default is 5000ms)
        testTimeout: 10000,
        // Retry flaky tests once in CI
        retry: process.env.CI ? 1 : 0,
        setupFiles: [
            resolve(packageRoot, 'src/utilities/tests/setup-vitest.ts')
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.spec.ts',
                'src/**/*.stories.ts',
                'src/testing/**/*'
            ]
        }
    }
});
