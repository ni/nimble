import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import { PropertyFormat } from './types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    tokenNames,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName,
    tokenSuffixes
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
    title: 'Tokens/Property Names',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    }
};

export default metadata;

const defaultTemplate = html<TokenName>`-`;
const colorTemplate = html<TokenName>`
    <div
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        background-color: var(${x => cssPropertyFromTokenName(tokenNames[x])});
    "
    ></div>
`;

/* eslint-disable @typescript-eslint/naming-convention */
type TokenSuffixes = typeof tokenSuffixes[number];
const tokenTemplates: {
    readonly [key in TokenSuffixes]: ViewTemplate<TokenName>;
} = {
    Color: colorTemplate,
    RgbPartialColor: defaultTemplate,
    FontColor: defaultTemplate,
    FontLineHeight: defaultTemplate,
    FontWeight: defaultTemplate,
    FontSize: defaultTemplate,
    TextTransform: defaultTemplate,
    FontFamily: defaultTemplate,
    Font: defaultTemplate,
    Size: defaultTemplate,
    Width: defaultTemplate,
    Height: defaultTemplate,
    Delay: defaultTemplate,
    Padding: defaultTemplate
};
/* eslint-enable @typescript-eslint/naming-convention */

const templateForTokenName = (
    tokenName: TokenName
): ViewTemplate<TokenName> => {
    const suffixIndex = tokenSuffixes.findIndex(tokenSuffix => tokenName.endsWith(tokenSuffix));
    const suffix = tokenSuffixes[suffixIndex];
    if (suffix === undefined) {
        throw new Error(
            `Cannot identify suffix for token: ${tokenName}, allowed suffixes: ${tokenSuffixes.join(
                ', '
            )}`
        );
    }
    const template = tokenTemplates[suffix];
    return template;
};

// prettier-ignore
export const propertyNames: StoryObj<TokenArgs> = {
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
            td { padding: 10px;}
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
