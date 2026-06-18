import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import {
    fvMasterDetailListTag
} from '@ni/ok-components/dist/esm/fv/master-detail-list';
import {
    fvMasterDetailListItemTag
} from '@ni/ok-components/dist/esm/fv/master-detail-list-item';
import {
    bodyFont,
    bodyFontColor,
    applicationBackgroundColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

interface FvMasterDetailListArgs {
    placeholder: string;
    compact?: boolean;
    items?: string;
    change?: (e: Event) => void;
}

const storyStyles = `
    .master-detail-list-story {
        inline-size: 360px;
        min-block-size: 700px;
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        background: var(${applicationBackgroundColor.cssCustomProperty});
    }
`;

const deviceListMarkup = html<FvMasterDetailListArgs>`
    <${fvMasterDetailListTag} placeholder="${x => x.placeholder}">
        <${fvMasterDetailListItemTag}
            title-text="NI-DAQ-001"
            subtitle="USB-6001 · Lab A"
            value="daq-001"
            status-color="#169c44"
            status-label="Connected"
            ?compact="${x => x.compact}"
            selected
        ></${fvMasterDetailListItemTag}>
        <${fvMasterDetailListItemTag}
            title-text="NI-SCOPE-002"
            subtitle="PXIe-5162 · Lab B"
            value="scope-002"
            status-color="#169c44"
            status-label="Connected"
            ?compact="${x => x.compact}"
        ></${fvMasterDetailListItemTag}>
        <${fvMasterDetailListItemTag}
            title-text="NI-FGEN-003"
            subtitle="PXI-5421 · Storage"
            value="fgen-003"
            ?compact="${x => x.compact}"
        ></${fvMasterDetailListItemTag}>
        <${fvMasterDetailListItemTag}
            title-text="NI-DMM-004"
            subtitle="USB-4065 · Lab A"
            value="dmm-004"
            status-color="#169c44"
            status-label="Connected"
            ?compact="${x => x.compact}"
        ></${fvMasterDetailListItemTag}>
        <${fvMasterDetailListItemTag}
            title-text="NI-SWITCH-005"
            subtitle="PXI-2527 · Rack 3"
            value="switch-005"
            status-color="#ff5f0f"
            status-label="Pending changes"
            ?compact="${x => x.compact}"
        ></${fvMasterDetailListItemTag}>
        <${fvMasterDetailListItemTag}
            title-text="NI-SERIAL-006"
            subtitle="USB-485/2 · Lab C"
            value="serial-006"
            status-color="#169c44"
            status-label="Connected"
            ?compact="${x => x.compact}"
        ></${fvMasterDetailListItemTag}>
    </${fvMasterDetailListTag}>
`;

const deviceListSource = `<ok-fv-master-detail-list placeholder="Filter devices...">
    <ok-fv-master-detail-list-item
        title-text="NI-DAQ-001"
        subtitle="USB-6001 · Lab A"
        value="daq-001"
        status-color="#169c44"
        status-label="Connected"
        selected
    ></ok-fv-master-detail-list-item>
    <ok-fv-master-detail-list-item
        title-text="NI-SCOPE-002"
        subtitle="PXIe-5162 · Lab B"
        value="scope-002"
        status-color="#169c44"
        status-label="Connected"
    ></ok-fv-master-detail-list-item>
    <ok-fv-master-detail-list-item
        title-text="NI-FGEN-003"
        subtitle="PXI-5421 · Storage"
        value="fgen-003"
    ></ok-fv-master-detail-list-item>
    <ok-fv-master-detail-list-item
        title-text="NI-DMM-004"
        subtitle="USB-4065 · Lab A"
        value="dmm-004"
        status-color="#169c44"
        status-label="Connected"
    ></ok-fv-master-detail-list-item>
    <ok-fv-master-detail-list-item
        title-text="NI-SWITCH-005"
        subtitle="PXI-2527 · Rack 3"
        value="switch-005"
        status-color="#ff5f0f"
        status-label="Pending changes"
    ></ok-fv-master-detail-list-item>
    <ok-fv-master-detail-list-item
        title-text="NI-SERIAL-006"
        subtitle="USB-485/2 · Lab C"
        value="serial-006"
        status-color="#169c44"
        status-label="Connected"
    ></ok-fv-master-detail-list-item>
</ok-fv-master-detail-list>`;

const customStatusSource = `<ok-fv-master-detail-list placeholder="Filter devices...">
    <ok-fv-master-detail-list-item
        title-text="NI-SWITCH-005"
        subtitle="PXI-2527 · Rack 3"
        value="switch-005"
        selected
    >
        <span slot="status" aria-label="Pending changes">!</span>
    </ok-fv-master-detail-list-item>
</ok-fv-master-detail-list>`;

const metadata: Meta<FvMasterDetailListArgs> = {
    title: 'Ok/Fv Master Detail List',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html<FvMasterDetailListArgs>`
        ${okWarning({
            componentName: 'fv master detail list',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <div class="master-detail-list-story">
            ${deviceListMarkup}
        </div>
    `),
    argTypes: {
        placeholder: {
            description: 'Placeholder text for the built-in filter field.',
            table: { category: apiCategory.attributes }
        },
        items: {
            description: 'Default slot for one or more `ok-fv-master-detail-list-item` children.',
            table: { category: apiCategory.slots },
            control: false
        },
        change: {
            description: 'Emitted when selection changes. The event detail contains the selected item and its value.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        placeholder: 'Filter devices...'
    }
};

export default metadata;

export const deviceList: StoryObj<FvMasterDetailListArgs> = {
    argTypes: {
        compact: {
            description: 'Applies the compact layout to each list item in the example.',
            table: { category: apiCategory.attributes },
            control: 'boolean'
        }
    },
    args: {
        compact: false
    },
    parameters: {
        docs: {
            source: {
                code: deviceListSource
            }
        }
    }
};

export const customStatusSlot: StoryObj<FvMasterDetailListArgs> = {
    render: createUserSelectedThemeStory(html<FvMasterDetailListArgs>`
        ${okWarning({
            componentName: 'fv master detail list',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}
            .custom-status {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                inline-size: 16px;
                block-size: 16px;
                border-radius: 50%;
                font-size: 12px;
                font-weight: 700;
                color: white;
                background: #ff5f0f;
            }
        </style>
        <div class="master-detail-list-story">
            <${fvMasterDetailListTag} placeholder="${x => x.placeholder}">
                <${fvMasterDetailListItemTag}
                    title-text="NI-SWITCH-005"
                    subtitle="PXI-2527 · Rack 3"
                    value="switch-005"
                    selected
                >
                    <span slot="status" class="custom-status" aria-label="Pending changes">!</span>
                </${fvMasterDetailListItemTag}>
                <${fvMasterDetailListItemTag}
                    title-text="NI-SERIAL-006"
                    subtitle="USB-485/2 · Lab C"
                    value="serial-006"
                    status-color="#169c44"
                    status-label="Connected"
                ></${fvMasterDetailListItemTag}>
            </${fvMasterDetailListTag}>
        </div>
    `),
    parameters: {
        docs: {
            source: {
                code: customStatusSource
            }
        }
    }
};