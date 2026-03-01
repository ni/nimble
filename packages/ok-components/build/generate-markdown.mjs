import fs from 'fs';
import * as path from 'node:path';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

const manifestJSONPath = path.resolve(import.meta.dirname, '../dist/custom-elements.json');
console.log(`Custom elements manifest JSON path "${manifestJSONPath}"`);

const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, 'utf-8'));
const markdown = customElementsManifestToMarkdown(manifest, {
    private: 'hidden',
    omitDeclarations: ['mixins', 'variables', 'functions', 'exports'],
    omitSections: ['mixins', 'main-heading'],
});

const manifestMarkdownPath = path.resolve(import.meta.dirname, '../dist/custom-elements.md');
console.log(`Custom elements manifest Markdown path "${manifestMarkdownPath}"`);
fs.writeFileSync(manifestMarkdownPath, markdown);
