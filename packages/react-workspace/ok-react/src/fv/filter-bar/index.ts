'use client';

import { FvFilterBar, fvFilterBarTag } from '@ni/ok-components/dist/esm/fv/filter-bar';
import type { FvFilterBarEventDetail } from '@ni/ok-components/dist/esm/fv/filter-bar/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvFilterBarTag };
export { type FvFilterBar } from '@ni/ok-components/dist/esm/fv/filter-bar';
export type {
    FvFilterBarDefinition,
    FvFilterBarEventDetail,
    FvFilterBarGroup,
    FvFilterBarPredicate,
    FvFilterBarQueryDocument,
    FvFilterBarQueryNode,
    FvFilterBarToken
} from '@ni/ok-components/dist/esm/fv/filter-bar/types';
export const OkFvFilterBar = wrap(FvFilterBar, {
    events: {
        onEditFilter: 'edit-filter' as EventName<FvFilterBarEditEvent>,
        onClearFilter: 'clear-filter' as EventName<FvFilterBarClearEvent>
    }
});

export interface FvFilterBarEditEvent extends CustomEvent<FvFilterBarEventDetail> {
    target: FvFilterBar;
}

export interface FvFilterBarClearEvent extends CustomEvent<FvFilterBarEventDetail> {
    target: FvFilterBar;
}
