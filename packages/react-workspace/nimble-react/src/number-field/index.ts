import { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import { wrap } from '../utilities/react-wrapper';

export const NimbleNumberField = wrap(NumberField, {
    events: {
        onChange: 'change',
        onInput: 'input'
    }
});

export interface NumberFieldChangeEvent extends CustomEvent {
    target: NumberField;
}

export interface NumberFieldInputEvent extends CustomEvent {
    target: NumberField;
}
