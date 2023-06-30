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
    public set markdownValue(value: string) {
        this._markdownValue = value;
        this.serializedContent = this.parseMarkdownToDOM(value);
    }

    /**
     * @public
     * @remarks
     * Accessor: gets the raw markdown string.
     */
    public get markdownValue(): string {
        return this._markdownValue;
    }

    public serializedContent?: HTMLElement | DocumentFragment;
    private _markdownValue = '';

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.appendSerializedContentToViewer();
    }

    /**
     *
     * This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     *
     * @internal
     */
    public parseMarkdownToDOM(value: string): HTMLElement | DocumentFragment {
        const serializer = DOMSerializer.fromSchema(schema);

        /**
         * It configures the tokenizer of the default Markdown parser with the 'zero' preset.
         * The 'zero' preset is a configuration with no rules enabled by default to selectively enable specific rules.
         * https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js#L1
         *
         */
        const zeroTokenizerConfiguration = defaultMarkdownParser.tokenizer.configure('zero');
        const supportedTokenizerRules = zeroTokenizerConfiguration.enable([
            'emphasis',
            'list',
            'autolink'
        ]);

        const parser = new MarkdownParser(
            schema,
            supportedTokenizerRules,
            defaultMarkdownParser.tokens
        );
        return serializer.serializeFragment(parser.parse(value)!.content);
    }

    private appendSerializedContentToViewer(): void {
        const viewer = this.shadowRoot?.querySelector('#viewer');
        if (viewer && this.serializedContent) {
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
