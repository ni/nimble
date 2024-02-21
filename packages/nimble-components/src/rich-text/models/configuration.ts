import type { RichTextMention } from '../../rich-text-mention/base';
import { MarkdownParserMentionConfiguration } from './markdown-parser-mention-configuration';

/**
 * Base class for Configuration, contains mention configuration required for RichTextMarkdownParser
 */
export class Configuration {
    public parserMentionConfig: MarkdownParserMentionConfiguration[] = [];

    protected isValid = true;

    public constructor(mentionElements: RichTextMention[]) {
        this.isValid = mentionElements.every(
            mentionElement => mentionElement.mentionInternals.validConfiguration
        );

        this.parserMentionConfig = this.isValid
            ? mentionElements.map(
                mentionElement => new MarkdownParserMentionConfiguration(
                    mentionElement.mentionInternals
                )
            )
            : [];
    }
}
