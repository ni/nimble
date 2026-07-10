'use client';

import { FvChipSelector, fvChipSelectorTag } from '@ni/ok-components/dist/esm/fv/chip-selector';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvChipSelectorTag };
export { type FvChipSelector };
export const OkFvChipSelector = wrap(FvChipSelector, {
    events: {
        onChange: 'change' as EventName<FvChipSelectorChangeEvent>,
    }
});
export interface FvChipSelectorChangeEvent extends CustomEvent<{ selectedValues: string[] }> {
    target: FvChipSelector;
}