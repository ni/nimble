import { DesignSystem } from '@microsoft/fast-foundation';
import type { MentionInternalsOptions } from '../base/models/mention-internals';
import {
    MappingConfigs,
    RichTextMention,
    RichTextMentionConfig
} from '../base';
import type { MappingConfig } from '../base/models/mapping-config';
import { MappingUserConfig } from '../base/models/mapping-user-config';
import { template } from '../base/template';
import { iconAtTag } from '../../icons/at';
import { MappingMentionUser } from '../../mapping/mention-user';
import type { Mapping } from '../../mapping/base';
import type { MentionHref } from '../../mapping/base/types';
import { RichTextMentionUsersValidator } from './models/rich-text-mention-users-validator';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users': RichtextMentionUsers;
    }
}

/**
 * Rich Text Mention that will map user url and name
 */
export class RichtextMentionUsers extends RichTextMention<
RichTextMentionConfig,
RichTextMentionUsersValidator
> {
    private readonly character = '@';

    private readonly icon = iconAtTag;

    public override createValidator(): RichTextMentionUsersValidator {
        return new RichTextMentionUsersValidator(this.mentionInternals);
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: this.icon,
            character: this.character,
            pattern: this.pattern ?? ''
        };
    }

    protected override createMentionConfig(
        mappingConfigs: MappingConfigs
    ): RichTextMentionConfig {
        return {
            mappingConfigs
        };
    }

    protected createMappingConfig(
        mapping: Mapping<MentionHref>
    ): MappingConfig {
        if (mapping instanceof MappingMentionUser) {
            return new MappingUserConfig(mapping.key, mapping.displayName);
        }
        // Getting here would indicate a programming error, b/c validation will prevent
        // this function from running when there is an unsupported mapping.
        throw new Error('Unsupported mapping');
    }
}
const nimbleRichtextMentionUsers = RichtextMentionUsers.compose({
    baseName: 'rich-text-mention-users',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichtextMentionUsers());
export const richTextMentionUsersTag = DesignSystem.tagFor(RichtextMentionUsers);
