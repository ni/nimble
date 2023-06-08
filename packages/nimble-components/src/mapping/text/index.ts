import { attr, css } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingConfig } from '../../table-column/enum-base';

export interface ConvertedKeyMappingText extends MappingConfig {
    label: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-text': MappingText;
    }
}

/**
 * An element to be given as content to a nimble-table-column-mapping.
 * Maps data values to text.
 */
export class MappingText extends Mapping {
    @attr()
    public label?: string;

    public override getConvertedKeyMapping(
        keyType: 'string' | 'number' | 'boolean'
    ): MappingConfig {
        return {
            key: Mapping.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label
        } as ConvertedKeyMappingText;
    }
}

const textMapping = MappingText.compose({
    baseName: 'mapping-text',
    template,
    styles: css``
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
export const mappingTextTag = DesignSystem.tagFor(MappingText);
