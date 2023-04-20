import { html } from '@microsoft/fast-element';
import type { TableColumn } from '.';

export const template = html<TableColumn>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <span class="header-content">
            <slot></slot>
        </span>
    </template>
`;
