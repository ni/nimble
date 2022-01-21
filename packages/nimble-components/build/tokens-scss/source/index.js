import * as tokenNames from '../../../dist/esm/theme-provider/design-token-names';
import { cssPropertyFromTokenName, scssInternalPropertyFromTokenName, scssPropertyFromTokenName } from '../../../dist/esm/theme-provider/design-token-helpers';
import { comments } from '../../../dist/esm/theme-provider/design-token-comments';

const fs = require('fs');
const path = require('path');

const tokensPath = path.resolve(__dirname, '../../../dist/tokens.scss');

const fileHeader = `
// Nimble Tokens SCSS
// Used to integrate theme aware design tokens in an application.
// Requires using a <nimble-theme-provider> in the page.
// For more information see https://github.com/ni/nimble/tree/main/packages/nimble-components#theming
`;

const fileTokenContents = Object.entries(tokenNames)
    .map(([exportName, tokenName]) => `
${comments[exportName] === '' ? '' : `/// ${comments[exportName]}`}
${scssPropertyFromTokenName(tokenName)}: var(${scssInternalPropertyFromTokenName(tokenName)});
`);

const fileInternalTokenContents = Object.entries(tokenNames)
    .map(([_, tokenName]) => `
/// Internal property for ${scssPropertyFromTokenName(tokenName)}.
/// Not intended for general use. Used to override a token value (making in no longer theme-aware).
/// Requires SCSS interpolation to set, ie \`#{${scssInternalPropertyFromTokenName(tokenName)}}: <new value>;\`.
${scssInternalPropertyFromTokenName(tokenName)}: ${cssPropertyFromTokenName(tokenName)};
`);

const file = [fileHeader, ...fileTokenContents, ...fileInternalTokenContents].join('');
console.log(`tokens.scss path to write to: ${tokensPath}`);
console.log('Writing tokens file');
fs.writeFileSync(tokensPath, file, { encoding: 'utf-8' });
console.log('Done writing tokens file');
