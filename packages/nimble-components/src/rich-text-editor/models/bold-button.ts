import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { ButtonInitializers, EditorButton } from './editor-button';
import { iconBoldBTag } from '../../icons/bold-b';

/**
 * Derived class from EditorButton for handling bold button events.
 */
export class BoldButton extends EditorButton {
    public constructor(tiptapEditor: Editor) {
        super(tiptapEditor);
    }

    protected doAction(): void {
        this.tiptapEditor.commands.toggleBold();
    }

    protected getInitializers(): ButtonInitializers {
        return {
            class: 'bold',
            iconLabel: 'Bold',
            tiptapNodeOrMarkName: 'bold',
            iconTemplate: html`<${iconBoldBTag} slot="start"></${iconBoldBTag}>`
        };
    }
}
