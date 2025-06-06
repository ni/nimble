import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { PropertyFormat } from '@ni/nimble-components/dist/esm/theme-provider/tests/types';
import {
    tokenNames as tokens,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName,
    type TokenSuffix,
    suffixFromTokenName
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { comments } from '@ni/nimble-components/dist/esm/theme-provider/design-token-comments';

import {
    bodyFont,
    bodyFontColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

type TokenName = keyof typeof tokens;
const tokenNames = Object.keys(tokens) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));
const graphTokenNames = tokenNames.filter(x => x.startsWith('graph'));
const calendarTokenNames = tokenNames.filter(x => x.startsWith('calendar'));

interface TokenArgs {
    metaTitle: string;
    tokenNames: TokenName[];
    propertyFormat: PropertyFormat;
}

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
        propertyFormat: PropertyFormat.scss
    },
    argTypes: {
        propertyFormat: {
            options: Object.values(PropertyFormat),
            control: { type: 'radio' },
            name: 'Property Format'
        },
        tokenNames: {
            table: { disable: true }
        }
    },
    render: createUserSelectedThemeStory(html`
        <style>
            table {
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
            }
            thead {
                font: var(${groupHeaderFont.cssCustomProperty});
                color: var(${groupHeaderFontColor.cssCustomProperty});
                text-transform: var(${groupHeaderTextTransform.cssCustomProperty});
            }
            td { 
                padding: 10px;
                height: 32px;
            }
        </style>
        <table>
            <thead>
                <tr>
                    <th>${x => x.propertyFormat} Property</th>
                    <th>Preview</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
            ${repeat(x => x.tokenNames, html<TokenName, TokenArgs>`
                <tr>
                    <td>
                        ${when((_, c) => (c.parent as TokenArgs).propertyFormat === PropertyFormat.css, html<TokenName>`
                            ${x => cssPropertyFromTokenName(tokens[x])}
                        `)}
                        ${when((_, c) => (c.parent as TokenArgs).propertyFormat === PropertyFormat.scss, html<TokenName>`
                            ${x => scssPropertyFromTokenName(tokens[x])}
                        `)}
                    </td>
                    <td>${x => templateForTokenName(x)}</td>
                    <td>${x => comments[x]}</td>
                </tr>
            `)}
            </tbody>
        </table>
    `),
    // Setting token default values is done as part of the FAST render queue so it needs to be cleared before reading them
    // https://github.com/microsoft/fast/blob/bbf4e532cf9263727ef1bd8afbc30d79d1104c03/packages/web-components/fast-foundation/src/design-token/custom-property-manager.ts#LL154C3-L154C3
    // This uses Storybook's "loaders" feature to await the queue. https://storybook.js.org/docs/html/writing-stories/loaders
    loaders: [
        async (): Promise<void> => {
            await waitForUpdatesAsync();
        }
    ]
};

export default metadata;

export const themeAwareTokens: StoryObj<TokenArgs> = {
    args: { tokenNames }
};

export const graphTokens: StoryObj<TokenArgs> = {
    args: { tokenNames: graphTokenNames }
};

export const calendarTokens: StoryObj<TokenArgs> = {
    args: { tokenNames: calendarTokenNames }
};
