import { dirname, join } from 'path';
import remarkGfm from 'remark-gfm';

// All files participating in storybook should be in src
// so that TypeScript and linters can track them correctly
export const stories = ['../src/docs', '../src/nimble', '../src/spright'];
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

export const core = {
    builder: '@storybook/builder-vite'
};

export async function viteFinal(config) {
    const { mergeConfig } = await import('vite');

    config.build.minify = 'terser';
    config.build.terserOptions = {
        keep_classnames: true,
        keep_fnames: true
    };

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
            find: '@ni/nimble-react/dist/esm',
            replacement: '@ni/nimble-react/src'
        },
        {
            find: '@ni/spright-react/dist/esm',
            replacement: '@ni/spright-react/src'
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
