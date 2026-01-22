import { TextArea, textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { textAreaTag };
export { type TextArea };
export const NimbleTextArea = wrap(TextArea, {
    events: {
        onChange: 'change' as EventName<TextAreaChangeEvent>,
        onInput: 'input' as EventName<TextAreaInputEvent>,
    }
});
export interface TextAreaChangeEvent extends CustomEvent {
    target: TextArea;
}
export interface TextAreaInputEvent extends CustomEvent {
    target: TextArea;
}
