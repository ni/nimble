import type { Meta, StoryObj } from '@storybook/html';
import { html, ref } from '@microsoft/fast-element';
import { PropertyFormat } from '../../../../nimble-components/src/theme-provider/tests/types';
import {
    tokenNames as tokens,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName
} from '../../../../nimble-components/src/theme-provider/design-token-names';
import { comments } from '../../../../nimble-components/src/theme-provider/design-token-comments';

import {
    tableFitRowsHeight
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { Table, tableTag } from '../../../../nimble-components/src/table';
import { tableColumnTextTag } from '../../../../nimble-components/src/table-column/text';
import { tableColumnDesignTokenTag } from './table-column-design-token';

type TokenName = keyof typeof tokens;
const tokenNames = Object.keys(tokens) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));

const tokenData = tokenNames.map(tokenName => ({
    id: tokenName,
    name: tokenName,
    description: comments[tokenName],
    cssProperty: cssPropertyFromTokenName(tokens[tokenName]),
    scssProperty: scssPropertyFromTokenName(tokens[tokenName]),
}));

const graphTokenData = tokenData.filter(x => x.name.startsWith('graph'));
const calendarTokenData = tokenData.filter(x => x.name.startsWith('calendar'));

type TokenData = typeof tokenData[number];

interface TokenArgs {
    metaTitle: string;
    tokenData: TokenData[];
    propertyFormat: PropertyFormat;
    tableRef: Table<TokenData>;
}

const updateData = (tableRef: Table<TokenData>, data: TokenData[]): void => {
    void (async () => {
        // Safari workaround: the table element instance is made at this point
        // but doesn't seem to be upgraded to a custom element yet
        await customElements.whenDefined('nimble-table');
        await tableRef.setData(data);
    })();
};

// prettier-ignore
const metadata: Meta<TokenArgs> = {
    title: 'Tokens/Theme-aware Tokens',
    parameters: {
        docs: {
            source: {
                code: null
            }
        },
        controls: { hideNoControlsWarning: true }
    },
    args: {
        propertyFormat: PropertyFormat.scss,
        tableRef: undefined
    },
    argTypes: {
        propertyFormat: {
            options: Object.values(PropertyFormat),
            control: { type: 'radio' },
            name: 'Property Format'
        },
        tokenData: {
            table: { disable: true }
        },
        tableRef: {
            table: {
                disable: true
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <style class="code-hide">
            ${tableTag} {
                height: var(${tableFitRowsHeight.cssCustomProperty});
                max-height: none;
            }
        </style>
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => updateData(x.tableRef, x.tokenData)}"
        >
            <${tableColumnTextTag} field-name="${x => (x.propertyFormat === PropertyFormat.css ? 'cssProperty' : 'scssProperty')}">
                ${x => (x.propertyFormat === PropertyFormat.css ? 'CSS Property' : 'SCSS Property')}
            </${tableColumnTextTag}>
            <${tableColumnDesignTokenTag} field-name="name">
                Preview
            </${tableColumnDesignTokenTag}>
            <${tableColumnTextTag} sorting-disabled field-name="description">
                Description
            </${tableColumnTextTag}>
        </${tableTag}>
    `)
};

export default metadata;

export const themeAwareTokens: StoryObj<TokenArgs> = {
    args: { tokenData }
};

export const graphTokens: StoryObj<TokenArgs> = {
    args: { tokenData: graphTokenData }
};

export const calendarTokens: StoryObj<TokenArgs> = {
    args: { tokenData: calendarTokenData }
};
