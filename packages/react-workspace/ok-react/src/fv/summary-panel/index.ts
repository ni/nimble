'use client';

import { FvSummaryPanel, FvSummaryPanelSize, fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvSummaryPanelTag };
export { type FvSummaryPanel, FvSummaryPanelSize };
export const OkFvSummaryPanel = wrap(FvSummaryPanel, {
    events: {
        onEditItems: 'edit-items' as EventName<FvSummaryPanelEditItemsEvent>,
    }
});
export interface FvSummaryPanelEditItemsEvent extends CustomEvent<void> {
    target: FvSummaryPanel;
}