import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer, Schema } from 'prosemirror-model';
import { anchorTag } from '../../anchor';
import type { MarkdownParserMentionConfiguration } from './markdown-parser-mention-configuration';

/**
 * Provides markdown parser for rich text components
 */
export class RichTextMarkdownParser {
    private static readonly updatedSchema = this.getCustomSchemaConfiguration();

    private static readonly markdownParser = this.initializeMarkdownParser();
    private static readonly domSerializer = DOMSerializer.fromSchema(
        this.updatedSchema
    );

    private static mentionsConfig?: MarkdownParserMentionConfiguration[];

    /**
     * This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     * If the markdown parser returns null, it will clear the viewer component by creating an empty document fragment.
     */
    public static parseMarkdownToDOM(
        value: string,
        markdownParserMentionConfig?: MarkdownParserMentionConfiguration[]
    ): HTMLElement | DocumentFragment {
        try {
            this.mentionsConfig = markdownParserMentionConfig;
            const parsedMarkdownContent = this.markdownParser.parse(value);
            if (parsedMarkdownContent === null) {
                return document.createDocumentFragment();
            }
            return this.domSerializer.serializeFragment(
                parsedMarkdownContent.content
            );
        } finally {
            this.mentionsConfig = undefined;
        }
    }

    private static initializeMarkdownParser(): MarkdownParser {
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
            'escape',
            'autolink',
            'newline'
        ]);

        /**
         * In order to display encoded characters, non-ASCII characters, emojis, and other special characters in their original form,
         * we bypass the default normalization of link text in markdown-it. This is done because we support only "AutoLink" feature in CommonMark flavor.
         * "normalizeLinkText" method reference in markdown-it: https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/index.js#L67C1-L86C2
         *
         * We can use the default normalization once hyperlink support is added.
         * See: https://github.com/ni/nimble/issues/1527
         */
        supportedTokenizerRules.normalizeLinkText = url => url;

        return new MarkdownParser(
            this.updatedSchema,
            supportedTokenizerRules,
            defaultMarkdownParser.tokens
        );
    }

    private static getCustomSchemaConfiguration(): Schema {
        return new Schema({
            nodes: schema.spec.nodes,
            marks: {
                link: {
                    attrs: {
                        href: {},
                        rel: { default: 'noopener noreferrer' }
                    },
                    // Inclusive can be updated when hyperlink support added
                    // See: https://github.com/ni/nimble/issues/1527
                    inclusive: false,
                    // Excludes can be removed/enabled when hyperlink support added
                    // See: https://github.com/ni/nimble/issues/1527
                    excludes: '_',
                    toDOM(node) {
                        const href = node.attrs.href as string;
                        let mentionId: string | undefined;
                        let displayName: string | undefined;
                        let viewElement: string | undefined;

                        const currentMention = RichTextMarkdownParser.mentionsConfig?.find(
                            mention => mention.regexPattern.test(href)
                        );

                        if (currentMention) {
                            mentionId = currentMention.extractMentionId(href);
                            displayName = currentMention.getDisplayName(href);
                            viewElement = currentMention.viewElement;
                        }

                        if (viewElement && (displayName || mentionId)) {
                            displayName = displayName ?? mentionId;
                            return [
                                viewElement,
                                {
                                    'mention-href': href,
                                    'mention-label': displayName,
                                    'disable-editing': 'true'
                                }
                            ];
                        }

                        return [
                            anchorTag,
                            {
                                // Absolute links whose scheme is not HTTP/HTTPS will render as anchor tag without `href` attribute
                                href: /^https?:\/\//i.test(href) ? href : null,
                                rel: node.attrs.rel as Attr
                            }
                        ];
                    }
                },
                em: schema.spec.marks.get('em')!,
                strong: schema.spec.marks.get('strong')!
            }
        });
    }
}
