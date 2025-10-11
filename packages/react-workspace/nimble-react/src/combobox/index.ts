import { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { wrap, type EventName } from '../utilities/react-wrapper';

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
