import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer } from 'prosemirror-model';
import { attr } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-viewer': RichTextViewer;
    }
}

/**
 * A nimble styled rich text viewer
 */
export class RichTextViewer extends FoundationElement {
    /**
     * Whether to grow the height of the component to fit the content.
     *
     * @public
     * @remarks
     * HTML Attribute: fit-to-content
     */
    @attr({ attribute: 'fit-to-content', mode: 'boolean' })
    public fitToContent = false;

    /**
     * @public
     * @remarks
     * Accessor: uses the parsing logic to convert the input markdown string to render in the component.
     */
    public set markdownValue(value: string) {
        this._markdownValue = value;
        this.serializedContent = this.parseMarkdownToDOM(value);
        this.appendSerializedContentToViewer();
    }

    /**
     * @public
     * @remarks
     * Accessor: gets the raw markdown string.
     */
    public get markdownValue(): string {
        return this._markdownValue;
    }

    private _markdownValue = '';
    private serializedContent?: HTMLElement | DocumentFragment;
    private readonly markdownParser: MarkdownParser;
    private readonly domSerializer: DOMSerializer;

    public constructor() {
        super();
        this.domSerializer = DOMSerializer.fromSchema(schema);
        this.markdownParser = this.initializeMarkdownParser();
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.appendSerializedContentToViewer();
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

    private appendSerializedContentToViewer(): void {
        const viewer = this.shadowRoot?.querySelector('#viewer');
        if (viewer && this.serializedContent) {
            viewer.innerHTML = '';
            viewer.appendChild(this.serializedContent.cloneNode(true));
        }
    }
}

const nimbleRichTextViewer = RichTextViewer.compose({
    baseName: 'rich-text-viewer',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextViewer());
export const richTextViewerTag = DesignSystem.tagFor(RichTextViewer);
