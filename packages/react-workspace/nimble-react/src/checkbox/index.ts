import { Checkbox, checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { wrap } from '../utilities/react-wrapper';

export { Checkbox, checkboxTag };
export const NimbleCheckbox = wrap(Checkbox, {
    events: {
        onChange: 'change',
    }
});

export interface CheckboxChangeEvent extends Event {
    target: Checkbox;
}
