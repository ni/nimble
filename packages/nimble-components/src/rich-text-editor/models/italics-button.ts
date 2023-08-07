import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { EditorButton } from './editor-button';
import { iconItalicITag } from '../../icons/italic-i';

/**
 * Derived class from EditorButton for handling italics button events.
 */
export class ItalicsButton extends EditorButton {
    public constructor(public override tiptapEditor: Editor) {
        super(tiptapEditor);
        this.class = 'italics';
        this.iconLabel = 'italics';
        this.tiptapName = 'italic';
        this.iconTemplate = html`<${iconItalicITag} slot="start"></${iconItalicITag}>`;
    }

    public override clickHandler(): void {
        super.clickHandler();
        this.tiptapEditor.commands.toggleItalic();
    }

    public override keyDownActivateHandler(event: KeyboardEvent): boolean {
        const isDesiredKeyDownForToggle = super.keyDownActivateHandler(event);
        if (isDesiredKeyDownForToggle) {
            this.tiptapEditor.commands.toggleItalic();
            return false;
        }
        return true;
    }
}
