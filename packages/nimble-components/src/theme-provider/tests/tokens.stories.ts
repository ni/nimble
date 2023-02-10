import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import { PropertyFormat } from './types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    tokenNames,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName,
    TokenSuffix,
    suffixFromTokenName
} from '../design-token-names';
import { comments } from '../design-token-comments';
import '../../all-components';

import {
    bodyFont,
    bodyFontColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '../design-tokens';
import { processUpdates } from '../../testing/async-helpers';

// Setting token default values is done as part of the FAST render queue so it needs to be flushed before reading them
// https://github.com/microsoft/fast/blob/bbf4e532cf9263727ef1bd8afbc30d79d1104c03/packages/web-components/fast-foundation/src/design-token/custom-property-manager.ts#LL154C3-L154C3
processUpdates();

type TokenName = keyof typeof tokenNames;
const tokenNameKeys = Object.keys(tokenNames) as TokenName[];
tokenNameKeys.sort((a, b) => a.localeCompare(b));

const overviewText = 'Design Tokens to use in applications. See the <a href="https://github.com/ni/nimble/tree/main/packages/nimble-components">nimble-components</a> readme for more information.';

interface TokenArgs {
    propertyFormat: PropertyFormat;
}

const metadata: Meta = {
    title: 'Tokens/Theme-aware Tokens',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    }
};

export default metadata;

const computedCSSValueFromTokenName = (tokenName: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(
        cssPropertyFromTokenName(tokenName)
    );
};

const colorTemplate = html<TokenName>`
    <div
        title="${x => computedCSSValueFromTokenName(tokenNames[x])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: var(${x => cssPropertyFromTokenName(tokenNames[x])});
    "
    ></div>
`;

const rgbColorTemplate = html<TokenName>`
    <div
        title="${x => computedCSSValueFromTokenName(tokenNames[x])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: rgba(var(${x => cssPropertyFromTokenName(tokenNames[x])}), 1.0);
    "
    ></div>
`;

const stringValueTemplate = html<TokenName>`
    <div style="display: inline-block;">
        ${x => computedCSSValueFromTokenName(tokenNames[x])}
    </div>
`;

const fontTemplate = html<TokenName>`
    <div
        style="
        display: inline-block;
        font: var(${x => cssPropertyFromTokenName(tokenNames[x])});
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
    FontColor: colorTemplate,
    FontLineHeight: stringValueTemplate,
    FontWeight: stringValueTemplate,
    FontSize: stringValueTemplate,
    TextTransform: stringValueTemplate,
    FontFamily: stringValueTemplate,
    BoxShadow: stringValueTemplate,
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
export const themeAwareTokens: StoryObj<TokenArgs> = {
    parameters: {
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
        }
    },
    render: createUserSelectedThemeStory(html<TokenArgs>`
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
            ${repeat(() => tokenNameKeys, html<TokenName, TokenArgs>`
                <tr>
                    <td>
                        ${when((_, c) => (c.parent as TokenArgs).propertyFormat === PropertyFormat.css, html<TokenName>`
                            ${x => cssPropertyFromTokenName(tokenNames[x])}
                        `)}
                        ${when((_, c) => (c.parent as TokenArgs).propertyFormat === PropertyFormat.scss, html<TokenName>`
                            ${x => scssPropertyFromTokenName(tokenNames[x])}
                        `)}
                    </td>
                    <td>${x => templateForTokenName(x)}</td>
                    <td>${x => comments[x]}</td>
                </tr>
            `)}
            </tbody>
        </table>
    `)
};

themeAwareTokens.storyName = 'Theme-aware Tokens';
