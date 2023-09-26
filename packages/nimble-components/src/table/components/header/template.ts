import { html, when } from '@microsoft/fast-element';
import type { TableHeader } from '.';
import { iconArrowDownTag } from '../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../icons/arrow-up';
import { iconTwoSquaresInBracketsTag } from '../../../icons/two-squares-in-brackets';
import { TableColumnSortDirection } from '../../types';
import { tableColumnHeaderGroupedIndicatorLabel } from '../../../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader"
        aria-sort="${x => x.ariaSort}"
        ${'' /* Prevent header double clicks from selecting text */}
        @mousedown="${(_x, c) => !((c.event as MouseEvent).detail > 1)}"
    >
        <slot></slot>
        ${'' /* Omit title attribute for sort indicators because aria-sort is set on the 1st sorted column */}
        ${when(x => x.sortDirection === TableColumnSortDirection.ascending, html`
            <${iconArrowUpTag} class="sort-indicator" aria-hidden="true"></${iconArrowUpTag}>
        `)}
        ${when(x => x.sortDirection === TableColumnSortDirection.descending, html`
            <${iconArrowDownTag} class="sort-indicator" aria-hidden="true"></${iconArrowDownTag}>
        `)}
        ${when(x => x.isGrouped, html<TableHeader>`
            <${iconTwoSquaresInBracketsTag} class="grouped-indicator" title="${x => tableColumnHeaderGroupedIndicatorLabel.getValueFor(x)}" role="graphics-symbol"></${iconTwoSquaresInBracketsTag}>
        `)}
    </template>
`;
