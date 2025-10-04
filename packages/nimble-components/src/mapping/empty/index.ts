import { attr, customElement } from '@ni/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';
import { styles } from '../base/styles';

export const mappingEmptyTag = 'nimble-mapping-empty';

declare global {
    interface HTMLElementTagNameMap {
        [mappingEmptyTag]: MappingEmpty;
    }
}

/**
 * Maps data values to text.
 * One or more may be added as children of a nimble-table-column-mapping element. The
 * mapping displays an empty cell and text-only group rows.
 */
@customElement({
    name: mappingEmptyTag,
    template,
    styles
})
export class MappingEmpty extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}
