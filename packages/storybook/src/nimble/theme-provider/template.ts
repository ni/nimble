import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import {
    tokenNames as tokens,
    cssPropertyFromTokenName,
    scssPropertyFromTokenName,
    type TokenSuffix,
    suffixFromTokenName
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { PropertyFormat } from '@ni/nimble-components/dist/esm/theme-provider/tests/types';
import {
    bodyFont,
    bodyFontColor,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { comments } from '@ni/nimble-components/dist/esm/theme-provider/design-token-comments';

export interface TokenArgs {
    tokenNames: TokenName[];
    propertyFormat: PropertyFormat;
}

type TokenName = keyof typeof tokens;

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

const imageTemplate = html<TokenName>`
    <div
        title="${x => computedCSSValueFromTokenName(tokens[x])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-image: var(${x => cssPropertyFromTokenName(tokens[x])});
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
    Image: imageTemplate,
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
export const component = html<TokenArgs>`
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
`;
