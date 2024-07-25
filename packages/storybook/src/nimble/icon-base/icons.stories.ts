import type { Meta, StoryObj } from '@storybook/html';
import { html, ref, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import * as nimbleIconComponentsMap from '@ni/nimble-components/dist/esm/icons/all-icons';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { IconSeverity } from '@ni/nimble-components/dist/esm/icon-base/types';
import { iconMetadata } from '@ni/nimble-components/dist/esm/icon-base/tests/icon-metadata';
import {
    apiCategory,
    createUserSelectedThemeStory,
    fastParameters,
    overrideWarning
} from '../../utilities/storybook';

type IconName = keyof typeof nimbleIconComponentsMap;
const data = Object.values(nimbleIconComponentsMap).map(iconClass => ({
    tag: DesignSystem.tagFor(iconClass),
    metaphor: iconMetadata[iconClass.name as IconName].tags.join(', ')
}));

type Data = (typeof data)[number];

interface IconArgs {
    severity: keyof typeof IconSeverity;
    tableRef: Table<Data>;
}

const metadata: Meta<IconArgs> = {
    title: 'Components/Icons',
    parameters: {
        ...fastParameters()
    }
};

export default metadata;

const appearanceDescriptionOverride = `
With SCSS properties, the icon color can be overriden. For example:
${scssInternalPropertySetterMarkdown(tokenNames.iconColor, 'purple')}
`;

const severityDescription = `
Set severity on the element to switch between the theme-aware color options.

${overrideWarning('Color', appearanceDescriptionOverride)}
`;

const updateData = (tableRef: Table<Data>): void => {
    void (async () => {
        // Safari workaround: the table element instance is made at this point
        // but doesn't seem to be upgraded to a custom element yet
        await customElements.whenDefined('nimble-table');
        tableRef.style.setProperty('--data-length', data.length.toString());
        await tableRef.setData(data);
    })();
};

// prettier-ignore
export const icons: StoryObj<IconArgs> = {
    args: {
        severity: 'default',
        tableRef: undefined
    },
    argTypes: {
        severity: {
            options: Object.keys(IconSeverity),
            control: { type: 'radio' },
            description: severityDescription,
            table: { category: apiCategory.attributes }
        },
        tableRef: {
            table: {
                disable: true
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <${tableTag}
            ${ref('tableRef')}
            ${/* Make the table big enough to remove vertical scrollbar */ ''}
            style="height: calc((34px * var(--data-length)) + 32px);"
            data-unused="${x => updateData(x.tableRef)}"
        >
            <${tableColumnMappingTag} field-name="tag" key-type="string" fractional-width="0.2" >
                Icon
                ${repeat(() => data, html<Data, IconArgs>`
                    <${mappingIconTag}
                        key="${x => x.tag}"
                        icon="${x => x.tag}"
                        text="${x => x.tag}"
                        severity="${(_, c) => c.parent.severity}"
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
