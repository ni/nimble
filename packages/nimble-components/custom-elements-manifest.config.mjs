// For options, see: https://custom-elements-manifest.open-wc.org/analyzer/config/

// eslint-disable-next-line import/no-default-export
export default {
    globs: [
        'src/**/*.ts'
    ],
    exclude: [
        '**/icons/**',
        '**/models/**',
        '**/tests/**',
        '**/testing/**',
        '**/utilities/**',
        '**/*.spec.ts',
        '**/design-token*.ts',
        '**/*styles.ts',
        '**/*template.ts',
    ],
    outdir: 'dist',
    packagejson: false,
    fast: true,
};
