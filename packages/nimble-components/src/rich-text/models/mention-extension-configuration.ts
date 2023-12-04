import type { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import type { MentionUpdateEmitter } from '../../rich-text-mention/base/types';
import { mentionPluginPrefix } from '../editor/types';

/**
 * A configuration object for a Mention extension, to be used by the editor for loading mention plugins in tiptap.
 * This object maintains the necessary internal values for loading mention extension.
 */
export class MentionExtensionConfiguration {
    private static instance = 0;

    public readonly viewElement: string;
    public readonly character: string;
    public readonly name: string;
    public readonly key: string;
    public readonly mentionUpdateEmitter: MentionUpdateEmitter;

    public constructor(mentionInternals: MentionInternals) {
        MentionExtensionConfiguration.instance += 1;
        const key = `${mentionPluginPrefix}${MentionExtensionConfiguration.instance}`;
        this.name = key;
        this.key = key;

        this.viewElement = mentionInternals.viewElement;
        this.character = mentionInternals.character;
        this.mentionUpdateEmitter = mentionInternals.mentionUpdateEmitter;
    }
}
