import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { EditorButton } from './editor-button';
import { iconListTag } from '../../icons/list';

/**
 * Derived class from EditorButton for handling bullet list button events.
 */
export class BulletListButton extends EditorButton {
    public constructor(public override tiptapEditor: Editor) {
        super(tiptapEditor);
        this.class = 'bullet-list';
        this.iconLabel = 'Bullet List';
        this.tiptapNodeOrMarkName = 'bulletList';
        this.iconTemplate = html`<${iconListTag} slot="start"></${iconListTag}>`;
    }

    public override clickHandler(): void {
        super.clickHandler();
        this.tiptapEditor.commands.toggleBulletList();
    }

    public override keyDownActivateHandler(event: KeyboardEvent): boolean {
        const isDesiredKeyDownForToggle = super.keyDownActivateHandler(event);
        if (isDesiredKeyDownForToggle) {
            this.tiptapEditor.commands.toggleBulletList();
            // Return false to prevent the default behavior for the "Enter" and "space" key
            return false;
        }
        // Return true for other key values to allow default behavior, such as enabling navigation keys like "Tab" and arrow keys to take effect
        return true;
    }
}
