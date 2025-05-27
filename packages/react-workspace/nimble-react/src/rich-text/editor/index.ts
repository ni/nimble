import { RichTextEditor } from '@ni/nimble-components/dist/esm/rich-text/editor';
import { wrap } from '../../utilities/react-wrapper';

export { type RichTextEditor };
export const NimbleRichTextEditor = wrap(RichTextEditor, {
    events: {
        onInput: 'input',
    }
});
export interface RichTextEditorInputEvent extends CustomEvent {
    target: RichTextEditor;
}
