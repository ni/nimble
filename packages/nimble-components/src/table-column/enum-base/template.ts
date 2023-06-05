import { slotted, html } from '@microsoft/fast-element';

import type { TableColumnEnumBase } from '.';

export const template = html<TableColumnEnumBase>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <slot ${slotted('mappings')} name="mapping"> </slot>
        <span class="header-content">
            <slot></slot>
        </span>
    </template>
`;
