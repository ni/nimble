import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-mention': MappingMention;
    }
}

/**
 * Defines a mapping from one data value ('key' property) to display text ('text' property).
 * One or more may be added as children of a nimble-table-column-enum-text element to define
 * how a specific data value should be displayed as text in that column's cells.
 */
export class MappingMention extends Mapping {}

const mentionMapping = MappingMention.compose({
    baseName: 'mapping-mention',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mentionMapping());
export const mappingMentionTag = DesignSystem.tagFor(MappingMention);
