import { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { wrap } from '../utilities/react-wrapper';

export const NimbleCombobox = wrap(Combobox, {
    events: {
        onChange: 'change',
        onInput: 'input'
    }
});

export interface ComboboxChangeEvent extends CustomEvent {
    target: Combobox;
}

export interface ComboboxInputEvent extends CustomEvent {
    target: Combobox;
}
