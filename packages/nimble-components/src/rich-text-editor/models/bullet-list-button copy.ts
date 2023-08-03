import type { Editor } from '@tiptap/core';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { EditorButton } from './editor-button';

/**
 * Derived class from EditorButton for handling bullet list button events.
 */
export class BulletListButton extends EditorButton {
    public override clickHandler(tiptapEditor: Editor): void {
        super.clickHandler(tiptapEditor);
        tiptapEditor.commands.toggleBulletList();
    }

    public override keyDownActivateHandler(
        tiptapEditor: Editor,
        event: KeyboardEvent
    ): boolean {
        super.keyDownActivateHandler(tiptapEditor, event);
        switch (event.key) {
            case keySpace:
            case keyEnter:
                tiptapEditor.commands.toggleBulletList();
                return false;
            default:
                return true;
        }
    }
}
