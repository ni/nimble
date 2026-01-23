import { Select, selectTag } from '@ni/nimble-components/dist/esm/select';
import { type SelectFilterInputEventDetail } from '@ni/nimble-components/dist/esm/select/types';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { selectTag };
export { type Select };
export const NimbleSelect = wrap(Select, {
    events: {
        onChange: 'change' as EventName<SelectChangeEvent>,
        onFilterInput: 'filter-input' as EventName<SelectFilterInputEvent>,
    }
});
export interface SelectChangeEvent extends CustomEvent {
    target: Select;
}
export interface SelectFilterInputEvent extends CustomEvent<SelectFilterInputEventDetail> {
    target: Select;
}
