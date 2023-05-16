const fs = require('fs');

const resolvedPlaywrightPackageJsonPath = require.resolve('playwright/package.json');
const playwrightVersion = require(resolvedPlaywrightPackageJsonPath).version;

const templateContents = fs.readFileSync('Playwright.PackageVersion.template', 'utf8');
const propsFileContent = templateContents.replace(/PLAYWRIGHT_VERSION_PLACEHOLDER/g, playwrightVersion);

fs.writeFileSync('Playwright.PackageVersion.props', propsFileContent, 'utf8');
