import { html, ref } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnAnchorTag } from '@ni/nimble-components/dist/esm/table-column/anchor';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconTriangleTag } from '@ni/nimble-components/dist/esm/icons/triangle';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { ComponentFrameworkStatus } from './types';
import {
    createUserSelectedThemeStory,
    fastParameters
} from '../utilities/storybook';

const libraryOptions = ['nimble', 'spright', 'ok', 'future'] as const;

interface TableArgs {
    tableRef: Table;
    updateData: (args: TableArgs) => void;
    library: (typeof libraryOptions)[number];
}

const components = [
    {
        componentName: 'Accordion',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A89225&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/533',
        issueLabel: '#533',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Anchor',
        componentHref: './?path=/docs/components-anchor--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A76992&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/324',
        issueLabel: '#324',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Anchor Button',
        componentHref: './?path=/docs/components-anchor-button--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A82309&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/324',
        issueLabel: '#324',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Anchor Tabs',
        componentHref: './?path=/docs/components-anchor-tabs--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A70711&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/479',
        issueLabel: '#479',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Anchor Tree Item',
        componentHref:
            './?path=/docs/components-tree-view--docs#anchor-tree-item',
        issueHref: 'https://github.com/ni/nimble/issues/562',
        issueLabel: '#562',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Badge',
        issueHref: 'https://github.com/ni/nimble/issues/1428',
        issueLabel: '#1428',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Banner',
        componentHref: './?path=/docs/components-banner--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A65855&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/305',
        issueLabel: '#305',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Breadcrumb',
        componentHref: './?path=/docs/components-breadcrumb--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=10133-130109&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/343',
        issueLabel: '#343',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Card',
        componentHref: './?path=/docs/incubating-card--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=5069%3A8503&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/296',
        issueLabel: '#296',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.incubating,
        angularStatus: ComponentFrameworkStatus.incubating,
        blazorStatus: ComponentFrameworkStatus.incubating,
        reactStatus: ComponentFrameworkStatus.incubating
    },
    {
        componentName: 'Card button',
        componentHref: './?path=/docs/components-card-button--docs',
        designHref:
            'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/643',
        issueLabel: '#643',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Chat Conversation',
        componentHref: './?path=/docs/spright-chat-conversation--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=12342-81782&node-type=canvas&t=L5GvLaC3injrqWrR-0',
        designLabel: 'Figma',
        library: 'spright',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Checkbox',
        componentHref: './?path=/docs/components-checkbox--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A64589&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Chip',
        componentHref: './?path=/docs/components-chip--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&p=f&t=jqn5mzroV2yUvbvC-0',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Combobox',
        componentHref: './?path=/docs/components-combobox--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2229%3A79038&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/341',
        issueLabel: '#341',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Date picker',
        issueHref: 'https://github.com/ni/nimble/issues/342',
        issueLabel: '#342',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Date Time Text',
        issueHref: 'https://github.com/ni/nimble/issues/294',
        issueLabel: '#294',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Dialog',
        componentHref: './?path=/docs/components-dialog--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=4154-22021&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/378',
        issueLabel: '#378',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Drawer',
        componentHref: './?path=/docs/components-drawer--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=3727-3929&p=f&m=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Filter Builder (Query Builder)',
        issueHref: 'https://github.com/ni/nimble/issues/310',
        issueLabel: '#310',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'FV Accordion Item',
        componentHref: './?path=/docs/ok-fv-accordion-item--docs',
        designHref: 'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=4618-64645',
        designLabel: 'Figma',
        library: 'ok',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'FV Search Input',
        componentHref: './?path=/docs/ok-fv-search-input--docs',
        designHref: 'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1453-32903',
        designLabel: 'Figma',
        library: 'ok',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Icon Button',
        componentHref: './?path=/docs/components-button--docs#icon-button',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-77205&p=f&m=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Icon Dynamic',
        componentHref: './?path=/docs/ok-icon-dynamic--docs',
        library: 'ok',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Icon Menu Button',
        componentHref: './?path=/docs/components-menu-button--docs#icon-button',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-77205&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/300',
        issueLabel: '#300',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Icons',
        componentHref: './?path=/docs/components-icons--docs',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Label',
        issueHref: 'https://github.com/ni/nimble/issues/312',
        issueLabel: '#312',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Menu',
        componentHref: './?path=/docs/components-menu--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1317%3A31514&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Menu Button',
        componentHref: './?path=/docs/components-menu-button--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-77205&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/300',
        issueLabel: '#300',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Number Field',
        componentHref: './?path=/docs/components-number-field--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A47482&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/361',
        issueLabel: '#361',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Picker (Chip)',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/458',
        issueLabel: '#458',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Progress Bar',
        issueHref: 'https://github.com/ni/nimble/issues/304',
        issueLabel: '#304',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Query Builder',
        issueHref: 'https://github.com/ni/nimble/issues/506',
        issueLabel: '#506',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Radio',
        componentHref: './?path=/docs/components-radio-group--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A64589&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/297',
        issueLabel: '#297',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Rich Text Editor',
        componentHref: './?path=/docs/incubating-rich-text-editor--docs',
        designHref:
            'https://www.figma.com/design/Q5SU1OwrnD08keon3zObRX/SystemLink-orig?node-id=6280-94045&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/1288',
        issueLabel: '#1288',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.incubating,
        angularStatus: ComponentFrameworkStatus.incubating,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.incubating
    },
    {
        componentName: 'Rich Text Viewer',
        componentHref: './?path=/docs/incubating-rich-text-viewer--docs',
        designHref:
            'https://www.figma.com/design/Q5SU1OwrnD08keon3zObRX/SystemLink-orig?node-id=6280-94045&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/1288',
        issueLabel: '#1288',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.incubating,
        angularStatus: ComponentFrameworkStatus.incubating,
        blazorStatus: ComponentFrameworkStatus.incubating,
        reactStatus: ComponentFrameworkStatus.incubating
    },
    {
        componentName: 'Search Field',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1507%3A44702&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/299',
        issueLabel: '#299',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Select (Dropdown)',
        componentHref: './?path=/docs/components-select--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&p=f&m=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Skeleton',
        issueHref: 'https://github.com/ni/nimble/issues/762',
        issueLabel: '#762',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Slider',
        designHref:
            'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29d3a5f7-9eed-498c-9957-2cd495458e3b',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/295',
        issueLabel: '#295',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Spinner',
        componentHref: './?path=/docs/components-spinner--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2086%3A78099&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/346',
        issueLabel: '#346',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Split Button',
        issueHref: 'https://github.com/ni/nimble/issues/1523',
        issueLabel: '#1523',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Stepper',
        componentHref: './?path=/docs/components-stepper--docs',
        designHref: 'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=11742-71097&p=f&t=U3UnPlU4awyN4ybh-0',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/624',
        issueLabel: '#624',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Switch',
        componentHref: './?path=/docs/components-switch--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1672%3A73506&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/387',
        issueLabel: '#387',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Table',
        componentHref: './?path=/docs/components-table--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=5453-19325&p=f&m=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/orgs/ni/projects/11',
        issueLabel: 'project #11',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Tabs',
        componentHref: './?path=/docs/components-tabs--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A70711&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Text Button',
        componentHref: './?path=/docs/components-button--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A82309&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Text Area',
        componentHref: './?path=/docs/components-text-area--docs',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2443-86867&p=f&m=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Text Field',
        componentHref: './?path=/docs/components-text-field--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A47516&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Toast',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295%3A68679&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/513',
        issueLabel: '#513',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Toggle Button Group',
        designHref:
            'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        designLabel: 'XD',
        issueHref: 'https://github.com/ni/nimble/issues/298',
        issueLabel: '#298',
        library: 'future',
        componentStatus: ComponentFrameworkStatus.doesNotExist,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.doesNotExist,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    },
    {
        componentName: 'Toggle Icon Button',
        componentHref:
            './?path=/docs/components-toggle-button--docs#icon-button',
        designHref:
            'https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1295-77205&p=f&m=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Toolbar',
        componentHref: './?path=/docs/components-toolbar--docs',
        issueHref: 'https://github.com/ni/nimble/issues/411',
        issueLabel: '#411',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Tooltip',
        componentHref: './?path=/docs/incubating-tooltip--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1347%3A40392&mode=dev',
        designLabel: 'Figma',
        issueHref: 'https://github.com/ni/nimble/issues/309',
        issueLabel: '#309',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.incubating,
        angularStatus: ComponentFrameworkStatus.incubating,
        blazorStatus: ComponentFrameworkStatus.incubating,
        reactStatus: ComponentFrameworkStatus.incubating
    },
    {
        componentName: 'Tree View',
        componentHref: './?path=/docs/components-tree-view--docs',
        designHref:
            'https://www.figma.com/file/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=1372%3A32423&mode=dev',
        designLabel: 'Figma',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.ready,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.ready
    },
    {
        componentName: 'Wafer Map',
        componentHref: './?path=/docs/incubating-wafer-map--docs',
        issueHref: 'https://github.com/ni/nimble/issues/924',
        issueLabel: '#924',
        library: 'nimble',
        componentStatus: ComponentFrameworkStatus.incubating,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.incubating,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    }
] as const;

const iconMappings = html`
    <${mappingIconTag} key="${ComponentFrameworkStatus.ready}" text="Ready" icon="${iconCheckTag}" severity="success" text-hidden></${mappingIconTag}>
    <${mappingIconTag} key="${ComponentFrameworkStatus.incubating}" text="Incubating" icon="${iconTriangleTag}" severity="warning"></${mappingIconTag}>
    <${mappingIconTag} key="${ComponentFrameworkStatus.doesNotExist}" text="Does not exist" icon="${iconXmarkTag}" severity="error"></${mappingIconTag}>
`;

const metadata: Meta<TableArgs> = {
    title: 'Internal/Component Status',
    tags: [],
    decorators: [],
    parameters: {
        ...fastParameters()
    },
    render: createUserSelectedThemeStory(html<TableArgs>`
        <style class="code-hide">
            ${tableTag} {
                height: var(${tableFitRowsHeight.cssCustomProperty});
                max-height: none;
            }
        </style>
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
            <${tableColumnMappingTag}
                column-id="component-status-column"
                field-name="componentStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Web Component
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="angular-status-column"
                field-name="angularStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Angular
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="blazor-status-column"
                field-name="blazorStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Blazor
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="react-status-column"
                field-name="reactStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                React
                ${iconMappings}
            </${tableColumnMappingTag}>
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
        library: {
            options: [...libraryOptions],
            control: {
                type: 'radio'
            }
        }
    },
    args: {
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                const libraryComponents = components.filter(
                    component => component.library === x.library
                );
                await customElements.whenDefined(tableTag);
                await x.tableRef.setData(
                    libraryComponents.length > 0
                        ? libraryComponents
                        : [
                            {
                                componentName:
                                      'No components found for this library'
                            }
                        ]
                );
            })();
        },
        library: 'nimble'
    }
};

export default metadata;

export const componentStatus: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    }
};

export const componentStatusSpright: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'spright'
    }
};

export const componentStatusOk: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'ok'
    }
};

export const componentStatusFuture: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'future'
    }
};
