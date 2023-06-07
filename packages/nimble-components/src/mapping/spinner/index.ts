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
    public label: string | null = null;

    /** @internal */
    @attr({ mode: 'boolean' })
    public paused?: boolean;

    public override getConvertedKeyMapping(
        keyType: 'string' | 'number' | 'boolean'
    ): MappingConfig {
        return {
            key: this.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label,
            paused: this.paused,
            viewTemplate: html`
                <${spinnerTag}
                    style="${
    this.paused
        ? '--ni-private-spinner-animation-play-state:paused'
        : ''
}"
                    title="${this.label ?? ''}"
                    aria-label="${this.label ?? ''}">
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
