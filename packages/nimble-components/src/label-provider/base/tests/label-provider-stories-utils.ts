import { ViewTemplate, html, repeat } from '@microsoft/fast-element';
import type { Meta } from '@storybook/html';
import type { DesignToken } from '@microsoft/fast-foundation';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import {
    bodyFont,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '../../../theme-provider/design-tokens';
import { getAttributeName, getPropertyName } from './label-name-utils';

export interface LabelProviderArgs {
    labelProviderTag: string;
    labelTokens: [string, DesignToken<string>][];
    removeNamePrefix(tokenName: string): string;
}

const createTemplate = (
    labelProviderTag: string
): ViewTemplate<LabelProviderArgs> => html<LabelProviderArgs>`
<${labelProviderTag}></${labelProviderTag}>
<p>Element name: <code>${x => x.labelProviderTag}</code></p>
<table>
    <thead>
        <th>Token name</th>
        <th>HTML attribute name</th>
        <th>JS property name</th>
        <th>Default value (English)</th>
    </thead>
    <tbody>
        ${repeat(
        x => x.labelTokens,
        html<[string, DesignToken<string>], LabelProviderArgs>`
                <tr>
                    <td>${x => x[0]}</td>
                    <td>
                        ${(x, c) => getAttributeName(c.parent.removeNamePrefix(x[0]))}
                    </td>
                    <td>
                        ${(x, c) => getPropertyName(c.parent.removeNamePrefix(x[0]))}
                    </td>
                    <td>"${x => x[1].getValueFor(document.body)}"</td>
                </tr>
            `
    )}
    </tbody>
</table>
`;

export const labelProviderMetadata: Meta<LabelProviderArgs> = {
    parameters: {
        chromatic: { disableSnapshot: true }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<LabelProviderArgs>`
        <div>
            <style>
                div {
                    font: var(${bodyFont.cssCustomProperty});
                }
                thead {
                    font: var(${groupHeaderFont.cssCustomProperty});
                    color: var(${groupHeaderFontColor.cssCustomProperty});
                    text-transform: var(${groupHeaderTextTransform.cssCustomProperty});
                }
                td { 
                    padding: 10px 20px 10px 10px;
                    height: 32px;
                }
            </style>
            ${x => createTemplate(x.labelProviderTag)}
        </div>
    `),
    argTypes: {
        removeNamePrefix: {
            table: {
                disable: true
            }
        },
        labelProviderTag: {
            table: {
                disable: true
            }
        },
        labelTokens: {
            table: {
                disable: true
            }
        }
    },
    args: {
        removeNamePrefix: jsTokenName => jsTokenName
    }
};
