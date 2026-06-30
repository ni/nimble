import type { Meta, StoryFn } from '@storybook/html-vite';
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
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Master Detail List',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const matrixStyle = `
    inline-size: 360px;
    min-block-size: 700px;
    font: var(${bodyFont.cssCustomProperty});
    color: var(${bodyFontColor.cssCustomProperty});
    background: var(${applicationBackgroundColor.cssCustomProperty});
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="${matrixStyle}">
        <${fvMasterDetailListTag} placeholder="Filter devices...">
            <${fvMasterDetailListItemTag}
                title-text="NI-DAQ-001"
                subtitle="USB-6001 · Lab A"
                value="daq-001"
                status-color="#169c44"
                status-label="Connected"
                selected
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SCOPE-002"
                subtitle="PXIe-5162 · Lab B"
                value="scope-002"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-FGEN-003"
                subtitle="PXI-5421 · Storage"
                value="fgen-003"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-DMM-004"
                subtitle="USB-4065 · Lab A"
                value="dmm-004"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SWITCH-005"
                subtitle="PXI-2527 · Rack 3"
                value="switch-005"
                status-color="#ff5f0f"
                status-label="Pending changes"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SERIAL-006"
                subtitle="USB-485/2 · Lab C"
                value="serial-006"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
        </${fvMasterDetailListTag}>
    </div>
`);