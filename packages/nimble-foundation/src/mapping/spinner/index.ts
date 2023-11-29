import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-spinner': MappingSpinner;
    }
}

/**
 * Maps data values to a spinner.
 * One or more may be added as children of a nimble-table-column-icon element to define
 * which specific data values should be displayed as spinners in that column's cells.
 */
export class MappingSpinner extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
