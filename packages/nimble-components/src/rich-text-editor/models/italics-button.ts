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
        this.iconLabel = 'Italics';
        this.tiptapNodeOrMarkName = 'italic';
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
            // Return false to prevent the default behavior for the "Enter" and "space" key
            return false;
        }
        // Return true for other key values to allow default behavior, such as enabling navigation keys like "Tab" and arrow keys to take effect
        return true;
    }
}
