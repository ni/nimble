'use client';

import { FvMultiSelect, fvMultiSelectTag } from '@ni/ok-components/dist/esm/fv/multi-select';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvMultiSelectTag };
export { type FvMultiSelect } from '@ni/ok-components/dist/esm/fv/multi-select';
export type { FvMultiSelectOption } from '@ni/ok-components/dist/esm/fv/multi-select/types';
export const OkFvMultiSelect = wrap(FvMultiSelect, {
    events: {
        onInput: 'input' as EventName<FvMultiSelectInputEvent>,
        onChange: 'change' as EventName<FvMultiSelectChangeEvent>
    }
});
export interface FvMultiSelectInputEvent extends Event {
    target: FvMultiSelect;
}
export interface FvMultiSelectChangeEvent extends Event {
    target: FvMultiSelect;
}
