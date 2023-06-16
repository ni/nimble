import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingConfig, MappingKeyType } from '../base/types';

export interface MappingConfigText extends MappingConfig {
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

    public override getMappingConfig(keyType: MappingKeyType): MappingConfig {
        return {
            key: Mapping.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            label: this.label
        } as MappingConfigText;
    }
}

const textMapping = MappingText.compose({
    baseName: 'mapping-text',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
export const mappingTextTag = DesignSystem.tagFor(MappingText);
