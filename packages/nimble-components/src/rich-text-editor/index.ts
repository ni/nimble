import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { template } from './template';
import { styles } from './styles';
import type { ToggleButton } from '../toggle-button';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
}

/**
 * A nimble styled rich text editor
 */
export class RichTextEditor extends FoundationElement {
    public editor!: HTMLDivElement;
    public bold!: ToggleButton;
    public italics!: ToggleButton;
    public bulletList!: ToggleButton;
    public numberedList!: ToggleButton;
    private tiptapEditor!: Editor;

    public constructor() {
        super();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeEditor();
        this.changeEventTrigger();
    }

    public boldButtonClickHandler(): void {
        this.tiptapEditor.chain().focus().toggleBold().run();
    }

    public italicButtonClickHandler(): void {
        this.tiptapEditor.chain().focus().toggleItalic().run();
    }

    public bulletListButtonClickHandler(): void {
        this.tiptapEditor.chain().focus().toggleBulletList().run();
    }

    public numberedListButtonClickHandler(): void {
        this.tiptapEditor.chain().focus().toggleOrderedList().run();
    }

    private initializeEditor(): void {
        if (this.$fastController.isConnected) {
            const extensions = [
                StarterKit.configure({
                    heading: false, blockquote: false, hardBreak: false, code: false, horizontalRule: false, strike: false, codeBlock: false
                }),
            ];
            this.tiptapEditor = new Editor({
                element: this.editor,
                extensions
            });
        }
    }

    private changeEventTrigger(): void {
        if (this.$fastController.isConnected) {
            this.tiptapEditor.on('transaction', () => {
                this.toggleTipTapButtonState();
            });
        }
    }

    private toggleTipTapButtonState(): void {
        this.bold.checked = this.tiptapEditor.isActive('bold');
        this.italics.checked = this.tiptapEditor.isActive('italic');
        this.bulletList.checked = this.tiptapEditor.isActive('bulletList');
        this.numberedList.checked = this.tiptapEditor.isActive('orderedList');
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
