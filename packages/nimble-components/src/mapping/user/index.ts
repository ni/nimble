import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import type { MappingUserKey } from '../base/types';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-user': MappingUser;
    }
}
/**
 * Maps key (url) to a user
 * Non-visible configuration element for mapping rich text user mention keys to a user
 */
export class MappingUser extends Mapping<MappingUserKey> {
    @attr({ attribute: 'display-name' })
    public displayName?: string;
}
const mappingUser = MappingUser.compose({
    baseName: 'mapping-user',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mappingUser());
export const mappingUserTag = 'nimble-mapping-user';
