// For options, see: https://custom-elements-manifest.open-wc.org/analyzer/config/

// eslint-disable-next-line import/no-default-export
export default {
    globs: [
        'src/**/*.ts'
    ],
    exclude: [
        '**/icons/**',
        '**/models/**',
        '**/patterns/**',
        '**/tests/**',
        '**/testing/**',
        '**/utilities/**',
        '**/*.spec.ts',
        '**/design-token*.ts',
        '**/*styles.ts',
        '**/*template.ts',
        '**/*types.ts',
    ],
    outdir: 'dist',
    packagejson: false,
    fast: true,
};
