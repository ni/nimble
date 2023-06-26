import { ViewTemplate, html, ref, repeat } from '@microsoft/fast-element';
import type { Meta } from '@storybook/html';
import type { DesignToken } from '@microsoft/fast-foundation';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import type { LabelProviderBase } from '.';
import {
    bodyFont,
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderTextTransform
} from '../../theme-provider/design-tokens';
import { getAttributeName, getPropertyName } from './label-name-utils';

export interface LabelProviderArgs {
    labelProviderTag: string;
    labelProviderRef: LabelProviderBase;
    removeNamePrefix(tokenName: string): string;
}

const overviewText = `Some Nimble components use strings/labels that need to be localized, if the consuming application 
supports localization. Nimble exposes these localizable labels as design tokens, to support both localization and the
ability for clients to override the strings in specific contexts.

Nimble provides English strings as the token defaults, and provides \`nimble-label-provider-*\` elements with APIs for
overriding those values with localized versions.

See the <a href="https://github.com/ni/nimble/tree/main/packages/nimble-components">nimble-components</a> readme and
contributing docs for more information.`;

const createTemplate = (
    labelProviderTag: string
): ViewTemplate<LabelProviderArgs> => html<LabelProviderArgs>`
<${labelProviderTag} ${ref('labelProviderRef')}></${labelProviderTag}>
<h2>${x => x.labelProviderTag}</h2>
<hr/>
<table>
    <thead>
        <th>Token name</th>
        <th>HTML attribute name</th>
        <th>JS property name</th>
        <th>Default value (English)</th>
    </thead>
    <tbody>
        ${repeat(
        x => Object.entries(x.labelProviderRef.labelTokens),
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
        docs: {
            description: {
                component: overviewText
            }
        },
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
        labelProviderRef: {
            table: {
                disable: true
            }
        }
    },
    args: {
        labelProviderTag: undefined,
        removeNamePrefix: jsTokenName => jsTokenName
    }
};
