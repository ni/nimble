import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat, when } from '@microsoft/fast-element';
import { PropertyFormat } from './types';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    tokenNames,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName
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
                    <td>${x => comments[x]}</td>
                </tr>
            `)}
            </tbody>
        </table>
    `)
};
