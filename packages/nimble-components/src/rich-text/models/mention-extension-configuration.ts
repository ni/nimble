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

    public constructor(mentionInternals: MentionInternals<RichTextMentionConfig>, key: string) {
        // Name, Key and character should be unique for each mention plugin to be configured.
        this.viewElement = mentionInternals.viewElement;
        this.character = mentionInternals.character;
        this.name = key;
        this.key = key;
    }
}
