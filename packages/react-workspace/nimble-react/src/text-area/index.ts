import { TextArea } from '@ni/nimble-components/dist/esm/text-area';
import { wrap } from '../utilities/react-wrapper';

export const NimbleTextArea = wrap(TextArea, {
    events: {
        onChange: 'change',
        onInput: 'input',
    }
});

export interface TextAreaChangeEvent extends CustomEvent {
    target: TextArea;
}

export interface TextAreaInputEvent extends CustomEvent {
    target: TextArea;
}
