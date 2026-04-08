import { NumberField, numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { numberFieldTag };
export { type NumberField };
export const NimbleNumberField = wrap(NumberField, {
    events: {
        onChange: 'change' as EventName<NumberFieldChangeEvent>,
        onInput: 'input' as EventName<NumberFieldInputEvent>
    }
});
export interface NumberFieldChangeEvent extends CustomEvent {
    target: NumberField;
}
export interface NumberFieldInputEvent extends CustomEvent {
    target: NumberField;
}
