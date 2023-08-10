import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser,
    MarkdownSerializer,
    defaultMarkdownSerializer,
    MarkdownSerializerState
} from 'prosemirror-markdown';
import { DOMSerializer, Node } from 'prosemirror-model';
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
    public editor!: HTMLDivElement;

    private tiptapEditor!: Editor;

    private readonly markdownParser: MarkdownParser;
    private readonly markdownSerializer: MarkdownSerializer;
    private readonly domSerializer: DOMSerializer;
    private readonly xmlSerializer: XMLSerializer;

    public constructor() {
        super();
        this.domSerializer = DOMSerializer.fromSchema(schema);
        this.xmlSerializer = new XMLSerializer();
        this.markdownParser = this.initializeMarkdownParser();
        this.markdownSerializer = this.initializeMarkdownSerializer();
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
        this.unbindEditorTransactionEvent();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleBold().run();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonKeyDown(e: KeyboardEvent): boolean {
        if (this.isDesiredKeyDownForButton(e)) {
            this.tiptapEditor.chain().focus().toggleBold().run();
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
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonKeyDown(e: KeyboardEvent): boolean {
        if (this.isDesiredKeyDownForButton(e)) {
            this.tiptapEditor.chain().focus().toggleItalic().run();
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
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonKeyDown(e: KeyboardEvent): boolean {
        if (this.isDesiredKeyDownForButton(e)) {
            this.tiptapEditor.chain().focus().toggleBulletList().run();
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
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonKeyDown(e: KeyboardEvent): boolean {
        if (this.isDesiredKeyDownForButton(e)) {
            this.tiptapEditor.chain().focus().toggleOrderedList().run();
            return false;
        }
        return true;
    }

    /**
     * This function load tip tap editor with provided markdown content by parsing into html
     */
    public setMarkdown(value: string): void {
        if (this.$fastController.isConnected) {
            const htmlConvertedContent = this.getHtmlContent(value);
            this.tiptapEditor.commands.setContent(htmlConvertedContent);
            this.tiptapEditor.commands.focus();
        }
    }

    /**
     * This function returns markdown string by serializing tiptap editor document using prosemirror MarkdownSerializer
     */
    public getMarkdown(): string {
        if (this.$fastController.isConnected) {
            const markdownContent = this.markdownSerializer.serialize(
                this.tiptapEditor.state.doc
            );
            return markdownContent;
        }
        return '';
    }

    /**
     * This function takes the Fragment from parseMarkdownToDOM function and return the serialized string using XMLSerializer
     */
    private getHtmlContent(value: string): string {
        const markdownDocumentFragment = this.parseMarkdownToDOM(value);
        return this.xmlSerializer.serializeToString(markdownDocumentFragment);
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
         * Setting the escape argument as false to skip esc method under MarkdownSerializerState as regExpression
         * adding unnecessary slashes while serializing and not to affect text nodes.
         * https://github.com/ProseMirror/prosemirror-markdown/blob/b7c1fd2fb74c7564bfe5428c7c8141ded7ebdd9f/src/to_markdown.ts#L409C3-L417C4
         */
        const textNode = function text(
            state: MarkdownSerializerState,
            node: Node
        ): void {
            state.text(node.text!, false);
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
            text: textNode
        };
        const marks = {
            italic: defaultMarkdownSerializer.marks.em!,
            bold: defaultMarkdownSerializer.marks.strong!
        };
        return new MarkdownSerializer(nodes, marks);
    }

    /** This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     * If the markdown parser returns null, it will clear the editor component by creating an empty document fragment.
     */
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
                this.updateEditorButtonsState();
            });
        }
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

    private isDesiredKeyDownForButton(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keySpace:
            case keyEnter:
                return true;
            default:
                return false;
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
