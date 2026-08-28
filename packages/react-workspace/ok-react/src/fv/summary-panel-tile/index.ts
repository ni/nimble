'use client';

import {
    FvSummaryPanelTile,
    fvSummaryPanelTileTag
} from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import { FvSummaryPanelTileTextPosition } from '@ni/ok-components/dist/esm/fv/summary-panel-tile/types';
import { FvSummaryPanelSize } from '@ni/ok-components/dist/esm/fv/summary-panel/types';
import { wrap } from '../../utilities/react-wrapper';

export { fvSummaryPanelTileTag };
export { type FvSummaryPanelTile, FvSummaryPanelTileTextPosition, FvSummaryPanelSize };
export const OkFvSummaryPanelTile = wrap(FvSummaryPanelTile);