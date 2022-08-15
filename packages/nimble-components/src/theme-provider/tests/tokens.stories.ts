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

type TokenName = keyof typeof tokenNames;
const tokenNameKeys = Object.keys(tokenNames) as TokenName[];
tokenNameKeys.sort((a, b) => a.localeCompare(b));

const overviewText = 'Design Tokens to use in applications. See the <a href="https://github.com/ni/nimble/tree/main/packages/nimble-components">nimble-components</a> readme for more information.';

interface TokenArgs {
    propertyFormat: PropertyFormat;
}

const metadata: Meta = {
    title: 'Tokens/Theme Aware Tokens',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    }
};

export default metadata;

const cssValueFromTokenName = (tokenName: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(
        cssPropertyFromTokenName(tokenName)
    );
};

const colorTemplate = html<TokenName>`
    <div
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        background-color: var(${x => cssPropertyFromTokenName(tokenNames[x])});
    "
        title="${x => cssValueFromTokenName(tokenNames[x])}"
    ></div>
`;

const rgbColorTemplate = html<TokenName>`
    <div
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        background-color: rgba(var(${x => cssPropertyFromTokenName(tokenNames[x])}), 1.0);
    "
    ></div>
`;

const stringValueTemplate = html<TokenName>`
    <div style="display: inline-block;">
        ${x => cssValueFromTokenName(tokenNames[x])}
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
