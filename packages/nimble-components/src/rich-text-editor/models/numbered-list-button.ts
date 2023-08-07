import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { EditorButton } from './editor-button';
import { iconNumberListTag } from '../../icons/number-list';

/**
 * Derived class from EditorButton for handling numbered list button events.
 */
export class NumberedListButton extends EditorButton {
    public constructor(public override tiptapEditor: Editor) {
        super(tiptapEditor);
        this.class = 'numbered-list';
        this.iconLabel = 'Numbered List';
        this.tiptapNodeOrMarkName = 'orderedList';
        this.iconTemplate = html`<${iconNumberListTag} slot="start"></${iconNumberListTag}>`;
    }

    public override clickHandler(): void {
        super.clickHandler();
        this.tiptapEditor.commands.toggleOrderedList();
    }

    public override keyDownActivateHandler(event: KeyboardEvent): boolean {
        const isDesiredKeyDownForToggle = super.keyDownActivateHandler(event);
        if (isDesiredKeyDownForToggle) {
            this.tiptapEditor.commands.toggleOrderedList();
            // Return false to prevent the default behavior for the "Enter" and "space" key
            return false;
        }
        // Return true for other key values to allow default behavior, such as enabling navigation keys like "Tab" and arrow keys to take effect
        return true;
    }
}
