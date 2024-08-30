import type { Meta, StoryObj } from '@storybook/html';
import { customElement, html, ref, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import { waitForUpdatesAsync } from '../../../../nimble-components/src/testing/async-helpers';
import { PropertyFormat } from '../../../../nimble-components/src/theme-provider/tests/types';
import {
    tokenNames as tokens,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName,
    TokenSuffix,
    suffixFromTokenName
} from '../../../../nimble-components/src/theme-provider/design-token-names';
import { comments } from '../../../../nimble-components/src/theme-provider/design-token-comments';

import {
    bodyFont,
    bodyFontColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform,
    tableFitRowsHeight
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../utilities/storybook';
import { Table, tableTag } from '../../../../nimble-components/src/table';
import { TableCellView } from '../../../../nimble-components/src/table-column/base/cell-view';
import { TableGroupHeaderView } from '../../../../nimble-components/src/table-column/base/group-header-view';
import { TableColumn } from '../../../../nimble-components/src/table-column/base';
import type { ColumnInternalsOptions } from '../../../../nimble-components/src/table-column/base/models/column-internals';
import { ColumnValidator } from '../../../../nimble-components/src/table-column/base/models/column-validator';
import { mappingIconTag } from '../../../../nimble-components/src/mapping/icon';
import { tableColumnTextTag } from '../../../../nimble-components/src/table-column/text';
import { IconSeverity } from '../../../../nimble-components/src/icon-base/types';
import { iconMetadata } from '../../../../nimble-components/src/icon-base/tests/icon-metadata';
import { tableColumnDesignTokenTag } from './table-column-design-token';

type TokenName = keyof typeof tokens;
const tokenNames = Object.keys(tokens) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));
const graphTokenNames = tokenNames.filter(x => x.startsWith('graph'));
const calendarTokenNames = tokenNames.filter(x => x.startsWith('calendar'));


const computedCSSValueFromTokenName = (tokenName: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(
        cssPropertyFromTokenName(tokenName)
    );
};

const colorTemplate = html<TokenName>`
    <div
        title="${x => computedCSSValueFromTokenName(tokens[x])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: var(${x => cssPropertyFromTokenName(tokens[x])});
    "
    ></div>
`;

const rgbColorTemplate = html<TokenName>`
    <div
        title="${x => computedCSSValueFromTokenName(tokens[x])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: rgba(var(${x => cssPropertyFromTokenName(tokens[x])}), 1.0);
    "
    ></div>
`;

const stringValueTemplate = html<TokenName>`
    <div style="display: inline-block;">
        ${x => computedCSSValueFromTokenName(tokens[x])}
    </div>
`;

const fontTemplate = html<TokenName>`
    <div
        style="
        display: inline-block;
        font: var(${x => cssPropertyFromTokenName(tokens[x])});
    "
    >
        Nimble
    </div>
`;

/* eslint-disable @typescript-eslint/naming-convention */
const tokenTemplates: {
    readonly [key in TokenSuffix]: ViewTemplate<TokenName>;
} = {
    Color: colorTemplate,
    RgbPartialColor: rgbColorTemplate,
    DisabledFontColor: colorTemplate,
    FontColor: colorTemplate,
    FontLineHeight: stringValueTemplate,
    FontWeight: stringValueTemplate,
    FontSize: stringValueTemplate,
    TextTransform: stringValueTemplate,
    FontFamily: stringValueTemplate,
    BoxShadow: stringValueTemplate,
    MaxHeight: stringValueTemplate,
    MinWidth: stringValueTemplate,
    Font: fontTemplate,
    Size: stringValueTemplate,
    Width: stringValueTemplate,
    Height: stringValueTemplate,
    Delay: stringValueTemplate,
    Padding: stringValueTemplate
};
/* eslint-enable @typescript-eslint/naming-convention */

const templateForTokenName = (
    tokenName: TokenName
): ViewTemplate<TokenName> => {
    const suffix = suffixFromTokenName(tokenName);
    if (suffix === undefined) {
        throw new Error(`Cannot identify suffix for token: ${tokenName}`);
    }
    const template = tokenTemplates[suffix];
    return template;
};

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
