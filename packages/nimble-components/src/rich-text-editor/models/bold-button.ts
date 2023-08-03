import type { Editor } from '@tiptap/core';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { EditorButton } from './editor-button';

/**
 * Derived class from EditorButton for handling bold button events.
 */
export class BoldButton extends EditorButton {
    public override clickHandler(tiptapEditor: Editor): void {
        super.clickHandler(tiptapEditor);
        tiptapEditor.commands.toggleBold();
    }

    public override keyDownActivateHandler(
        tiptapEditor: Editor,
        event: KeyboardEvent
    ): boolean {
        super.keyDownActivateHandler(tiptapEditor, event);
        switch (event.key) {
            case keySpace:
            case keyEnter:
                tiptapEditor.commands.toggleBold();
                return false;
            default:
                return true;
        }
    }
}
