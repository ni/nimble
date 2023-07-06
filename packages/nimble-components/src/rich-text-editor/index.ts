import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer } from 'prosemirror-model';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
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
    /**
     * @public
     * @remarks
     * Accessor: uses the parsing logic to convert the input markdown string to render in the component.
     */
    public set markdownValue(value: string) {
        this._markdownValue = value;
        this.serializedContent = this.parseMarkdownToDOM(value);
        // this.appendSerializedContentToEditor();
    }

    /**
     * @public
     * @remarks
     * Accessor: gets the raw markdown string.
     */
    public get markdownValue(): string {
        return this._markdownValue;
    }

    public editor: Editor;
    private _markdownValue = '';
    private serializedContent?: HTMLElement | DocumentFragment;
    private readonly markdownParser: MarkdownParser;
    private readonly domSerializer: DOMSerializer;

    public constructor() {
        super();
        this.domSerializer = DOMSerializer.fromSchema(schema);
        this.markdownParser = this.initializeMarkdownParser();
        this.editor = this.initializeEditor();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.editor = this.initializeEditor();
        // this.appendSerializedContentToEditor();
    }

    private initializeEditor(): Editor {
        const editorWindowParentElement = this.shadowRoot?.querySelector('#editor');
        return new Editor({
            element: editorWindowParentElement!,
            extensions: [
                StarterKit.configure({
                    heading: false, blockquote: false, hardBreak: false, code: false, horizontalRule: false, strike: false
                }),
                Link.configure({
                    openOnClick: true,
                    autolink: false,
                    linkOnPaste: false,
                    // validate: href => /^https?:\/\//.test(href)
                }),
            ]
        });
    }

    private initializeMarkdownParser(): MarkdownParser {
        /**
         * It configures the tokenizer of the default Markdown parser with the 'zero' preset.
         * The 'zero' preset is a configuration with no rules enabled by default to selectively enable specific rules.
         * https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js#L1
         *
         */
        const zeroTokenizerConfiguration = defaultMarkdownParser.tokenizer.configure('zero');

        // The detailed information of the supported rules were provided in the below CommonMark spec document.
        // https://spec.commonmark.org/0.30/
        const supportedTokenizerRules = zeroTokenizerConfiguration.enable([
            'emphasis',
            'list',
            'autolink'
        ]);

        return new MarkdownParser(
            schema,
            supportedTokenizerRules,
            defaultMarkdownParser.tokens
        );
    }

    /**
     *
     * This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     *
     */
    private parseMarkdownToDOM(value: string): HTMLElement | DocumentFragment {
        return this.domSerializer.serializeFragment(
            this.markdownParser.parse(value)!.content
        );
    }

    private appendSerializedContentToEditor(): void {
        const editor = this.shadowRoot?.querySelector('#editor');
        if (editor && this.serializedContent) {
            editor.innerHTML = '';
            editor.appendChild(this.serializedContent.cloneNode(true));
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
