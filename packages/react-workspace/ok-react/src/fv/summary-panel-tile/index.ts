'use client';

import {
    FvSummaryPanelTile,
    fvSummaryPanelTileTag
} from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import { FvSummaryPanelTileTextPosition } from '@ni/ok-components/dist/esm/fv/summary-panel-tile/types';
import { wrap } from '../../utilities/react-wrapper';

export { fvSummaryPanelTileTag };
export { type FvSummaryPanelTile, FvSummaryPanelTileTextPosition };
export const OkFvSummaryPanelTile = wrap(FvSummaryPanelTile);