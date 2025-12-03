import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import remarkGfm from 'remark-gfm';

const require = createRequire(import.meta.url);

// All files participating in storybook should be in src
// so that TypeScript and linters can track them correctly
export const stories = ['../src/docs', '../src/nimble', '../src/spright', '../src/ok'];
export const addons = [
    {
        name: getAbsolutePath('@storybook/addon-docs'),
        options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }
        }
    },
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('storybook-addon-pseudo-states')
];

export async function viteFinal(config) {
    const { mergeConfig } = await import('vite');

    config.build.minify = false;

    // Support Chromatic Turbosnap in a monorepo
    // See: https://github.com/chromaui/chromatic-cli/issues/1149#issuecomment-2936493954
    // Keep in sync with tsconfig.json
    config.resolve.alias = [
        {
            find: '@ni/nimble-components/dist/esm',
            replacement: '@ni/nimble-components/src'
        },
        {
            find: '@ni/spright-components/dist/esm',
            replacement: '@ni/spright-components/src'
        },
        {
            find: '@ni/ok-components/dist/esm',
            replacement: '@ni/ok-components/src'
        },
        {
            find: '@ni/nimble-react/dist/esm',
            replacement: '@ni/nimble-react/src'
        },
        {
            find: '@ni/spright-react/dist/esm',
            replacement: '@ni/spright-react/src'
        },
        {
            find: '@ni/ok-react/dist/esm',
            replacement: '@ni/ok-react/src'
        },
    ];

    return mergeConfig(config);
}

export const staticDirs = ['public'];
export const framework = {
    name: getAbsolutePath('@storybook/html-vite')
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
