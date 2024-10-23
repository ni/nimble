import type { Meta, StoryObj } from '@storybook/html';
import { html, ref, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import * as nimbleIconComponentsMap from '../../../../nimble-components/src/icons/all-icons';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '../../../../nimble-components/src/theme-provider/design-token-names';
import { Table, tableTag } from '../../../../nimble-components/src/table';
import { tableColumnMappingTag } from '../../../../nimble-components/src/table-column/mapping';
import { mappingIconTag } from '../../../../nimble-components/src/mapping/icon';
import { tableColumnTextTag } from '../../../../nimble-components/src/table-column/text';
import { IconSeverity } from '../../../../nimble-components/src/icon-base/types';
import { iconMetadata } from '../../../../nimble-components/src/icon-base/tests/icon-metadata';
import { tableFitRowsHeight } from '../../../../nimble-components/src/theme-provider/design-tokens';
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
        await customElements.whenDefined(tableTag);
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
