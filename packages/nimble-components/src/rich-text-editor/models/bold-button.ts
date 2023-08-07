import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { EditorButton } from './editor-button';
import { iconBoldBTag } from '../../icons/bold-b';

/**
 * Derived class from EditorButton for handling bold button events.
 */
export class BoldButton extends EditorButton {
    public constructor(public override tiptapEditor: Editor) {
        super(tiptapEditor);
        this.class = 'bold';
        this.iconLabel = 'Bold';
        this.tiptapNodeOrMarkName = 'bold';
        this.iconTemplate = html`<${iconBoldBTag} slot="start"></${iconBoldBTag}>`;
    }

    public override clickHandler(): void {
        super.clickHandler();
        this.tiptapEditor.commands.toggleBold();
    }

    public override keyDownActivateHandler(event: KeyboardEvent): boolean {
        const isDesiredKeyDownForToggle = super.keyDownActivateHandler(event);
        if (isDesiredKeyDownForToggle) {
            this.tiptapEditor.commands.toggleBold();
            // Return false to prevent the default behavior for the "Enter" and "space" key
            return false;
        }
        // Return true for other key values to allow default behavior, such as enabling navigation keys like "Tab" and arrow keys to take effect
        return true;
    }
}
