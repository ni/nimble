import type { Editor } from '@tiptap/core';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';

/**
 * Base class for handling editor button events.
 */
export class EditorButton {
    public clickHandler(tiptapEditor: Editor): void {
        tiptapEditor.commands.focus();
    }

    public keyDownActivateHandler(tiptapEditor: Editor, event: KeyboardEvent): void {
        switch (event.key) {
            case keySpace:
            case keyEnter:
                tiptapEditor.commands.focus();
                break;
            default:
                break;
        }
    }
}
