import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { fvSummaryPanelTileTag } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const legacyStyleStates = [
    ['Modern', false],
    ['Legacy', true]
] as const;
type LegacyStyleState = (typeof legacyStyleStates)[number];

const textPositionStates = [
    ['Beside', 'beside'],
    ['Under', 'under']
] as const;
type TextPositionState = (typeof textPositionStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Summary Panel',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const summaryPanel = (
    [legacyStyleName, legacyStyle]: LegacyStyleState,
    [textPositionName, textPosition]: TextPositionState,
    size: 'default' | 'compact'
): ViewTemplate => {
    const isCompact = size === 'compact';
    return html`
        <div style="display: inline-flex; flex-direction: column; width: ${isCompact ? '390px' : '460px'}; margin: 0 16px 16px 0;">
            <div style="font-size: 12px; color: #0076d6; text-align: center; min-height: 16px;">
                ${() => `${legacyStyleName} ${textPositionName}`}
            </div>
            <${fvSummaryPanelTag}
                ?show-edit-items-button="${() => !isCompact}"
                ?legacy-style="${() => legacyStyle}"
                size="${() => size}"
            >
                <${fvSummaryPanelTileTag} count="234" label="systems" text-position="${() => textPosition}" selected></${fvSummaryPanelTileTag}>
                <${fvSummaryPanelTileTag} count="207" label="connected" text-position="${() => textPosition}"></${fvSummaryPanelTileTag}>
                <${fvSummaryPanelTileTag} count="28" label="disconnected" text-position="${() => textPosition}"></${fvSummaryPanelTileTag}>
                <${fvSummaryPanelTileTag} count="1" label="pending" text-position="${() => textPosition}"></${fvSummaryPanelTileTag}>
                ${isCompact ? html`
                    <${fvSummaryPanelTileTag} count="12" label="warnings" text-position="${() => textPosition}"></${fvSummaryPanelTileTag}>
                    <${fvSummaryPanelTileTag} count="3" label="critical" text-position="${() => textPosition}"></${fvSummaryPanelTileTag}>
                ` : ''}
            </${fvSummaryPanelTag}>
        </div>
    `;
};

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(
        (legacyStyle, textPosition) => summaryPanel(legacyStyle, textPosition, 'default'),
        [legacyStyleStates, textPositionStates]
    )
);

export const compact: StoryFn = createMatrixThemeStory(
    createMatrix(
        (legacyStyle, textPosition) => summaryPanel(legacyStyle, textPosition, 'compact'),
        [legacyStyleStates, textPositionStates]
    )
);