import { attr, customElement } from '@ni/fast-element';
import { Mapping } from '../base';
import type { MappingUserKey } from '../base/types';
import { template } from '../base/template';
import { styles } from '../base/styles';

export const mappingUserTag = 'nimble-mapping-user';

declare global {
    interface HTMLElementTagNameMap {
        [mappingUserTag]: MappingUser;
    }
}
/**
 * Maps key (url) to a user
 * Non-visible configuration element for mapping rich text user mention keys to a user
 */
@customElement({
    name: mappingUserTag,
    template,
    styles
})
export class MappingUser extends Mapping<MappingUserKey> {
    @attr({ attribute: 'display-name' })
    public displayName?: string;
}
