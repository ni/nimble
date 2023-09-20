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

const nimbleIconComponents = Object.values(nimbleIconComponentsMap);
const iconTagNames = nimbleIconComponents.map(klass => DesignSystem.tagFor(klass));

interface IconArgs {
    severity: keyof typeof IconSeverity;
    tableRef: Table;
    updateData: (args: IconArgs) => void;
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

const updateData = (tableRef: Table): void => {
    void (async () => {
        // Safari workaround: the table element instance is made at this point
        // but doesn't seem to be upgraded to a custom element yet
        await customElements.whenDefined('nimble-table');
        await tableRef.setData(iconTagNames.map(tag => ({ icon: tag })));
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
        <style class="code-hide">
            .container > * {
                padding: 5px;
            }
        </style>
        <div class="container">
            <${tableTag}
                ${ref('tableRef')}
                data-unused="${x => updateData(x.tableRef)}"
            >
                <${tableColumnIconTag} field-name="icon" key-type="string">
                    Icon
                    ${repeat(() => iconTagNames, html<(typeof iconTagNames)[number], IconArgs>`
                        <${mappingIconTag}
                            key="${x => x}"
                            icon="${x => x}"
                            text="${x => x}"
                            severity="${(_, c) => c.parent.severity}"
                        ></${mappingIconTag}>
                    `)}
                </${tableColumnIconTag}>
                <${tableColumnTextTag} field-name="icon">
                    Tag Name
                </${tableColumnTextTag}>
            </${tableTag}>
        </div>
    `)
};
