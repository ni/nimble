import { DesignSystem } from '@ni/fast-foundation';
import { attr } from '@ni/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-text': MappingText;
    }
}

/**
 * Defines a mapping from one data value ('key' property) to display text ('text' property).
 * One or more may be added as children of a nimble-table-column-mapping element to define
 * how a specific data value should be displayed as text in that column's cells.
 */
export class MappingText extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}

const textMapping = MappingText.compose({
    baseName: 'mapping-text',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
export const mappingTextTag = 'nimble-mapping-text';
