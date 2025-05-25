import { Select } from '@ni/nimble-components/dist/esm/select';
import { type SelectFilterInputEventDetail } from '@ni/nimble-components/dist/esm/select/types';
import { wrap } from '../utilities/react-wrapper';

export const NimbleSelect = wrap(Select, {
    events: {
        onChange: 'change',
        onFilterInput: 'filter-input',
    }
});

export interface SelectChangeEvent extends CustomEvent {
    target: Select;
}

export interface SelectFilterInputEvent extends CustomEvent<SelectFilterInputEventDetail> {
    target: Select;
}
