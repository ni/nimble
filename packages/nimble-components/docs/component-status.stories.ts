import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
} from '../src/utilities/tests/storybook';
import { Table, tableTag } from '../src/table';
import { tableColumnAnchorTag } from '../src/table-column/anchor';
import { tableColumnTextTag } from '../src/table-column/text';

const statusOptions = ['active', 'future'] as const;

interface TableArgs {
    tableRef: Table;
    updateData: (args: TableArgs) => void;
    status: typeof statusOptions[number];
}

const components = [
    {
        componentName: 'Accordion',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A89225&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/533',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Anchor',
        componentHref: './?path=/docs/components-anchor--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A76992&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/324',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Anchor Button',
        componentHref: './?path=/docs/components-anchor-button--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A82309&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/324',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Anchor Tabs',
        componentHref: './?path=/docs/components-anchor-tabs--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/479',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Anchor Tree Item',
        componentHref: './?path=/docs/components-tree-view--docs#anchor-tree-item',
        issueHref: 'https://github.com/ni/nimble/issues/562',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Banner',
        componentHref: './?path=/docs/components-banner--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A65855&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/305',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Breadcrumb',
        componentHref: './?path=/docs/components-breadcrumb--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/343',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Card',
        issueHref: 'https://github.com/ni/nimble/issues/296',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Card button',
        componentHref: './?path=/docs/components-card-button--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/643',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Checkbox',
        componentHref: './?path=/docs/components-checkbox--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A64589&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Combobox',
        componentHref: './?path=/docs/components-combobox--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2229%3A79038&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/341',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Date picker',
        issueHref: 'https://github.com/ni/nimble/issues/342',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Date Time Text',
        issueHref: 'https://github.com/ni/nimble/issues/294',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Dialog',
        componentHref: './?path=/docs/components-dialog--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/378',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Drawer',
        componentHref: './?path=/docs/components-drawer--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff',
        designLabel: 'XD',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Filter Builder (Query Builder)',
        issueHref: 'https://github.com/ni/nimble/issues/310',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Icon Button',
        componentHref: './?path=/docs/components-button--docs#icon-button',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        designLabel: 'XD',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Icon Menu Button',
        componentHref: './?path=/docs/components-menu-button--docs#icon-button',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/300',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Icons',
        componentHref: './?path=/docs/components-icons--docs',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Label',
        issueHref: 'https://github.com/ni/nimble/issues/312',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Menu',
        componentHref: './?path=/docs/components-menu--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1317%3A31514&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Menu Button',
        componentHref: './?path=/docs/components-menu-button--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/300',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Number Field',
        componentHref: './?path=/docs/components-number-field--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A47482&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/361',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Picker (Chip/Pill)',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/18a0e4f6-6541-4420-a6b5-cb79652a97dc/',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/458',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Progress Bar',
        issueHref: 'https://github.com/ni/nimble/issues/304',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Query Builder',
        issueHref: 'https://github.com/ni/nimble/issues/506',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Radio',
        componentHref: './?path=/docs/components-radio-group--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A64589&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/297',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Rich Text Editor',
        componentHref: './?path=/docs/incubating-rich-text-editor--docs',
        issueHref: 'https://github.com/ni/nimble/issues/1288',
        issueLabel: 'Issue',
        componentStatus: '⚠️',
        angularStatus: '⚠️',
        blazorStatus: '⚠️',
    },
    {
        componentName: 'Rich Text Viewer',
        componentHref: './?path=/docs/incubating-rich-text-viewer--docs',
        issueHref: 'https://github.com/ni/nimble/issues/1288',
        issueLabel: 'Issue',
        componentStatus: '⚠️',
        angularStatus: '⚠️',
        blazorStatus: '⚠️',
    },
    {
        componentName: 'Search Field',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1507%3A44702&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/299',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Select (Dropdown)',
        componentHref: './?path=/docs/components-select--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e',
        designLabel: 'XD',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Skeleton',
        issueHref: 'https://github.com/ni/nimble/issues/762',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Slider',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29d3a5f7-9eed-498c-9957-2cd495458e3b',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/295',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Spinner',
        componentHref: './?path=/docs/components-spinner--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2086%3A78099&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/346',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Split Icon Button',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/298',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Stepper',
        issueHref: 'https://github.com/ni/nimble/issues/624',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Switch',
        componentHref: './?path=/docs/components-switch--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1672%3A73506&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/387',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Table',
        componentHref: './?path=/docs/incubating-table--docs',
        designHref: 'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/',
        designLabel: 'XD',
        issueHref: 'https://github.com/orgs/ni/projects/11',
        issueLabel: 'Issue',
        componentStatus: '⚠️',
        angularStatus: '⚠️',
        blazorStatus: '⚠️',
    },
    {
        componentName: 'Tabs',
        componentHref: './?path=/docs/components-tabs--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A70711&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Text Button',
        componentHref: './?path=/docs/components-button--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A82309&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Text Area',
        componentHref: './?path=/docs/components-text-area--docs',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d',
        designLabel: 'XD',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Text Field',
        componentHref: './?path=/docs/components-text-field--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A47516&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Toast',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A68679&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/513',
        issueLabel: 'Issue',
        componentStatus: '⭕',
        angularStatus: '⭕',
        blazorStatus: '⭕',
    },
    {
        componentName: 'Toggle Icon Button',
        componentHref: './?path=/docs/components-toggle-button--docs#icon-button',
        designHref: 'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/',
        designLabel: 'XD',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Toolbar',
        componentHref: './?path=/docs/components-toolbar--docs',
        issueHref: 'https://github.com/ni/nimble/issues/411',
        issueLabel: 'Issue',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Tooltip',
        componentHref: './?path=/docs/incubating-tooltip--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1347%3A40392&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/309',
        issueLabel: 'Issue',
        componentStatus: '⚠️',
        angularStatus: '⚠️',
        blazorStatus: '⚠️',
    },
    {
        componentName: 'Tree View',
        componentHref: './?path=/docs/components-tree-view--docs',
        designHref: 'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1372%3A32423&mode=dev',
        designLabel: 'Figma',
        componentStatus: '✅',
        angularStatus: '✅',
        blazorStatus: '✅',
    },
    {
        componentName: 'Wafer Map',
        componentHref: './?path=/docs/incubating-wafer-map--docs',
        issueHref: 'https://github.com/ni/nimble/issues/924',
        issueLabel: 'Issue',
        componentStatus: '⚠️',
        angularStatus: '⚠️',
        blazorStatus: '⚠️',
    }
] as const;

const metadata: Meta<TableArgs> = {
    title: 'Internal/Component Status',
    tags: [],
    decorators: [],
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnAnchorTag} target="_top"
                column-id="component-name-column"
                label-field-name="componentName"
                href-field-name="componentHref"
                fractional-width=3
            >
                Component
            </${tableColumnAnchorTag}>
            <${tableColumnAnchorTag} target="_top"
                column-id="design-column"
                label-field-name="designLabel"
                href-field-name="designHref"
            >
                Design
            </${tableColumnAnchorTag}>
            <${tableColumnAnchorTag} target="_top"
                column-id="issue-column"
                label-field-name="issueLabel"
                href-field-name="issueHref"
            >
                Issue
            </${tableColumnAnchorTag}>
            <${tableColumnTextTag}
                column-id="component-status-column"
                field-name="componentStatus"
                ?column-hidden="${x => x.status === 'future'}"
            >
                Web Component
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="angular-status-column"
                field-name="angularStatus"
                ?column-hidden="${x => x.status === 'future'}"
            >
                Angular
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                column-id="blazor-status-column"
                field-name="blazorStatus"
                ?column-hidden="${x => x.status === 'future'}"
            >
                Blazor
            </${tableColumnTextTag}>

        </${tableTag}>
    `),
    argTypes: {
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
        status: {
            options: statusOptions,
            control: {
                type: 'radio'
            }
        },
    },
    args: {
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                const isFuture = (component: typeof components[number]): boolean =>
                    component.angularStatus  === '⭕'
                    && component.blazorStatus === '⭕'
                    && component.componentStatus === '⭕';
                const data = components.filter(component => x.status === 'future' ? isFuture(component) : !isFuture(component))
                await x.tableRef.setData(data);
            })();
        },
        status: statusOptions[0]
    }
};

export default metadata;

export const componentStatus: StoryObj<TableArgs> = {
    parameters: {
      // Story used by documentation, not needed for visual comparison.
      chromatic: { disableSnapshot: true }
    }
  };

export const componentStatusFuture: StoryObj<TableArgs> = {
    parameters: {
      // Story used by documentation, not needed for visual comparison.
      chromatic: { disableSnapshot: true }
    },
    args: {
        status: 'future'
    }
  };
