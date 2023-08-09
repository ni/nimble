import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { ButtonProperties, EditorButton } from './editor-button';
import { iconNumberListTag } from '../../icons/number-list';

/**
 * Derived class from EditorButton for handling numbered list button events.
 */
export class NumberedListButton extends EditorButton {
    public constructor(tiptapEditor: Editor) {
        super(tiptapEditor);
    }

    protected doAction(): void {
        this.tiptapEditor.commands.toggleOrderedList();
    }

    protected getProperties(): ButtonProperties {
        return {
            class: 'numbered-list',
            iconLabel: 'Numbered List',
            tiptapNodeOrMarkName: 'orderedList',
            iconTemplate: html`<${iconNumberListTag} slot="start"></${iconNumberListTag}>`
        };
    }
}
