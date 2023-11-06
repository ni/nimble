import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { MappingMentionBase } from '../mention-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-mention-user': MappingMentionUser;
    }
}

/**
 * Extended base class, as mentioning users requires only mentionHref and displayName
 */
export class MappingMentionUser extends MappingMentionBase {
}

const mentionMappingUser = MappingMentionUser.compose({
    baseName: 'mapping-mention-user',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mentionMappingUser());
export const mappingMentionUserTag = DesignSystem.tagFor(MappingMentionUser);