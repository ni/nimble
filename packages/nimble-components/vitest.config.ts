/* eslint-disable import/no-extraneous-dependencies, import/no-default-export */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const packageRoot = dirname(fileURLToPath(import.meta.url));

// Ensure Vitest runs from the package directory, not the monorepo root
if (process.cwd() !== packageRoot) {
    process.chdir(packageRoot);
}

export default defineConfig({
    root: packageRoot,
    base: '/',
    server: {
        // Ensure Vite serves files relative to package root
        fs: {
            strict: false,
            allow: ['..']
        },
        // Disable HMR in CI to prevent module resolution issues
        hmr: process.env.CI ? false : undefined,
        // Add longer timeout for server warmup
        warmup: {
            clientFiles: ['src/**/*.spec.ts']
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
        // Add hook timeout for better error messages
        hookTimeout: 10000,
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
