import { html } from '@microsoft/fast-element';
import type { Editor } from '@tiptap/core';
import { ButtonProperties, EditorButton } from './editor-button';
import { iconListTag } from '../../icons/list';

/**
 * Derived class from EditorButton for handling bullet list button events.
 */
export class BulletListButton extends EditorButton {
    public constructor(tiptapEditor: Editor) {
        super(tiptapEditor);
    }

    protected doAction(): void {
        this.tiptapEditor.commands.toggleBulletList();
    }

    protected getProperties(): ButtonProperties {
        return {
            class: 'bullet-list',
            iconLabel: 'Bullet List',
            tiptapNodeOrMarkName: 'bulletList',
            iconTemplate: html`<${iconListTag} slot="start"></${iconListTag}>`
        };
    }
}
