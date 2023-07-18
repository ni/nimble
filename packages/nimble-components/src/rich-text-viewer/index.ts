import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer } from 'prosemirror-model';
import { observable } from '@microsoft/fast-element';
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
     * Markdown string to render its corresponding rich text content in the component.
     */
    @observable
    public markdown!: string;

    public viewer!: HTMLDivElement;
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

    public markdownChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
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

        // Disabling normalize which replaces the null character('\0') with the Unicode representation('\uFFFD') of Replacement Character(�)
        // https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/rules_core/normalize.js#L15
        supportedTokenizerRules.disable('normalize');

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
        const parsedMarkdownContent = this.markdownParser.parse(value);
        if (parsedMarkdownContent === null) {
            throw new Error(
                'Prosemirror markdown parser return value is possibly null'
            );
        }

        return this.domSerializer.serializeFragment(
            parsedMarkdownContent.content
        );
    }

    private updateView(): void {
        if (this.markdown) {
            const serializedContent = this.parseMarkdownToDOM(this.markdown);
            this.viewer.replaceChildren(serializedContent);
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
