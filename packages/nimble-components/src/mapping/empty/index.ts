import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingKey } from '../base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-empty': MappingEmpty;
    }
}

/**
 * Maps data values to text.
 * One or more may be added as children of a nimble-table-column-icon element. The
 * mapping displays an empty cell and text-only group rows.
 */
export class MappingEmpty extends Mapping<MappingKey> {
    @attr()
    public text?: string;
}

const emptyMapping = MappingEmpty.compose({
    baseName: 'mapping-empty',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(emptyMapping());
export const mappingEmptyTag = 'nimble-mapping-empty';
