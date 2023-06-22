import { slotted, html } from '@microsoft/fast-element';

import type { TableColumnEnumBase, TableColumnEnumColumnConfig } from '.';

export const template = html<TableColumnEnumBase<TableColumnEnumColumnConfig>>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <slot ${slotted('mappings')} name="mapping"> </slot>
        <span class="header-content">
            <slot></slot>
        </span>
    </template>
`;
