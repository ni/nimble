/* eslint-disable import/no-extraneous-dependencies, import/no-default-export */
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
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
            screenshotFailures: true
        },
        // Increase timeout for browser tests (default is 5000ms)
        testTimeout: 10000,
        setupFiles: ['./src/utilities/tests/setup-vitest.ts'],
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
