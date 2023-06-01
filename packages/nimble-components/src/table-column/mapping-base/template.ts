import { slotted, html } from '@microsoft/fast-element';

import type { TableColumnMappingBase } from '.';

export const template = html<TableColumnMappingBase>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <slot ${slotted('mappings')} name="mapping"> </slot>
        <span class="header-content">
            <slot></slot>
        </span>
    </template>
`;
