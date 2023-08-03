import type { Editor } from '@tiptap/core';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { EditorButton } from './editor-button';

/**
 * Derived class from EditorButton for handling italics button events.
 */
export class ItalicsButton extends EditorButton {
    public override clickHandler(tiptapEditor: Editor): void {
        super.clickHandler(tiptapEditor);
        tiptapEditor.commands.toggleItalic();
    }

    public override keyDownActivateHandler(
        tiptapEditor: Editor,
        event: KeyboardEvent
    ): boolean {
        super.keyDownActivateHandler(tiptapEditor, event);
        switch (event.key) {
            case keySpace:
            case keyEnter:
                tiptapEditor.commands.toggleItalic();
                return false;
            default:
                return true;
        }
    }
}
