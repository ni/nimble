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

    /**
     * The markdown parser is static (shared across all rich text components) because it is expensive to create.
     * To configure parse calls with the mention configurations which can be unique per component instance
     * we store static configuration in this member and access it from Prosemirror callbacks.
     */
    private static mentionConfigs?: MarkdownParserMentionConfiguration[];

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
            this.mentionConfigs = markdownParserMentionConfig;
            const parsedMarkdownContent = this.markdownParser.parse(value);
            if (parsedMarkdownContent === null) {
                return document.createDocumentFragment();
            }
            return this.domSerializer.serializeFragment(
                parsedMarkdownContent.content
            );
        } finally {
            this.mentionConfigs = undefined;
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
                        const currentMention = RichTextMarkdownParser.mentionConfigs?.find(
                            mention => mention.isValidMentionHref(href)
                        );
                        const displayName = currentMention?.getDisplayName(href);

                        if (currentMention && displayName) {
                            return [
                                currentMention.viewElement,
                                {
                                    'mention-href': href,
                                    'mention-label': displayName,
                                    'disable-editing': true
                                }
                            ];
                        }

                        return [
                            anchorTag,
                            {
                                /**
                                 * Both mention and absolute link markdown share the autolink format in CommonMark flavor.
                                 * Absolute links with HTTP/HTTPS will be rendered as links. Absolute links that match the
                                 * mention pattern will be rendered as mention view element. Absolute links without HTTP/HTTPS
                                 * scheme and no matching mention pattern will be rendered as plain text (anchor with no href).
                                 * With this, the user can click the links only when the scheme is HTTP/HTTPS
                                 */
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
