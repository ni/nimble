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
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users': RichTextMentionUsers;
    }
}

/**
 * Rich Text user mention configuration element which will have MappingMentionUser elements as children
 */
export class RichTextMentionUsers extends RichTextMention<RichTextMentionUsersValidator> {
    protected override getMentionInternalsOptions(): MentionInternalsOptions<RichTextMentionUsersValidator> {
        return {
            icon: iconAtTag,
            character: '@',
            viewElement: richTextMentionUsersViewTag,
            validator: new RichTextMentionUsersValidator()
        };
    }

    protected override getObservedMappingProperty(): string[] {
        return ['key', 'displayName'];
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
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionUsers());
export const richTextMentionUsersTag = 'nimble-rich-text-mention-users';
