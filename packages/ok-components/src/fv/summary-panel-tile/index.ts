import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    FvSummaryPanelTileTextPosition,
    type FvSummaryPanelTileTextPosition as FvSummaryPanelTileTextPositionType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-summary-panel-tile': FvSummaryPanelTile;
    }
}

/**
 * A clickable summary tile for displaying a large value with a compact label.
 */
export class FvSummaryPanelTile extends FoundationElement {
    @attr
    public count = '';

    @attr
    public label = '';

    @attr({ attribute: 'legacy-style', mode: 'boolean' })
    public legacyStyle = false;

    @attr({ mode: 'boolean' })
    public selected = false;

    @attr({ attribute: 'text-position' })
    public textPosition: FvSummaryPanelTileTextPositionType = FvSummaryPanelTileTextPosition.beside;
}

const okFvSummaryPanelTile = FvSummaryPanelTile.compose({
    baseName: 'fv-summary-panel-tile',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSummaryPanelTile());
export const fvSummaryPanelTileTag = 'ok-fv-summary-panel-tile';