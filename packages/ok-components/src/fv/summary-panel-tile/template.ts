import { html } from '@ni/fast-element';
import { cardButtonTag } from '@ni/nimble-components/dist/esm/card-button';
import type { FvSummaryPanelTile } from '.';

export const template = html<FvSummaryPanelTile>`
    <${cardButtonTag}
        class="summary-panel-tile"
        ?selected="${x => x.selected}"
    >
        <div class="summary-panel-tile-content ${x => x.textPosition}">
            <div class="count">${x => x.count}</div>
            <div class="label">${x => x.label}</div>
        </div>
    </${cardButtonTag}>
`;