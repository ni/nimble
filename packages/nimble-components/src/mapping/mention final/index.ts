import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../base/template';
import { MappingMentionBase } from '../mention base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-mention-final': MappingMentionFinal;
    }
}

/**
 * Defines a mapping from one data value ('key' property) to display text ('text' property).
 * One or more may be added as children of a nimble-table-column-enum-text element to define
 * how a specific data value should be displayed as text in that column's cells.
 */
export class MappingMentionFinal extends MappingMentionBase {
}

const mentionMapping = MappingMentionFinal.compose({
    baseName: 'mapping-mention-final',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mentionMapping());
export const mappingMentionFinalTag = DesignSystem.tagFor(MappingMentionFinal);
