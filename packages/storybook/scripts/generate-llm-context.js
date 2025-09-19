#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */

/**
 * LLM Context Generator for Nimble Design System
 *
 * This script extracts component API information from Storybook stories,
 * MDX files, and framework examples to create comprehensive documentation
 * optimized for LLM consumption.
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const glob = require('glob');

class StoryFileParser {
    constructor(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        this.sourceFile = ts.createSourceFile(
            filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );
    }

    /**
     * Extract component API information from a story file
     * @returns {Object} Partial component API information
     */
    extractComponentAPI() {
        const api = {
            attributes: [],
            slots: [],
            events: [],
            methods: [],
            examples: {}
        };

        // Extract component name and tag from imports
        this.extractComponentMetadata(api);

        // Extract API information from argTypes
        this.extractArgTypes(api);

        // Extract examples from render template
        this.extractRenderTemplate(api);

        return api;
    }

    extractComponentMetadata(api) {
        ts.forEachChild(this.sourceFile, node => {
            if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                const moduleSpec = node.moduleSpecifier.text;
                console.log(`  🔍 Import: ${moduleSpec}`);

                // Extract component tag imports (look for *Tag imports)
                if (node.importClause && node.importClause.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
                    for (const element of node.importClause.namedBindings.elements) {
                        if (ts.isImportSpecifier(element) && element.name.text.endsWith('Tag')) {
                            const tagName = element.name.text;
                            api.name = this.tagNameToComponentName(tagName);
                            api.tagName = tagName.replace('Tag', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
                            console.log(`  ✅ Found component: ${api.name} (tag: ${api.tagName})`);
                        }
                    }
                }

                // Determine library from import path
                if (moduleSpec.includes('@ni/nimble-components')) {
                    api.library = 'nimble';
                    api.package = '@ni/nimble-components';
                } else if (moduleSpec.includes('@ni/spright-components')) {
                    api.library = 'spright';
                    api.package = '@ni/spright-components';
                } else if (moduleSpec.includes('@ni/ok-components')) {
                    api.library = 'ok';
                    api.package = '@ni/ok-components';
                }
            }
        });
    }

    extractArgTypes(api) {
        ts.forEachChild(this.sourceFile, node => {
            if (ts.isVariableStatement(node)) {
                for (const declaration of node.declarationList.declarations) {
                    if (ts.isVariableDeclaration(declaration)
                        && declaration.name && ts.isIdentifier(declaration.name)
                        && declaration.name.text === 'metadata'
                        && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
                        this.parseMetadataObject(declaration.initializer, api);
                    }
                }
            }
        });
    }

    parseMetadataObject(obj, api) {
        for (const property of obj.properties) {
            if (ts.isPropertyAssignment(property)
                && ts.isIdentifier(property.name)
                && property.name.text === 'argTypes'
                && ts.isObjectLiteralExpression(property.initializer)) {
                this.parseArgTypesObject(property.initializer, api);
            }
        }
    }

    parseArgTypesObject(argTypesObj, api) {
        for (const property of argTypesObj.properties) {
            if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
                const argName = property.name.text;
                const argConfig = this.parseArgTypeConfig(property.initializer);

                if (argConfig) {
                    const attributeInfo = {
                        name: argConfig.name || argName,
                        type: this.inferType(argConfig),
                        description: argConfig.description || '',
                        defaultValue: argConfig.defaultValue,
                        options: argConfig.options,
                        required: false,
                        category: argConfig.category || 'attributes'
                    };

                    // Categorize into appropriate array
                    switch (attributeInfo.category) {
                    case 'attributes':
                    case 'nonAttributeProperties':
                        api.attributes.push(attributeInfo);
                        break;
                    case 'slots':
                        api.slots.push({
                            name: attributeInfo.name,
                            description: attributeInfo.description
                        });
                        break;
                    case 'events':
                        api.events.push({
                            name: attributeInfo.name,
                            type: attributeInfo.type,
                            description: attributeInfo.description
                        });
                        break;
                    case 'methods':
                        api.methods.push({
                            name: attributeInfo.name,
                            signature: attributeInfo.type,
                            description: attributeInfo.description
                        });
                        break;
                    }
                }
            }
        }
    }

    parseArgTypeConfig(initializer) {
        if (!ts.isObjectLiteralExpression(initializer)) {
            return null;
        }

        const config = {};

        for (const property of initializer.properties) {
            if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
                const key = property.name.text;
                const value = this.extractLiteralValue(property.initializer);

                if (key === 'table' && ts.isObjectLiteralExpression(property.initializer)) {
                    // Extract category from table.category
                    for (const tableProp of property.initializer.properties) {
                        if (ts.isPropertyAssignment(tableProp)
                            && ts.isIdentifier(tableProp.name)
                            && tableProp.name.text === 'category') {
                            config.category = this.extractLiteralValue(tableProp.initializer);
                        }
                    }
                } else if (key === 'options' && ts.isArrayLiteralExpression(property.initializer)) {
                    config.options = property.initializer.elements.map(el => this.extractLiteralValue(el));
                } else {
                    config[key] = value;
                }
            }
        }

        return config;
    }

    extractLiteralValue(node) {
        if (ts.isStringLiteral(node)) {
            return node.text;
        }
        if (ts.isNumericLiteral(node)) {
            return Number(node.text);
        }
        if (node.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        }
        if (node.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        }
        if (ts.isPropertyAccessExpression(node)) {
            // Handle apiCategory.attributes etc.
            return node.name.text;
        }
        return undefined;
    }

    extractRenderTemplate(api) {
        // TODO: Extract template information for usage examples
        // This would parse the render template to extract actual usage patterns
    }

    inferType(config) {
        if (config.options) {
            return config.options.join(' | ');
        }
        if (config.control && config.control.type === 'boolean') {
            return 'boolean';
        }
        if (config.control && config.control.type === 'number') {
            return 'number';
        }
        return 'string';
    }

    tagNameToComponentName(tag) {
        // Convert "buttonTag" to "button"
        return tag.replace(/Tag$/, '');
    }
}

class LLMContextGenerator {
    constructor() {
        this.storyFilesPattern = 'packages/storybook/src/{nimble,spright,ok}/**/*.stories.ts';
        this.outputPath = 'packages/storybook/dist/llm-api-reference.md';
    }

    generateContext() {
        console.log('🚀 Starting LLM context generation...');

        // Discover story files
        const storyFiles = glob.sync(this.storyFilesPattern, {
            cwd: path.resolve(__dirname, '../../..')
        });

        console.log(`📁 Found ${storyFiles.length} story files`);

        // Extract API information from all story files (removed limit for full scan)
        const componentAPIs = new Map(); // Use Map to deduplicate by component name

        for (const storyFile of storyFiles) {
            try {
                console.log(`📖 Processing: ${storyFile}`);
                const fullPath = path.resolve(__dirname, '../../..', storyFile);
                const parser = new StoryFileParser(fullPath);
                const api = parser.extractComponentAPI();

                if (api.name) {
                    const existing = componentAPIs.get(api.name);

                    // Prefer this API if it has more information (more attributes/slots/events)
                    if (!existing || (api.attributes.length + api.slots.length + api.events.length)
                                      > (existing.attributes.length + existing.slots.length + existing.events.length)) {
                        componentAPIs.set(api.name, api);
                        console.log(`✅ Extracted API for: ${api.name} (${api.attributes.length} attributes, ${api.slots.length} slots)`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error processing ${storyFile}:`, error);
            }
        }

        // Generate markdown documentation
        const componentsArray = Array.from(componentAPIs.values());
        console.log('📊 Component summary:');
        componentsArray.forEach(api => {
            console.log(`  - ${api.name}: ${api.attributes.length} attrs, ${api.slots.length} slots`);
            api.attributes.forEach(attr => console.log(`    * ${attr.name} (${attr.category}): ${attr.type}`));
            api.slots.forEach(slot => console.log(`    * slot: ${slot.name}`));
        });

        const markdown = this.generateMarkdown(componentsArray);

        // Ensure output directory exists
        const outputDir = path.dirname(path.resolve(__dirname, '../../..', this.outputPath));
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write output file
        fs.writeFileSync(path.resolve(__dirname, '../../..', this.outputPath), markdown);
        console.log(`📝 Generated LLM context: ${this.outputPath}`);

        // Also create a simple Storybook page for viewing
        this.createStorybookPage(markdown);
    }

    generateMarkdown(apis) {
        const timestamp = new Date().toISOString();

        let markdown = `# Nimble Design System API Reference

This document contains comprehensive API documentation for Nimble Design System components, generated from Storybook stories and optimized for LLM consumption.

**Generated:** ${timestamp}
**Components:** ${apis.length}

## Component Index

${apis.map(api => `- ${api.name} (${api.library}): ${api.tagName || `nimble-${api.name}`}`).join('\n')}

## Component Specifications

`;

        for (const api of apis) {
            markdown += this.generateComponentSection(api);
        }

        return markdown;
    }

    generateComponentSection(api) {
        return `
### ${api.name}

**Component Library**: ${api.library} (${api.library === 'nimble' ? 'Core Design System' : api.library.toUpperCase()})
**Package**: ${api.package}
**Custom Element Tag**: ${api.tagName || `nimble-${api.name}`}

**API Surface**:

Attributes:
${api.attributes.filter(attr => attr.category === 'attributes').map(attr => `- ${attr.name}: ${attr.type}${attr.defaultValue ? ` = ${JSON.stringify(attr.defaultValue)}` : ''}
  - ${attr.description}${attr.options ? `
  - Options: ${attr.options.join(', ')}` : ''}`).join('\n')}

${api.slots.length > 0 ? `Slots:
${api.slots.map(slot => `- ${slot.name}: ${slot.description}`).join('\n')}` : ''}

${api.events.length > 0 ? `Events:
${api.events.map(event => `- ${event.name}: ${event.type} - ${event.description}`).join('\n')}` : ''}

${api.methods.length > 0 ? `Methods:
${api.methods.map(method => `- ${method.name}${method.signature ? `(${method.signature})` : '()'} - ${method.description}`).join('\n')}` : ''}

---

`;
    }

    createStorybookPage(markdown) {
        const storyContent = `
export default {
    title: 'LLM API Reference',
    parameters: {
        docs: { page: null },
        previewTabs: { 
            canvas: { hidden: true },
            'storybook/docs/panel': { hidden: true }
        }
    }
};

export const ApiReference = {
    render: () => {
        const container = document.createElement('div');
        container.style.cssText = 'font-family: monospace; white-space: pre-wrap; padding: 20px; max-width: none; overflow-x: auto;';
        container.textContent = \`${markdown.replace(/`/g, '\\`')}\`;
        return container;
    }
};
`;

        const storyPath = path.resolve(__dirname, '../src/docs/llm-api-reference.stories.ts');
        const storyDir = path.dirname(storyPath);

        if (!fs.existsSync(storyDir)) {
            fs.mkdirSync(storyDir, { recursive: true });
        }

        fs.writeFileSync(storyPath, storyContent);
        console.log('📄 Created Storybook page: src/docs/llm-api-reference.stories.ts');
    }
}

// Main execution
if (require.main === module) {
    const generator = new LLMContextGenerator();
    generator.generateContext().catch(console.error);
}

module.exports = { LLMContextGenerator, StoryFileParser };