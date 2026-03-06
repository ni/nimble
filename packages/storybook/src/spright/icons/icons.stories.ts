import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref, repeat } from '@ni/fast-element';

import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { iconMetadata } from '@ni/spright-components/dist/esm/icon-base/tests/icon-metadata';
import * as sprightIconComponentsMap from '@ni/spright-components/dist/esm/icons/all-icons';
import { createUserSelectedThemeStory, fastParameters } from '../../utilities/storybook';

type IconName = keyof typeof sprightIconComponentsMap;
const data = Object.entries(sprightIconComponentsMap).map(
    ([iconClassName, iconClass]) => ({
        tag: customElements.getName(iconClass),
        metaphor: iconMetadata[iconClassName as IconName].tags.join(', ')
    })
);

type Data = (typeof data)[number];

interface IconArgs {
    tableRef: Table<Data>;
}

const metadata: Meta<IconArgs> = {
    title: 'Spright/Icons',
    parameters: {
        ...fastParameters()
    }
};

export default metadata;

const updateData = (tableRef: Table<Data>): void => {
    void (async () => {
        // Safari workaround: the table element instance is made at this point
        // but doesn't seem to be upgraded to a custom element yet
        await customElements.whenDefined(tableTag);
        await tableRef.setData(data);
    })();
};

export const icons: StoryObj<IconArgs> = {
    args: {
        tableRef: undefined
    },
    argTypes: {
        tableRef: {
            table: {
                disable: true
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <style class="code-hide">
            ${tableTag} {
                height: var(${tableFitRowsHeight.cssCustomProperty});
                max-height: none;
            }
        </style>
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => updateData(x.tableRef)}"
        >
            <${tableColumnMappingTag} field-name="tag" key-type="string" fractional-width="0.2" >
                Icon
                ${repeat(() => data, html<Data, IconArgs>`
                    <${mappingIconTag}
                        key="${x => x.tag}"
                        icon="${x => x.tag}"
                        text="${x => x.tag}"
                        text-hidden
                    ></${mappingIconTag}>
                `)}
            </${tableColumnMappingTag}>
            <${tableColumnTextTag} field-name="tag">
                Tag Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} sorting-disabled field-name="metaphor">
                Metaphors
            </${tableColumnTextTag}>
        </${tableTag}>
    `)
};
