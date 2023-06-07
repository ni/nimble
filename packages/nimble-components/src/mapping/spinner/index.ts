import { attr, html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { spinnerTag } from '../../spinner';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { ConvertedKeyMapping } from '../../table-column/enum-base';
import type { ConvertedKeyMappingForIconColumn } from '../icon';

export interface ConvertedKeyMappingSpinner
    extends ConvertedKeyMappingForIconColumn {
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
    ): ConvertedKeyMapping {
        return {
            key: this.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label,
            paused: this.paused,
            viewTemplate: html<ConvertedKeyMappingSpinner>`
                <${spinnerTag}
                    style="${x => (x.paused
        ? '--ni-private-spinner-animation-play-state:paused'
        : '')}"
                    title="${x => x.label}"
                    aria-label="${x => x.label}">
                </${spinnerTag}>`
        } as ConvertedKeyMappingSpinner;
    }
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
