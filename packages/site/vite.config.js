// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { viteStaticCopy } from 'vite-plugin-static-copy';

process.env.DEBUG = 'vite:plugin-static-copy';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    base: './',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: '../../packages/storybook/dist',
                    dest: 'storybook',
                    overwrite: 'error',
                    rename: { stripBase: 3 },
                },
                {
                    src: '../../packages/angular-workspace/dist/example-client-app',
                    dest: 'storybook/example-client-app',
                    overwrite: 'error',
                    rename: { stripBase: 3 },
                },
                {
                    src: '../../packages/blazor-workspace/dist/blazor-client-app',
                    dest: 'storybook/blazor-client-app',
                    overwrite: 'error',
                    rename: { stripBase: 3 },
                },
                {
                    src: '../../packages/react-workspace/react-client-app/dist',
                    dest: 'storybook/react-client-app',
                    overwrite: 'error',
                    rename: { stripBase: 3 },
                },
                {
                    src: '../../packages/performance/dist',
                    dest: 'storybook/performance',
                    overwrite: 'error',
                    rename: { stripBase: 2 },
                },
            ],
        }),
    ],
});
