import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import * as tokenNamesNamespace from '../design-token-names';
import { comments } from '../design-token-comments';
import {
    cssPropertyFromTokenName,
    scssPropertyFromTokenName
} from '../design-token-helpers';
import {
    groupLabelFontColor,
    groupLabelFontSize,
    groupLabelFontFamily,
    fontFamily,
    contentFontSize,
    contentFontColor,
    groupLabelFontWeight,
    groupLabelTextTransform
} from '../design-tokens';

type TokenName = keyof typeof tokenNamesNamespace;
const tokenNames: TokenName[] = Object.keys(tokenNamesNamespace) as TokenName[];
tokenNames.sort((a, b) => a.localeCompare(b));

const overviewText = 'Design Tokens to use in applications. See the <a href="https://github.com/ni/nimble/tree/main/packages/nimble-components">nimble-components</a> readme for more information.';

const metadata: Meta = {
    title: 'Tokens/Property Names',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl: ''
        }
    }
};

export default metadata;

// prettier-ignore
export const propertyNames: StoryObj = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    },
    render: createRenderer(html`
        <style>
            table {
                font-family: var(${fontFamily.cssCustomProperty});
                font-size: var(${contentFontSize.cssCustomProperty});
                color: var(${contentFontColor.cssCustomProperty});
            }
            thead {
                font-family: var(${groupLabelFontFamily.cssCustomProperty});
                font-size: var(${groupLabelFontSize.cssCustomProperty});
                font-weight: var(${groupLabelFontWeight.cssCustomProperty});
                color: var(${groupLabelFontColor.cssCustomProperty});
                text-transform: var(${groupLabelTextTransform.cssCustomProperty});
            }
            td { padding: 10px;}
        </style>
        <table>
            <thead>
                <tr>
                    <th>SCSS Property</th>
                    <th>Description</th>
                    <th>CSS Property</th>
                </tr>
            </thead>
            <tbody>
            ${repeat(() => tokenNames, html<TokenName>`
                <tr>
                    <td>${x => scssPropertyFromTokenName(tokenNamesNamespace[x])}</td>
                    <td>${x => comments[x]}</td>
                    <td>${x => cssPropertyFromTokenName(tokenNamesNamespace[x])}</td>
                </tr>
            `)}
            </tbody>
        </table>
    `)
};
