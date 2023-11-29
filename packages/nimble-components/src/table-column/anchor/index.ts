import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnAnchor as NimbleTableColumnAnchorBase } from '@ni/nimble-foundation/dist/esm/table-column/anchor';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/base/template';
import { styles } from '../base/styles';
import type { TableStringField } from '../../table/types';
import type { AnchorAppearance } from '../../anchor/types';

export type TableColumnAnchorCellRecord = TableStringField<'label' | 'href'>;
export interface TableColumnAnchorColumnConfig {
    appearance: AnchorAppearance;
    underlineHidden?: boolean;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: string;
    rel?: string;
    target?: string;
    type?: string;
    download?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor': TableColumnAnchor;
    }
}

/**
 * A table column for displaying links.
 */
export class TableColumnAnchor extends NimbleTableColumnAnchorBase { }

const nimbleTableColumnAnchor = TableColumnAnchor.compose({
    baseName: 'table-column-anchor',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnAnchor());
export const tableColumnAnchorTag = DesignSystem.tagFor(TableColumnAnchor);
