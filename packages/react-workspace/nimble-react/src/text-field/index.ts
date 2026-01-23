import { TextField, textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { textFieldTag };
export { type TextField };
export const NimbleTextField = wrap(TextField, {
    events: {
        onChange: 'change' as EventName<TextFieldChangeEvent>,
        onInput: 'input' as EventName<TextFieldInputEvent>,
    }
});
export interface TextFieldChangeEvent extends CustomEvent {
    target: TextField;
}
export interface TextFieldInputEvent extends CustomEvent {
    target: TextField;
}
