import type { Editor } from '@tiptap/core';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import type { ViewTemplate } from '@microsoft/fast-element';

/**
 * Base class for handling editor button events.
 */
export class EditorButton {
    public class!: string;
    public iconLabel!: string;
    public tiptapName!: string;
    public iconTemplate!: ViewTemplate;

    public constructor(protected tiptapEditor: Editor) {}

    public clickHandler(): void {
        this.tiptapEditor.commands.focus();
    }

    public keyDownActivateHandler(event: KeyboardEvent): boolean {
        switch (event.key) {
            case keySpace:
            case keyEnter:
                this.tiptapEditor.commands.focus();
                return true;
            default:
                return false;
        }
    }
}
