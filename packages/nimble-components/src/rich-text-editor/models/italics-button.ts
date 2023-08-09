import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { ButtonProperties, EditorButton } from './editor-button';
import { iconItalicITag } from '../../icons/italic-i';

/**
 * Derived class from EditorButton for handling italics button events.
 */
export class ItalicsButton extends EditorButton {
    public constructor(tiptapEditor: Editor) {
        super(tiptapEditor);
    }

    protected doAction(): void {
        this.tiptapEditor.commands.toggleItalic();
    }

    protected getProperties(): ButtonProperties {
        return {
            class: 'italics',
            iconLabel: 'Italics',
            tiptapNodeOrMarkName: 'italic',
            iconTemplate: html`<${iconItalicITag} slot="start"></${iconItalicITag}>`
        };
    }
}
