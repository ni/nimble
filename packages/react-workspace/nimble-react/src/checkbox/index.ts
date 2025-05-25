import { Checkbox } from '@ni/nimble-components/dist/esm/checkbox';
import { wrap } from '../utilities/react-wrapper';

export const NimbleCheckbox = wrap(Checkbox, {
    events: {
        onChange: 'change',
    }
});

export interface CheckboxChangeEvent extends CustomEvent {
    target: Checkbox;
}
