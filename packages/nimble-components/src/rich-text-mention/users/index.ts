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
import { richTextMentionUserLabel } from '../../label-provider/rich-text/label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users': RichTextMentionUsers;
    }
}

/**
 * Rich Text user mention configuration element which will have MappingMentionUser elements as children
 */
export class RichTextMentionUsers extends RichTextMention<RichTextMentionUsersValidator> {
    protected override createValidator(): RichTextMentionUsersValidator {
        return new RichTextMentionUsersValidator(this.mentionInternals);
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: iconAtTag,
            character: '@',
            viewElement: richTextMentionUsersViewTag,
            label: richTextMentionUserLabel.getValueFor(this)
        };
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
