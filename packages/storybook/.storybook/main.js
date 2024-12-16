import remarkGfm from 'remark-gfm';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// All files participating in storybook should be in src
// so that TypeScript and linters can track them correctly
export const stories = [
    '../src/docs',
    '../src/nimble',
    '../src/spright'
];
export const addons = [
    {
        name: '@storybook/addon-essentials',
        options: {
            outline: false,
            docs: false
        }
    }, {
        name: '@storybook/addon-docs',
        options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }
        }
    },
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
    '@storybook/addon-webpack5-compiler-swc',
    'storybook-addon-pseudo-states'
];

export function webpackFinal(config) {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('ts-loader')
            }
        ]
    });
    config.plugins.push(
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: process.env.NODE_ENV === 'production'
        })
    );
    config.performance = {
        hints: false
    };
    config.optimization.minimizer = [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        })
    ];
    return config;
}
export const staticDirs = ['public'];
export const framework = {
    name: '@storybook/html-webpack5'
};
