import type { RichTextMentionConfig } from '../../rich-text-mention/base/types';
import type { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';

/**
 * A configuration object for a Mention extension, to be used by the editor for loading mention plugins in tiptap.
 * This object maintains the necessary internal values for loading mention extension.
 */
export class MentionExtensionConfiguration {
    public readonly viewElement: string;
    public readonly character: string;
    public readonly name: string;
    public readonly key: string;

    public constructor(
        mentionInternals: MentionInternals<RichTextMentionConfig>
    ) {
        this.viewElement = mentionInternals.viewElement;
        this.character = mentionInternals.character;
        this.name = mentionInternals.name;
        this.key = mentionInternals.key;
    }
}
