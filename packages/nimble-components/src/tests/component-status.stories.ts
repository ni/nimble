/* eslint-disable max-classes-per-file */
import {
    attr,
    css,
    customElement,
    html,
    ref,
    when
} from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../utilities/tests/storybook';
import { Table, tableTag } from '../table';
import { tableColumnTextTag } from '../table-column/text';
import { mixinFractionalWidthColumnAPI } from '../table-column/mixins/fractional-width-column';
import { TableColumn } from '../table-column/base';
import { TableCellView } from '../table-column/base/cell-view';
import type { TableStringField } from '../table/types';
import { template as tableColumnTemplate } from '../table-column/base/template';

interface TableArgs {
    tableRef: Table;
}
const data = [
    [
        'Accordion',
        undefined,
        'https://github.com/ni/nimble/issues/533',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Anchor',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46/',
        'https://github.com/ni/nimble/issues/324',
        'https://ni.github.io/nimble/storybook/?path=/docs/anchor--text-anchor',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Anchor Button',
        undefined,
        'https://github.com/ni/nimble/issues/324',
        'https://ni.github.io/nimble/storybook/?path=/docs/anchor-button--outline-anchor-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Anchor Menu Item',
        undefined,
        'https://github.com/ni/nimble/issues/1020',
        'https://ni.github.io/nimble/storybook/?path=/docs/menu--anchor-menu-item',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Anchor Tabs',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b',
        'https://github.com/ni/nimble/issues/479',
        'https://nimble.ni.dev/storybook/?path=/docs/anchor-tabs--anchor-tabs',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Anchor Tree Item',
        undefined,
        'https://github.com/ni/nimble/issues/562',
        'https://ni.github.io/nimble/storybook/?path=/docs/tree-view--tree-view',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Banner',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab',
        'https://github.com/ni/nimble/issues/305',
        'https://nimble.ni.dev/storybook/?path=/docs/banner--banner',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Breadcrumb',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/breadcrumb--standard-breadcrumb',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Card',
        undefined,
        'https://github.com/ni/nimble/issues/296',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Card button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20',
        'https://github.com/ni/nimble/issues/643',
        'https://ni.github.io/nimble/storybook/?path=/docs/card-button--card-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Checkbox',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/checkbox--checkbox',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Chip/Pill',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/18a0e4f6-6541-4420-a6b5-cb79652a97dc/',
        'https://github.com/ni/nimble/issues/413',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Combo box',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bd6755d9-8fd2-4b97-9709-939ea20680ae',
        'https://github.com/ni/nimble/issues/341',
        'https://ni.github.io/nimble/storybook/?path=/docs/combobox--combobox',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Datepicker',
        undefined,
        'https://github.com/ni/nimble/issues/342',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Dialog',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006/',
        'https://github.com/ni/nimble/issues/378',
        'https://ni.github.io/nimble/storybook/?path=/docs/dialog--dialog',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Drawer',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/drawer--drawer',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Dropdown (Select)',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/select--select',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Filter Builder',
        undefined,
        'https://github.com/ni/nimble/issues/310',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Icon Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/button--icon-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Icon Menu Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        'https://github.com/ni/nimble/issues/300',
        'https://ni.github.io/nimble/storybook/?path=/story/menu-button--icon-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Icons',
        undefined,
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/icons--component-icons',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Label',
        undefined,
        'https://github.com/ni/nimble/issues/312',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Menu',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/menu--custom-menu',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Menu Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/',
        'https://github.com/ni/nimble/issues/300',
        'https://ni.github.io/nimble/storybook/?path=/story/menu-button--outline-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Number Field',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf',
        'https://github.com/ni/nimble/issues/361',
        'https://ni.github.io/nimble/storybook/?path=/docs/number-field--number-field',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Progress Bar',
        undefined,
        'https://github.com/ni/nimble/issues/304',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Radio',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7',
        'https://github.com/ni/nimble/issues/297',
        'https://ni.github.io/nimble/storybook/?path=/docs/radio-group--radio-group',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Search Field',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2',
        'https://github.com/ni/nimble/issues/299',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Skeleton',
        undefined,
        'https://github.com/ni/nimble/issues/762',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Slider',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29d3a5f7-9eed-498c-9957-2cd495458e3b/',
        'https://github.com/ni/nimble/issues/295',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Spinner',
        'https://xd.adobe.com/view/6fc414f4-1660-4bff-4552-3e62baaa9e1e-19f5/screen/ced36959-68d6-440f-a0cc-031bc29d7e98/',
        'https://github.com/ni/nimble/issues/346',
        'https://nimble.ni.dev/storybook/?path=/docs/spinner--spinner',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Split Icon Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece',
        'https://github.com/ni/nimble/issues/298',
        undefined,
        '⭕',
        '⭕',
        '⭕'
    ],
    [
        'Switch',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/',
        'https://github.com/ni/nimble/issues/387',
        'https://ni.github.io/nimble/storybook/?path=/docs/switch--switch-story',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Table',
        'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/',
        'https://github.com/orgs/ni/projects/11',
        'https://ni.github.io/nimble/storybook/?path=/docs/table--table',
        '⚠️',
        '⚠️',
        '⭕'
    ],
    [
        'Tabs',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/tabs--tabs',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Text and Icon Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/a378bcdb-5c4b-4298-b3b1-28d8b1a37af2',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/button--outline-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Text Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/button--outline-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Text Field - Multiline',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/story/text-area--outline-text-area',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Text Field - Single',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/text-field--text-field',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Toggle Icon Button',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/story/toggle-button--icon-button',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Toolbar',
        undefined,
        'https://github.com/ni/nimble/issues/411',
        'https://ni.github.io/nimble/storybook/?path=/story/toolbar--toolbar',
        '✅',
        '✅',
        '✅'
    ],
    [
        'Tooltip',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/',
        'https://github.com/ni/nimble/issues/309',
        'https://ni.github.io/nimble/storybook/?path=/docs/tooltip--tooltip',
        '⚠️',
        '⚠️',
        '⚠️'
    ],
    [
        'Tree View',
        'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/ec5a855a-4174-46ad-947c-3931bbf3e32d/',
        undefined,
        'https://ni.github.io/nimble/storybook/?path=/docs/tree-view--tree-view',
        '✅',
        '✅',
        '✅'
    ],
    ['Wafer Map', undefined, undefined, undefined, '⚠️', '⚠️', '⚠️']
];

const dataFormatted = data.map(
    ([name, design, issue, story, component, angular, blazor]) => ({
        name,
        design,
        issue,
        story,
        component,
        angular,
        blazor
    })
);

const updateData = async (tableRef: Table): Promise<void> => {
    await customElements.whenDefined('nimble-table');
    tableRef.setData(dataFormatted);
};

const metadata: Meta<TableArgs> = {
    title: 'Component Status',
    tags: ['autodocs'],
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            id-field-name="name"
            data-unused="${x => {
        void updateData(x.tableRef);
    }}"
        >
            <${tableColumnTextTag} field-name="name">Name</${tableColumnTextTag}>
            <component-status-hyperlink field-url="design" placeholder="🎨">Design</component-status-hyperlink>
            <component-status-hyperlink field-url="issue" placeholder="🪲">Issue</component-status-hyperlink>
            <component-status-hyperlink field-url="story" placeholder="📖">Story</component-status-hyperlink>
            <${tableColumnTextTag} field-name="component">Component</${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="angular">Angular</${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="blazor">Blazor</${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        tableRef: {
            table: {
                disable: true
            }
        }
    },
    args: {
        tableRef: undefined
    }
};

interface ComponentStatusHyperlinkColumnConfig {
    placeholder: string;
}

type ComponentStatusHyperlinkCellRecord = TableStringField<'url'>;

/**
 * Hyperlink column for component table view
 */
@customElement({
    name: 'component-status-hyperlink-view',
    template: html<TableColumnTextCellView>`
        ${when(
        x => x.cellRecord.url,
        html<TableColumnTextCellView>`
                <a href="${x => x.cellRecord.url}" style=""
                    >${x => x.columnConfig.placeholder}</a
                >
            `
    )}
    `,
    styles: css`
        a {
            text-decoration: none;
        }
    `
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TableColumnTextCellView extends TableCellView<
    ComponentStatusHyperlinkCellRecord,
    ComponentStatusHyperlinkColumnConfig
    > {}

/**
 * Hyperlink column for component table base
 */
@customElement({
    name: 'component-status-hyperlink',
    template: tableColumnTemplate
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ComponentStatusHyperlink extends mixinFractionalWidthColumnAPI(
    TableColumn<ComponentStatusHyperlinkColumnConfig>
    ) {
    public cellRecordFieldNames = ['url'] as const;

    @attr({ attribute: 'field-url' })
    public fieldUrl?: string;

    @attr
    public placeholder?: string;

    public readonly cellViewTag = 'component-status-hyperlink-view';

    public constructor() {
        super();
        this.internalPixelWidth = 20;
    }

    protected fieldUrlChanged(): void {
        this.dataRecordFieldNames = [this.fieldUrl] as const;
    }

    protected placeholderChanged(): void {
        this.columnConfig = { placeholder: this.placeholder ?? '' };
    }
}

export default metadata;

export const componentStatus: StoryObj<TableArgs> = {};
