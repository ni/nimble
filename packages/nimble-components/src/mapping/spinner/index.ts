import { attr, customElement } from '@ni/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';
import { styles } from '../base/styles';

export const mappingSpinnerTag = 'nimble-mapping-spinner';

declare global {
    interface HTMLElementTagNameMap {
        [mappingSpinnerTag]: MappingSpinner;
    }
}

/**
 * Maps data values to a spinner.
 * One or more may be added as children of a nimble-table-column-mapping element to define
 * which specific data values should be displayed as spinners in that column's cells.
 */
@customElement({
    name: mappingSpinnerTag,
    template,
    styles
})
export class MappingSpinner extends Mapping<MappingKey> {
    @attr()
    public text?: string;

    @attr({ attribute: 'text-hidden', mode: 'boolean' })
    public textHidden = false;
}
