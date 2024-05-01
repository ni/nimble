import { ViewTemplate, html, ref } from '@microsoft/fast-element';
import type { Meta } from '@storybook/html';
import type { DesignToken } from '@microsoft/fast-foundation';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import {
    getAttributeName,
    getPropertyName,
    removePrefixAndCamelCase
} from './label-name-utils';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

export interface LabelProviderArgs {
    tableRef: Table;
    labelProviderTag: string;
    labelTokens: [string, DesignToken<string>][];
    prefixSubstring: string;
    updateData(args: LabelProviderArgs): void;
}

const createTemplate = (
    labelProviderTag: string
): ViewTemplate<LabelProviderArgs> => html<LabelProviderArgs>`
<${labelProviderTag}></${labelProviderTag}>
<p>Element name: ${x => x.labelProviderTag}</p>
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
                    /* Make the table big enough to remove vertical scrollbar */
                    height: calc((34px * var(--data-length)) + 32px);
                }
            </style>
            ${x => createTemplate(x.labelProviderTag)}
        </div>
    `),
    argTypes: {
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
                            removePrefixAndCamelCase(
                                token[0],
                                x.prefixSubstring
                            )
                        ),
                        jsPropertyName: getPropertyName(
                            removePrefixAndCamelCase(
                                token[0],
                                x.prefixSubstring
                            )
                        ),
                        defaultValue: token[1].getValueFor(document.body)
                    };
                });
                x.tableRef.style.setProperty(
                    '--data-length',
                    data.length.toString()
                );
                await x.tableRef.setData(data);
            })();
        }
    }
};
