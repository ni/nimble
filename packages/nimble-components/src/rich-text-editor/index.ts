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
import { BulletListButton } from './models/bullet-list-button';
import type { EditorButton } from './models/editor-button';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
}

/**
 * A nimble styled rich text editor
 */
export class RichTextEditor extends FoundationElement {
    @observable
    public editorButtons: EditorButton[] = [];

    @observable
    public childButtonRefs: ToggleButton[] = [];

    /**
     * @internal
     */
    public editor!: HTMLDivElement;

    private tiptapEditor!: Editor;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeEditor();
        this.initializeButtons();
        this.bindEditorTransactionEvent();
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.unbindEditorTransactionEvent();
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

    private initializeButtons(): void {
        if (this.$fastController.isConnected) {
            this.editorButtons.push(new BoldButton(this.tiptapEditor));
            this.editorButtons.push(new ItalicsButton(this.tiptapEditor));
            this.editorButtons.push(new BulletListButton(this.tiptapEditor));
            this.editorButtons.push(new NumberedListButton(this.tiptapEditor));
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

    private unbindEditorTransactionEvent(): void {
        this.tiptapEditor.off('transaction');
    }

    private updateTipTapButtonState(): void {
        if (this.childButtonRefs.length > 0) {
            this.editorButtons.forEach(button => {
                const buttonToUpdate = this.childButtonRefs.find(childButton => childButton.classList.contains(button.class));
                this.updateButtonCheckedState(
                    buttonToUpdate,
                    button.tiptapName
                );
            });
        }
        // else do nothing
    }

    private updateButtonCheckedState(
        button: ToggleButton | undefined,
        name: string
    ): void {
        if (button) {
            button.checked = this.tiptapEditor.isActive(name);
        }
        // else do nothing
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
