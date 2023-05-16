const fs = require('fs');
const path = require('path');

const resolvedPlaywrightPackageJsonPath = require.resolve('playwright/package.json');
// eslint-disable-next-line import/no-dynamic-require
const playwrightVersion = require(resolvedPlaywrightPackageJsonPath).version;

const templatePath = path.resolve(__dirname, 'Playwright.PackageVersion.template');
const templateContents = fs.readFileSync(templatePath, 'utf8');
const propsFileContent = templateContents.replace(/PLAYWRIGHT_VERSION_PLACEHOLDER/g, playwrightVersion);

const destAbsoluteDir = path.resolve(__dirname, '../dist/');
if (!fs.existsSync(destAbsoluteDir)) {
    fs.mkdirSync(destAbsoluteDir, { recursive: true });
}
const destPath = path.resolve(destAbsoluteDir, 'Playwright.PackageVersion.props');
fs.writeFileSync(destPath, propsFileContent, 'utf8');
