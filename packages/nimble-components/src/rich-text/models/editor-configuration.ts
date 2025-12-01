import type { RichTextMention } from '../../rich-text-mention/base';
import { Configuration } from './configuration';
import { MentionExtensionConfiguration } from './mention-extension-configuration';

/**
 * EditorConfiguration which will hold mentionExtensionConfig for configuring editor's mention extension and RichTextMarkdownSerializer
 */
export class EditorConfiguration extends Configuration {
    public mentionExtensionConfig: MentionExtensionConfiguration[];

    public constructor(mentionElements: RichTextMention[]) {
        super(mentionElements);
        this.mentionExtensionConfig = this.isValid
            ? mentionElements.map(
                mentionElement => new MentionExtensionConfiguration(
                    mentionElement.mentionInternals
                )
            )
            : [];
    }
}
