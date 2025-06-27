import { dirname, join } from 'path';
import remarkGfm from 'remark-gfm';
import tsconfigPaths from 'vite-tsconfig-paths';

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

    config.plugins.push(tsconfigPaths());

    return mergeConfig(config);
}

export const staticDirs = ['public'];
export const framework = {
    name: getAbsolutePath('@storybook/html-vite')
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
