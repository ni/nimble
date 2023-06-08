import { attr, css, html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { spinnerTag } from '../../spinner';
import { template } from '../base/template';
import type { MappingConfig } from '../../table-column/enum-base';
import type { MappingConfigIconOrSpinner } from '../icon';

export interface MappingConfigSpinner extends MappingConfigIconOrSpinner {
    paused: boolean;
}

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

    public override getMappingConfig(
        keyType: 'string' | 'number' | 'boolean'
    ): MappingConfig {
        return {
            key: Mapping.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label,
            viewTemplate: html`
                <${spinnerTag}
                    title="${this.label ?? ''}"
                    aria-label="${this.label ?? ''}"
                    class="no-shrink">
                </${spinnerTag}>`
        } as MappingConfigSpinner;
    }
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template,
    styles: css``
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
