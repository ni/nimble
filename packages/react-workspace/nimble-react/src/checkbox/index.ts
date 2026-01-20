import { Checkbox, checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { checkboxTag };
export { type Checkbox };
export const NimbleCheckbox = wrap(Checkbox, {
    events: {
        onChange: 'change' as EventName<CheckboxChangeEvent>,
    }
});
export interface CheckboxChangeEvent extends CustomEvent {
    target: Checkbox;
}
