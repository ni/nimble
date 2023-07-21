import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
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
    /**
     * @public
     */
    @attr public placeholder = '';

    /**
     * @internal
     */
    @attr public footerVisibility = 'hidden';

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

        // this.setContent();
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

    /**
     * @public
     */
    public hideFooter(): void {
        this.footerVisibility = 'hidden';
    }

    /**
     * @public
     */
    public clearContent(): void {
        this.tiptapEditor.commands.clearContent();
    }

    private initializeEditor(): void {
        if (this.$fastController.isConnected) {
            const extensions = [
                StarterKit.configure({
                    heading: false, blockquote: false, hardBreak: false, code: false, horizontalRule: false, strike: false, codeBlock: false
                }),
                Link.configure({
                    openOnClick: true,
                    autolink: true,
                    linkOnPaste: false,
                    validate: href => /^\w+:/.test(href)
                }),
                Placeholder.configure({
                    placeholder: this.placeholder
                })
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

            this.tiptapEditor.on('focus', () => {
                this.footerVisibility = 'visible';
            });
        }
    }

    private toggleTipTapButtonState(): void {
        if (this.bold) {
            this.bold.checked = this.tiptapEditor.isActive('bold');
        }
        if (this.italics) {
            this.italics.checked = this.tiptapEditor.isActive('italic');
        }
        if (this.bulletList) {
            this.bulletList.checked = this.tiptapEditor.isActive('bulletList');
        }
        if (this.numberedList) {
            this.numberedList.checked = this.tiptapEditor.isActive('orderedList');
        }
    }

    private setContent(): void {
        this.tiptapEditor.commands.setContent('<p><em>Test</em></p>');
        this.tiptapEditor.commands.focus('end');
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
