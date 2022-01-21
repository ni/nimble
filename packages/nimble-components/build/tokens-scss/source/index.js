import * as tokenNames from '../../../dist/esm/theme-provider/design-token-names';
import { cssPropertyFromTokenName, scssInternalPropertyFromTokenName, scssPropertyFromTokenName } from '../../../dist/esm/theme-provider/design-token-helpers';

const fs = require('fs');
const path = require('path');

const tokensPath = path.resolve(__dirname, '../../../dist/tokens.scss');

const fileHeader = `
/*
    Nimble Tokens SCSS
    Used to integrate theme aware design tokens in an application.
    Requires using a <nimble-theme-provider> in the page.
    For more information see https://github.com/ni/nimble/tree/main/packages/nimble-components#theming
*/
`;
const fileContents = Object.values(tokenNames)
    .map(tokenName => `
${scssInternalPropertyFromTokenName(tokenName)}: ${cssPropertyFromTokenName(tokenName)};
${scssPropertyFromTokenName(tokenName)}: var(${scssInternalPropertyFromTokenName(tokenName)});
`);

const file = [fileHeader, ...fileContents].join('');
console.log(`tokens.scss path to write to: ${tokensPath}`);
console.log('Writing tokens file');
fs.writeFileSync(tokensPath, file, { encoding: 'utf-8' });
console.log('Done writing tokens file');
