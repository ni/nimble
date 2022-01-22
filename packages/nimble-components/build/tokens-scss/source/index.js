import * as tokenNames from '../../../dist/esm/theme-provider/design-token-names';
import { cssPropertyFromTokenName, scssInternalPropertyFromTokenName, scssPropertyFromTokenName } from '../../../dist/esm/theme-provider/design-token-helpers';
import { comments } from '../../../dist/esm/theme-provider/design-token-comments';

const fs = require('fs');
const path = require('path');

const tokensFilePath = path.resolve(__dirname, '../../../dist/tokens.scss');

const tokensFileHeader = `
// Nimble Tokens SCSS
// Used to integrate theme aware design tokens in an application.
// Requires using a <nimble-theme-provider> in the page.
// For more information see https://github.com/ni/nimble/tree/main/packages/nimble-components#theming

@import './tokens-internal.scss';
`;

const tokensFileContents = Object.entries(tokenNames)
    .map(([exportName, tokenName]) => `
${comments[exportName] === '' ? '' : `/// ${comments[exportName]}`}
${scssPropertyFromTokenName(tokenName)}: var(${scssInternalPropertyFromTokenName(tokenName)});
`);

const tokensFile = [tokensFileHeader, ...tokensFileContents].join('');

const tokensInternalFilePath = path.resolve(__dirname, '../../../dist/tokens-internal.scss');

const tokensInternalFileHeader = `
// Nimble Internal Tokens SCSS
// Used by Nimble Tokens SCSS
// For more information see https://github.com/ni/nimble/tree/main/packages/nimble-components#theming
`;

const tokensInternalFileContents = Object.entries(tokenNames)
    .map(([_, tokenName]) => `
/// Internal property for ${scssPropertyFromTokenName(tokenName)}.
/// Not intended for general use. Used to override a token value (potentially making in no longer theme-aware).
/// Requires SCSS interpolation to set, ie \`#{${scssInternalPropertyFromTokenName(tokenName)}}: <new value>;\`.
${scssInternalPropertyFromTokenName(tokenName)}: ${cssPropertyFromTokenName(tokenName)};
`);

const tokensInternalFile = [tokensInternalFileHeader, ...tokensInternalFileContents].join('');

console.log(`tokens path to write to: ${tokensFilePath}`);
console.log(`tokens internal path to write to: ${tokensInternalFilePath}`);

console.log('Writing tokens file');
fs.writeFileSync(tokensFilePath, tokensFile, { encoding: 'utf-8' });
console.log('Done writing tokens file');

console.log('Writing tokens internal file');
fs.writeFileSync(tokensInternalFilePath, tokensInternalFile, { encoding: 'utf-8' });
console.log('Done writing tokens internal file');
