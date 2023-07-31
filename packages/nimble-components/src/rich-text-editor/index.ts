import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
     * @public
     */
    @attr({ attribute: 'footer-hidden', mode: 'boolean' })
    public footerHidden = false;

    /**
     * Whether to display the error state.
     *
     * @public
     * @remarks
     * HTML Attribute: error-visible
     */
    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    /**
     * @public
     */
    @attr({ attribute: 'disabled', mode: 'boolean' })
    public disabled = false;

    /**
     * @public
     */
    @attr({ attribute: 'fit-to-content', mode: 'boolean' })
    public fitToContent = false;

    /**
     * @public
     */
    public get empty(): boolean {
        return this.tiptapEditor.isEmpty;
    }

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
        this.bindEditorTransactionEvent();
        this.bindEditorUpdateEvent();
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.tiptapEditor.off('transaction');
        this.tiptapEditor.off('update');
    }

    public disabledChanged(): void {
        if (this.$fastController.isConnected) {
            this.tiptapEditor.options.editable = !this.disabled;
        }
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
                Placeholder.configure({
                    placeholder: this.placeholder,
                    showOnlyWhenEditable: false
                })
            ];

            this.tiptapEditor = new Editor({
                element: this.editor,
                extensions,
                editable: !this.disabled
            });
        }
    }

    private bindEditorTransactionEvent(): void {
        if (this.$fastController.isConnected) {
            this.tiptapEditor.on('transaction', () => {
                this.toggleTipTapButtonState();
            });
        }
    }

    private bindEditorUpdateEvent(): void {
        if (this.$fastController.isConnected) {
            this.tiptapEditor.on('update', () => {
                this.$emit('input');
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
