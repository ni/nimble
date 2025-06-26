import type { Meta, StoryObj } from '@storybook/html';
import { html, repeat, when } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { PropertyFormat } from '@ni/nimble-components/dist/esm/theme-provider/tests/types';
import {
    tokenNames,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';

import {
    bodyFont,
    bodyFontColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

const sizeRampTokenNames = (({
    smallPadding,
    mediumPadding,
    standardPadding,
    largePadding
}) => ({ smallPadding, mediumPadding, standardPadding, largePadding }))(
    tokenNames
);

type TokenName = keyof typeof sizeRampTokenNames;
const tokenNameKeys = Object.keys(sizeRampTokenNames) as TokenName[];

interface TokenArgs {
    propertyFormat: PropertyFormat;
}

const metadata: Meta = {
    title: 'Tokens/Size Ramp',
    parameters: {
        docs: {
            source: {
                code: null
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

// prettier-ignore
export const sizeRampTokens: StoryObj<TokenArgs> = {
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
                    <th>Value</th>
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
                    <td>
                        <div style="display: inline-block;">
                            ${x => computedCSSValueFromTokenName(tokenNames[x])}
                        </div>
                    </td>
                </tr>
            `)}
            </tbody>
        </table>
    `)
};

// Setting token default values is done as part of the FAST render queue so it needs to be cleared before reading them
// https://github.com/microsoft/fast/blob/bbf4e532cf9263727ef1bd8afbc30d79d1104c03/packages/web-components/fast-foundation/src/design-token/custom-property-manager.ts#LL154C3-L154C3
// This uses Storybook's "loaders" feature to await the queue. https://storybook.js.org/docs/html/writing-stories/loaders
sizeRampTokens.loaders = [
    async () => {
        await waitForUpdatesAsync();
        return {};
    }
];
