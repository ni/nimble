import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-spinner': MappingSpinner;
    }
}

/**
 * Maps data values to a spinner.
 */
export class MappingSpinner extends Mapping {
    @attr()
    public label?: string;
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
