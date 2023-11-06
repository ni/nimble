import { FoundationElement } from '@microsoft/fast-foundation';
import { ViewTemplate, attr } from '@microsoft/fast-element';
import type { ListOption } from '../../list-option';
import {
    MentionInternals,
    MentionInternalsOptions
} from './models/mention-internals';
import type { RichTextMentionValidity } from './models/mention-validator';

/**
 * The base class for editor mention
 */
export abstract class RichTextMention<
    TMentionConfig = unknown
> extends FoundationElement {
    public readonly mentionInternals: MentionInternals<TMentionConfig> = new MentionInternals(this.getMentionInternalsOptions());

    @attr
    public pattern?: string;

    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    public get validity(): RichTextMentionValidity {
        return {};
    }

    /**
     * Get the list of view item need to be populated in the mention popup
     */
    public getListOptions(): ViewTemplate<ListOption>[] {
        return [];
    }

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;
}
