module.exports = {
    overrides: [
      {
        files: [
          'environment.*.ts'
        ],
        rules: {
            // The environment.*.ts files are used in fileReplacements and are not part of the normal tsconfig.
            // Because they do not participate in tsconfig they don't get the strictNullChecks compiler setting
            // so we disable rules requiring stictNullChecks for these files.
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off'
        }
      }
    ]
  };
