import { DesignSystem } from '@microsoft/fast-foundation';
import type { MentionInternalsOptions } from '../base/models/mention-internals';
import { RichTextMention } from '../base';
import type { MappingConfig } from '../base/models/mapping-config';
import { MappingUserConfig } from './models/mapping-user-config';
import { template } from '../base/template';
import { iconAtTag } from '../../icons/at';
import { MappingUser } from '../../mapping/user';
import type { Mapping } from '../../mapping/base';
import type { MappingUserKey } from '../../mapping/base/types';
import { RichTextMentionUsersValidator } from './models/rich-text-mention-users-validator';
import { richTextMentionUsersViewTag } from './view';
import { UserMentionConfig } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users': RichTextMentionUsers;
    }
}

/**
 * Rich Text user mention configuration element which will have MappingMentionUser elements as children
 */
export class RichTextMentionUsers extends RichTextMention<
RichTextMentionUsersValidator
> {
    // TODO this isn't a great way to do this. It's mixing configuration element state and parent state which are decoupled asynchronously from each other.
    // I'd prefer to leave it out of nimble for now. The app can know when things have settled and so this themselves.
    // I'm also now wondering how do multiple regexes that happen to match the same url behave...
    // I'd expect it to match based on DOM order. So I don't think this is reliable.
    // At the very very minimum this should be in the base class, it's not mention implementation specific, it should be something the editor knows
    public override getMentionedHrefs(): string[] {
        const regex = new RegExp(this.pattern ?? '');
        return this.richTextParent
            .getMentionedHrefs()
            .filter(x => regex.test(x));
    }

    protected override createValidator(): RichTextMentionUsersValidator {
        return new RichTextMentionUsersValidator(this.mentionInternals);
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: iconAtTag,
            character: '@',
            viewElement: richTextMentionUsersViewTag
        };
    }

    protected override createMentionConfig(): UserMentionConfig {
        return new UserMentionConfig();
    }

    protected createMappingConfig(
        mapping: Mapping<MappingUserKey>
    ): MappingConfig {
        if (mapping instanceof MappingUser) {
            return new MappingUserConfig(mapping.key, mapping.displayName);
        }
        // Getting here would indicate a programming error, b/c validation will prevent
        // this function from running when there is an unsupported mapping.
        throw new Error('Unsupported mapping');
    }
}
const nimbleRichTextMentionUsers = RichTextMentionUsers.compose({
    baseName: 'rich-text-mention-users',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionUsers());
export const richTextMentionUsersTag = DesignSystem.tagFor(RichTextMentionUsers);
