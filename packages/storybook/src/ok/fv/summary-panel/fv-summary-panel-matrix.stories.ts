import type { Meta, StoryFn } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { fvSummaryPanelTileTag } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Summary Panel',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: inline-flex; width: 960px; padding: 16px;">
        <${fvSummaryPanelTag} show-edit-items-button legacy-style>
            <${fvSummaryPanelTileTag} count="234" label="systems" text-position="under" selected></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="207" label="connected" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="28" label="disconnected" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="1" label="pending" text-position="under"></${fvSummaryPanelTileTag}>
        </${fvSummaryPanelTag}>
    </div>
`);

export const compact: StoryFn = createMatrixThemeStory(html`
    <div style="display: inline-flex; width: 390px;">
        <${fvSummaryPanelTag} size="compact" legacy-style>
            <${fvSummaryPanelTileTag} count="234" label="systems" text-position="under" selected></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="207" label="connected" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="28" label="disconnected" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="1" label="pending" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="12" label="warnings" text-position="under"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="3" label="critical" text-position="under"></${fvSummaryPanelTileTag}>
        </${fvSummaryPanelTag}>
    </div>
`);