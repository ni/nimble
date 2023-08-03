import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { template } from './template';
import { styles } from './styles';
import type { ToggleButton } from '../toggle-button';
import { BoldButton } from './models/bold-button';
import { ItalicsButton } from './models/italics-button';
import { NumberedListButton } from './models/numbered-list-button';
import { BulletListButton } from './models/bullet-list-button copy';

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
     * @internal
     */
    @observable
    public bold!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public italics!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public bulletList!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public numberedList!: ToggleButton;

    /**
     * @internal
     */
    public editor!: HTMLDivElement;

    private tiptapEditor!: Editor;
    private readonly boldButton: BoldButton;
    private readonly italicsButton: ItalicsButton;
    private readonly bulletListButton: BulletListButton;
    private readonly numberedListButton: NumberedListButton;

    public constructor() {
        super();
        this.boldButton = new BoldButton();
        this.italicsButton = new ItalicsButton();
        this.bulletListButton = new BulletListButton();
        this.numberedListButton = new NumberedListButton();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeEditor();
        this.bindEditorTransactionEvent();
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.tiptapEditor.off('transaction');
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonClickHandler(): void {
        this.boldButton.clickHandler(this.tiptapEditor);
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonKeyDownHandler(e: KeyboardEvent): boolean {
        return this.boldButton.keyDownActivateHandler(this.tiptapEditor, e);
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonClickHandler(): void {
        this.italicsButton.clickHandler(this.tiptapEditor);
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonKeyDownHandler(e: KeyboardEvent): boolean {
        return this.italicsButton.keyDownActivateHandler(this.tiptapEditor, e);
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonClickHandler(): void {
        this.bulletListButton.clickHandler(this.tiptapEditor);
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonKeyDownHandler(e: KeyboardEvent): boolean {
        return this.bulletListButton.keyDownActivateHandler(
            this.tiptapEditor,
            e
        );
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonClickHandler(): void {
        this.numberedListButton.clickHandler(this.tiptapEditor);
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonKeyDownHandler(e: KeyboardEvent): boolean {
        return this.numberedListButton.keyDownActivateHandler(
            this.tiptapEditor,
            e
        );
    }

    private initializeEditor(): void {
        if (this.$fastController.isConnected) {
            const extensions = [
                /**
                 * Tiptap starter-kit provides the basic formatting options such as bold, italics, lists etc,. along with some necessary nodes and extensions.
                 * https://tiptap.dev/api/extensions/starter-kit
                 * Disabled other not supported marks and nodes for the initial pass.
                 */
                StarterKit.configure({
                    blockquote: false,
                    code: false,
                    codeBlock: false,
                    hardBreak: false,
                    heading: false,
                    horizontalRule: false,
                    strike: false
                })
            ];

            this.tiptapEditor = new Editor({
                element: this.editor,
                extensions
            });
        }
    }

    /**
     * Binding the "transaction" event to the editor allows continuous monitoring the events and updating the button state in response to
     * various actions such as mouse events, keyboard events, changes in the editor content etc,.
     * https://tiptap.dev/api/events#transaction
     */
    private bindEditorTransactionEvent(): void {
        if (this.$fastController.isConnected) {
            this.tiptapEditor.on('transaction', () => {
                this.updateTipTapButtonState();
            });
        }
    }

    private updateTipTapButtonState(): void {
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
