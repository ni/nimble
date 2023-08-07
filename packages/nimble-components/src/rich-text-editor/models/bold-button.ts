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
        this.iconLabel = 'bold';
        this.tiptapName = 'bold';
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
            return false;
        }
        return true;
    }
}
