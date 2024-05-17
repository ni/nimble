import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-spinner': MappingSpinner;
    }
}

/**
 * Maps data values to a spinner.
 * One or more may be added as children of a nimble-table-column-mapping element to define
 * which specific data values should be displayed as spinners in that column's cells.
 */
export class MappingSpinner extends Mapping<MappingKey> {
    @attr()
    public text?: string;

    @attr({ attribute: 'text-hidden', mode: 'boolean' })
    public textHidden = false;
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = 'nimble-mapping-spinner';
