import { attr, css, html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { spinnerTag } from '../../spinner';
import { template } from '../base/template';
import type { MappingConfigIconOrSpinner } from '../icon';
import type { MappingConfig, MappingKeyType } from '../base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-spinner': MappingSpinner;
    }
}

/**
 * An element to be given as content to a nimble-table-column-icon.
 * Maps data values to a spinner.
 */
export class MappingSpinner extends Mapping {
    @attr()
    public label?: string;

    public override getMappingConfig(keyType: MappingKeyType): MappingConfig {
        const mappingConfig: MappingConfigIconOrSpinner = {
            key: Mapping.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label ?? '',
            viewTemplate: html`
                <${spinnerTag}
                    title="${this.label ?? ''}"
                    aria-label="${this.label ?? ''}"
                    class="no-shrink">
                </${spinnerTag}>`
        };
        return mappingConfig;
    }
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template,
    styles: css``
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
