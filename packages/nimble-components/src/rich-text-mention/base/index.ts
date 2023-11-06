import { FoundationElement } from '@microsoft/fast-foundation';
import { MentionInternals, MentionInternalsOptions } from './models/mention-internals';
import type { RichTextMentionValidity } from './models/mention-validator';

/**
 * The base class for editor mention
 */
export abstract class RichTextMention<TMentionConfig = unknown> extends FoundationElement {
    public readonly mentionInternals: MentionInternals<TMentionConfig> = new MentionInternals(this.getMentionInternalsOptions());

    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    public get validity(): RichTextMentionValidity {
        return {};
    }

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;
}