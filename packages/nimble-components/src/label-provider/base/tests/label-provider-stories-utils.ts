import { ViewTemplate, html, ref } from '@microsoft/fast-element';
import type { Meta } from '@storybook/html';
import type { DesignToken } from '@microsoft/fast-foundation';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { bodyFont } from '../../../theme-provider/design-tokens';
import { getAttributeName, getPropertyName } from './label-name-utils';
import { Table, tableTag } from '../../../table';
import { tableColumnTextTag } from '../../../table-column/text';

export interface LabelProviderArgs {
    tableRef: Table;
    labelProviderTag: string;
    labelTokens: [string, DesignToken<string>][];
    prefixSubstring: string;
    removeNamePrefix(tokenName: string, elementName?: string,): string;
    updateData(args: LabelProviderArgs): void;
}

const createTemplate = (
    labelProviderTag: string
): ViewTemplate<LabelProviderArgs> => html<LabelProviderArgs>`
<${labelProviderTag}></${labelProviderTag}>
<p>Element name: <code>${x => x.labelProviderTag}</code></p>
<${tableTag}
    ${ref('tableRef')}
    data-unused="${x => x.updateData(x)}"
>
    <${tableColumnTextTag}
        column-id="token-name-column"
        field-name="tokenName"
    >
        Token name
    </${tableColumnTextTag}>
    <${tableColumnTextTag}
        column-id="attribute-name-column"
        field-name="htmlAttributeName"
    >
        HTML attribute name
    </${tableColumnTextTag}>
    <${tableColumnTextTag}
        column-id="property-name-column"
        field-name="jsPropertyName"
    >
        JS property name
    </${tableColumnTextTag}>
    <${tableColumnTextTag}
        column-id="default-value-column"
        field-name="defaultValue"
    >
        Default value (English)
    </${tableColumnTextTag}>
</${tableTag}>`;

export const labelProviderMetadata: Meta<LabelProviderArgs> = {
    render: createUserSelectedThemeStory(html<LabelProviderArgs>`
        <div>
            <style>
                p {
                    font: var(${bodyFont.cssCustomProperty});
                }
                ${tableTag} {
                    height: auto;
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
        },
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        },
        prefixSubstring: {
            table: {
                disable: true
            }
        }
    },
    args: {
        removeNamePrefix: jsTokenName => jsTokenName,
        tableRef: undefined,
        prefixSubstring: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');

                const data = x.labelTokens.map(token => {
                    return {
                        tokenName: token[0],
                        htmlAttributeName: getAttributeName(
                            x.removeNamePrefix(token[0], x.prefixSubstring)
                        ),
                        jsPropertyName: getPropertyName(
                            x.removeNamePrefix(token[0], x.prefixSubstring)
                        ),
                        defaultValue: token[1].getValueFor(document.body)
                    };
                });
                await x.tableRef.setData(data);
            })();
        }
    }
};
