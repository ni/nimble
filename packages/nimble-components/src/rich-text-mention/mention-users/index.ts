import { DesignSystem } from '@microsoft/fast-foundation';
import type { MentionInternalsOptions } from '../base/models/mention-internals';
import type { MappingMentionBase } from '../../mapping/mention-base';
import {
    MappingConfigs,
    RichTextMention,
    RichTextMentionConfig
} from '../base';
import type { MappingConfig } from '../base/models/mapping-config';
import { MappingUserConfig } from '../base/models/mapping-user-config';
import { MappingMentionUser } from '../../mapping/mention-user';
import { template } from '../base/template';
import {
    baseValidityFlagNames,
    RichTextMentionValidator
} from '../base/models/rich-text-mention-validator';
import { iconAtTag } from '../../icons/at';

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
RichTextMentionValidator<typeof baseValidityFlagNames>
> {
    private readonly character = '@';

    private readonly icon = iconAtTag;

    public override createValidator(): RichTextMentionValidator<
        typeof baseValidityFlagNames
    > {
        return new RichTextMentionValidator(
            this.mentionInternals,
            baseValidityFlagNames,
            [MappingMentionUser]
        );
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

    protected createMappingConfig(mapping: MappingMentionBase): MappingConfig {
        if (mapping instanceof MappingMentionUser) {
            return new MappingUserConfig(
                mapping.mentionHref,
                mapping.displayName
            );
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
