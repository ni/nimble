import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';

const baseName = 'mapping-text';
export const mappingTextTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [mappingTextTag]: MappingText;
    }
}

/**
 * Defines a mapping from one data value ('key' property) to display text ('text' property).
 * One or more may be added as children of a nimble-table-column-enum-text element to define
 * how a specific data value should be displayed as text in that column's cells.
 */
export class MappingText extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}

const textMapping = MappingText.compose({
    baseName,
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
