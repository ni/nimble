import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer } from 'prosemirror-model';
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
     * @public
     * @remarks
     * Accessor: uses the parsing logic to convert the input markdown string to render in the component.
     */
    public set markdown(value: string) {
        this._markdown = value;
        this.serializedContent = this.parseMarkdownToDOM(value);
        this.updateView();
    }

    /**
     * @public
     * @remarks
     * Accessor: gets the raw markdown string.
     */
    public get markdown(): string {
        return this._markdown;
    }

    private _markdown = '';
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
        this.updateView();
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

    private updateView(): void {
        const viewer = this.shadowRoot?.querySelector('.viewer');
        if (viewer && this.serializedContent) {
            viewer.replaceChildren(this.serializedContent.cloneNode(true));
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
