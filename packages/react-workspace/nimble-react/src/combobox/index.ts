import { Combobox, comboboxTag } from '@ni/nimble-components/dist/esm/combobox';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { comboboxTag };
export { type Combobox };
export const NimbleCombobox = wrap(Combobox, {
    events: {
        onChange: 'change' as EventName<ComboboxChangeEvent>,
        onInput: 'input' as EventName<ComboboxInputEvent>
    }
});
export interface ComboboxChangeEvent extends CustomEvent {
    target: Combobox;
}
export interface ComboboxInputEvent extends CustomEvent {
    target: Combobox;
}
