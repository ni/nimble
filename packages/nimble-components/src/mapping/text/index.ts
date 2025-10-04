import { attr, customElement } from '@ni/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';
import { styles } from '../base/styles';

export const mappingTextTag = 'nimble-mapping-text';

declare global {
    interface HTMLElementTagNameMap {
        [mappingTextTag]: MappingText;
    }
}

/**
 * Defines a mapping from one data value ('key' property) to display text ('text' property).
 * One or more may be added as children of a nimble-table-column-mapping element to define
 * how a specific data value should be displayed as text in that column's cells.
 */
@customElement({
    name: mappingTextTag,
    template,
    styles
})
export class MappingText extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}
