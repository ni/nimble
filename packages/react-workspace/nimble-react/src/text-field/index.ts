import { TextField } from '@ni/nimble-components/dist/esm/text-field';
import { wrap } from '../utilities/react-wrapper';

export { type TextField };
export const NimbleTextField = wrap(TextField, {
    events: {
        onChange: 'change',
        onInput: 'input',
    }
});
export interface TextFieldChangeEvent extends CustomEvent {
    target: TextField;
}
export interface TextFieldInputEvent extends CustomEvent {
    target: TextField;
}
