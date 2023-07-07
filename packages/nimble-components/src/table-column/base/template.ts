import { html, ref } from '@microsoft/fast-element';
import type { TableColumn } from '.';
import { overflow } from '../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumn>`
    <template slot="${x => x.columnInternals.uniqueId}">
        <span
            ${overflow('hasOverflow')}
            class="header-content"
            title=${x => (x.hasOverflow && x.headerTextContent ? x.headerTextContent : null)}
        >
            <slot ${ref('contentSlot')}></slot>
        </span>
    </template>
`;
