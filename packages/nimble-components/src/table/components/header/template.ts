import { html, when } from '@microsoft/fast-element';
import type { TableHeader } from '.';
import { iconArrowDownTag } from '../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../icons/arrow-up';
import { TableColumnSortDirection } from '../../types';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader" aria-sort="${x => x.ariaSort}">
        <slot></slot>

        ${when(x => x.sortDirection === TableColumnSortDirection.ascending, html`
            <${iconArrowUpTag} class="sort-indicator" aria-hidden="true"></${iconArrowUpTag}>
        `)}
        ${when(x => x.sortDirection === TableColumnSortDirection.descending, html`
            <${iconArrowDownTag} class="sort-indicator" aria-hidden="true"></${iconArrowDownTag}>
        `)}
    </template>
`;
