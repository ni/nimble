/**
 * Shared utility functions for working with multi-color icons.
 *
 * This is the canonical CommonJS implementation used by all icon generation scripts
 * across nimble-components, angular-workspace, and react-workspace.
 *
 * Note: There is also a TypeScript version of getMultiColorIconNames() exported from
 * icon-metadata.ts for use in TypeScript code. Keep both implementations in sync.
 */

const fs = require('fs');
const path = require('path');

/**
 * Gets list of multi-color icon names from icon-metadata.ts
 * Uses regex to parse the TypeScript file since we can't directly import it in Node.js
 * @returns {string[]} Array of icon names in spinal-case (e.g., ['circle-partial-broken'])
 */
function getMultiColorIconNames() {
    const metadataPath = path.resolve(
        __dirname,
        '../../src/icon-base/tests/icon-metadata.ts'
    );

    if (!fs.existsSync(metadataPath)) {
        console.warn('Warning: icon-metadata.ts not found');
        return [];
    }

    const content = fs.readFileSync(metadataPath, 'utf-8');

    // Match pattern: IconName: { tags: [...], multiColor: true }
    const multiColorPattern = /Icon([A-Z][a-zA-Z0-9]*):\s*\{[^}]*multiColor:\s*true[^}]*\}/g;
    const matches = content.matchAll(multiColorPattern);

    const multiColorIcons = [];
    for (const match of matches) {
        const pascalCaseName = match[1]; // e.g., "CirclePartialBroken"
        const spinalCaseName = pascalCaseName.replace(
            /[A-Z]/g,
            (letter, offset) => (offset > 0 ? `-${letter.toLowerCase()}` : letter.toLowerCase())
        );
        multiColorIcons.push(spinalCaseName);
    }

    return multiColorIcons;
}

module.exports = {
    getMultiColorIconNames
};
