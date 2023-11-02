import { DesignSystem } from '@microsoft/fast-foundation';
import { html, slotted } from '@microsoft/fast-element';
import { MappingConfigs, RichTextMention, RichTextMentionConfig } from '../base';
import type { MentionInternalsOptions } from '../base/models/mention-internals';
import type { MappingConfig } from '../base/models/mapping-config';
import { MappingMentionFinal } from '../../mapping/mention final';
import { MappingUsersConfig } from '../base/models/mapping-users-config';
import type { MappingMentionBase } from '../../mapping/mention base';
import { RichTextMentionUsersValidator } from './models/rich-text-mention-users-validator';
import type { RichTextMentionValidity } from '../base/models/mention-validator';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users-final': RichtextMentionUsers;
    }
}

/**
 * Rich Text Mention that will map user url and name
 */
export class RichtextMentionUsers extends RichTextMention<RichTextMentionConfig, RichTextMentionUsersValidator> {
    private readonly character = '@';

    private readonly icon = '';

    public override createValidator(): RichTextMentionUsersValidator {
        return new RichTextMentionUsersValidator(this.mentionInternals);
    }

    public override get validity(): RichTextMentionValidity {
        return this.validator.getValidity();
    }

    protected override getMentionInternalsOptions(): MentionInternalsOptions {
        return {
            icon: this.icon,
            character: this.character,
            pattern: this.pattern
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
        if (mapping instanceof MappingMentionFinal) {
            return new MappingUsersConfig(mapping.mentionUrl, mapping.displayName);
        }
        // Getting here would indicate a programming error, b/c validation will prevent
        // this function from running when there is an unsupported mapping.
        throw new Error('Unsupported mapping');
    }
}
const nimbleRichtextMentionUsers = RichtextMentionUsers.compose({
    baseName: 'rich-text-mention-users-final',
    template: html`<slot ${slotted('mappings')} name="mapping"></slot>`,
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichtextMentionUsers());
export const richTextMentionUsersTag = DesignSystem.tagFor(RichtextMentionUsers);