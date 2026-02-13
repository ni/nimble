import { RichTextEditor, richTextEditorTag } from '@ni/nimble-components/dist/esm/rich-text/editor';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { richTextEditorTag };
export { type RichTextEditor };
export const NimbleRichTextEditor = wrap(RichTextEditor, {
    events: {
        onInput: 'input' as EventName<RichTextEditorInputEvent>,
    }
});
export interface RichTextEditorInputEvent extends CustomEvent {
    target: RichTextEditor;
}
