import type { Meta, StoryObj } from '@storybook/html';
import { html, ref, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import * as nimbleIconComponentsMap from '../../icons/all-icons';
import { IconSeverity } from '../types';
import {
    createUserSelectedThemeStory,
    overrideWarning
} from '../../utilities/tests/storybook';
import {
    tokenNames,
    scssInternalPropertySetterMarkdown
} from '../../theme-provider/design-token-names';
import { Table, tableTag } from '../../table';
import { tableColumnIconTag } from '../../table-column/icon';
import { mappingIconTag } from '../../mapping/icon';
import { tableColumnTextTag } from '../../table-column/text';
import { iconMetadata } from './icon-metadata';

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
    title: 'Components/Icons'
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
            description: severityDescription
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
            style="height: 5600px;"
            data-unused="${x => updateData(x.tableRef)}"
        >
            <${tableColumnIconTag} field-name="tag" key-type="string">
                Icon
                ${repeat(() => data, html<Data, IconArgs>`
                    <${mappingIconTag}
                        key="${x => x.tag}"
                        icon="${x => x.tag}"
                        text="${x => x.tag}"
                        severity="${(_, c) => c.parent.severity}"
                    ></${mappingIconTag}>
                `)}
            </${tableColumnIconTag}>
            <${tableColumnTextTag} field-name="tag">
                Tag Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} sorting-disabled field-name="metaphor">
                Metaphors
            </${tableColumnTextTag}>
        </${tableTag}>
    `)
};
