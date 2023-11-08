import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import type { MentionHref } from '../base/types';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-mention-user': MappingMentionUser;
    }
}
/**
 * Maps key (url) to user display name
 * Non-visible configuration element for mapping rich text user mention keys to the user name to display
 */
export class MappingMentionUser extends Mapping<MentionHref> {
    @attr({ attribute: 'display-name' })
    public displayName?: string;
}
const mentionMappingUser = MappingMentionUser.compose({
    baseName: 'mapping-mention-user',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mentionMappingUser());
export const mappingMentionUserTag = DesignSystem.tagFor(MappingMentionUser);
