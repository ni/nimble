import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { Editor } from '@tiptap/core';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser,
    MarkdownSerializer,
    defaultMarkdownSerializer,
    MarkdownSerializerState
} from 'prosemirror-markdown';
import { DOMSerializer, Node } from 'prosemirror-model';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
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
     * @internal
     */
    @observable
    public boldButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public italicsButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public bulletListButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public numberedListButton!: ToggleButton;

    /**
     * @internal
     */
    public editorContainer!: HTMLDivElement;

    private tiptapEditor!: Editor;
    private editor!: HTMLDivElement;

    private readonly markdownParser = this.initializeMarkdownParser();
    private readonly markdownSerializer = this.initializeMarkdownSerializer();
    private readonly domSerializer = DOMSerializer.fromSchema(schema);
    private readonly xmlSerializer = new XMLSerializer();

    public constructor() {
        super();
        this.initializeEditor();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        if (!this.editor.isConnected) {
            this.editorContainer.append(this.editor);
        }
        this.bindEditorTransactionEvent();
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.unbindEditorTransactionEvent();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleBold().run();
        this.focusEditorInFirefoxEnv();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleBold().run();
            this.focusEditorInFirefoxEnv();
            return false;
        }
        return true;
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleItalic().run();
        this.focusEditorInFirefoxEnv();
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleItalic().run();
            this.focusEditorInFirefoxEnv();
            return false;
        }
        return true;
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleBulletList().run();
        this.focusEditorInFirefoxEnv();
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleBulletList().run();
            this.focusEditorInFirefoxEnv();
            return false;
        }
        return true;
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleOrderedList().run();
        this.focusEditorInFirefoxEnv();
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleOrderedList().run();
            this.focusEditorInFirefoxEnv();
            return false;
        }
        return true;
    }

    /**
     * This function load tip tap editor with provided markdown content by parsing into html
     * @public
     */
    public setMarkdown(markdown: string): void {
        const html = this.getHtmlContent(markdown);
        this.tiptapEditor.commands.setContent(html);
    }

    /**
     * This function returns markdown string by serializing tiptap editor document using prosemirror MarkdownSerializer
     * @public
     */
    public getMarkdown(): string {
        const markdownContent = this.markdownSerializer.serialize(
            this.tiptapEditor.state.doc
        );
        return markdownContent;
    }

    /**
     * @internal
     */
    public stopEventPropagation(event: Event): boolean {
        // Don't bubble the 'change' event from the toggle button because
        // all the formatting button has its own 'toggle' event through 'click' and 'keydown'.
        event.stopPropagation();
        return false;
    }

    /**
     * This function takes the Fragment from parseMarkdownToDOM function and return the serialized string using XMLSerializer
     */
    private getHtmlContent(markdown: string): string {
        const documentFragment = this.parseMarkdownToDOM(markdown);
        return this.xmlSerializer.serializeToString(documentFragment);
    }

    private initializeMarkdownParser(): MarkdownParser {
        /**
         * It configures the tokenizer of the default Markdown parser with the 'zero' preset.
         * The 'zero' preset is a configuration with no rules enabled by default to selectively enable specific rules.
         * https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/presets/zero.js#L1
         *
         */
        const zeroTokenizerConfiguration = defaultMarkdownParser.tokenizer.configure('zero');

        // The detailed information of the supported rules were provided in the below CommonMark spec document.
        // https://spec.commonmark.org/0.30/
        const supportedTokenizerRules = zeroTokenizerConfiguration.enable([
            'emphasis',
            'list'
        ]);

        return new MarkdownParser(
            schema,
            supportedTokenizerRules,
            defaultMarkdownParser.tokens
        );
    }

    private initializeMarkdownSerializer(): MarkdownSerializer {
        /**
         * orderedList Node is getting 'order' attribute which it is not present in the
         * tip-tap orderedList Node and having start instead of order, Changed it to start (nodes.attrs.start)
         * Assigned updated node in place of orderedList node from defaultMarkdownSerializer
         * https://github.com/ProseMirror/prosemirror-markdown/blob/b7c1fd2fb74c7564bfe5428c7c8141ded7ebdd9f/src/to_markdown.ts#L94C2-L101C7
         */
        const orderedListNode = function orderedList(
            state: MarkdownSerializerState,
            node: Node
        ): void {
            const start = (node.attrs.start as number) || 1;
            const maxW = String(start + node.childCount - 1).length;
            const space = state.repeat(' ', maxW + 2);
            state.renderList(node, space, i => {
                const nStr = String(start + i);
                return `${state.repeat(' ', maxW - nStr.length) + nStr}. `;
            });
        };

        /**
         * Internally Tiptap editor creates it own schema ( Nodes AND Marks ) based on the extensions ( Here Starter Kit is used for Bold, italic, orderedList and
         * bulletList extensions) and defaultMarkdownSerializer uses schema from prosemirror-markdown to serialize the markdown.
         * So, there is variations in the nodes and marks name (Eg. 'ordered_list' in prosemirror-markdown schema whereas 'orderedList' in tip tap editor schema),
         * To fix up this reassigned the respective nodes and marks with tip-tap editor schema.
         */
        const nodes = {
            bulletList: defaultMarkdownSerializer.nodes.bullet_list!,
            listItem: defaultMarkdownSerializer.nodes.list_item!,
            orderedList: orderedListNode,
            doc: defaultMarkdownSerializer.nodes.doc!,
            paragraph: defaultMarkdownSerializer.nodes.paragraph!,
            text: defaultMarkdownSerializer.nodes.text!
        };
        const marks = {
            italic: defaultMarkdownSerializer.marks.em!,
            bold: defaultMarkdownSerializer.marks.strong!
        };
        return new MarkdownSerializer(nodes, marks);
    }

    private parseMarkdownToDOM(value: string): HTMLElement | DocumentFragment {
        const parsedMarkdownContent = this.markdownParser.parse(value);
        if (parsedMarkdownContent === null) {
            return document.createDocumentFragment();
        }

        return this.domSerializer.serializeFragment(
            parsedMarkdownContent.content
        );
    }

    private initializeEditor(): void {
        // Create div from the constructor because the TipTap editor requires its host element before the template is instantiated.
        this.editor = document.createElement('div');
        this.editor.className = 'editor';
        this.editor.setAttribute('aria-multiline', 'true');
        this.editor.setAttribute('role', 'textbox');

        /**
         * For more information on the extensions for the supported formatting options, refer to the links below.
         * Tiptap marks: https://tiptap.dev/api/marks
         * Tiptap nodes: https://tiptap.dev/api/nodes
         */
        this.tiptapEditor = new Editor({
            element: this.editor,
            extensions: [
                Document,
                Paragraph,
                Text,
                BulletList,
                OrderedList,
                ListItem,
                Bold,
                Italic,
                History
            ]
        });
    }

    /**
     * Binding the "transaction" event to the editor allows continuous monitoring the events and updating the button state in response to
     * various actions such as mouse events, keyboard events, changes in the editor content etc,.
     * https://tiptap.dev/api/events#transaction
     */
    private bindEditorTransactionEvent(): void {
        this.tiptapEditor.on('transaction', () => {
            this.updateEditorButtonsState();
        });
    }

    private unbindEditorTransactionEvent(): void {
        this.tiptapEditor.off('transaction');
    }

    private updateEditorButtonsState(): void {
        this.boldButton.checked = this.tiptapEditor.isActive('bold');
        this.italicsButton.checked = this.tiptapEditor.isActive('italic');
        this.bulletListButton.checked = this.tiptapEditor.isActive('bulletList');
        this.numberedListButton.checked = this.tiptapEditor.isActive('orderedList');
    }

    private keyActivatesButton(event: KeyboardEvent): boolean {
        switch (event.key) {
            case keySpace:
            case keyEnter:
                return true;
            default:
                return false;
        }
    }

    // In Firefox browser, Once the editor gets focused, the blinking caret will be visible until we click format buttons (Bold, Italic ...) in the Firefox browser (Changing focus).
    // But once the any of the buttons clicked, the editor internally has its focus but the blinking caret disappears.
    // As a workaround, manually triggering blur and setting focus on editor will hepls making the caret re-appears.
    // It seems like this issue in not fixed in firefox browser yet, Created Issue https://github.com/ni/nimble/issues/1454 tracks removal of this workaround.
    private focusEditorInFirefoxEnv(): void {
        const browserInfo = navigator.userAgent;
        if (browserInfo.includes('Firefox')) {
            this.tiptapEditor.commands.blur();
            this.tiptapEditor.commands.focus();
        }
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
