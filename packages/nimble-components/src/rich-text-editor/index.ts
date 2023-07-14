import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { template } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
}

/**
 * A nimble styled rich text editor
 */
export class RichTextEditor extends FoundationElement {
    private editor: Editor | undefined;

    public constructor() {
        super();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeEditor();
    }

    private initializeEditor(): void {
        const editorWindowParentElement = this.shadowRoot?.querySelector('#editor');
        const extensions = [
            StarterKit.configure({
                heading: false, blockquote: false, hardBreak: false, code: false, horizontalRule: false, strike: false, codeBlock: false
            }),
        ];
        this.editor = new Editor({
            element: editorWindowParentElement!,
            extensions
        });
    }
}

const nimbleRichTextEditor = RichTextEditor.compose({
    baseName: 'rich-text-editor',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextEditor());
export const richTextEditorTag = DesignSystem.tagFor(RichTextEditor);
