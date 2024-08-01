import { html, when } from '@microsoft/fast-element';
import type { TableHeader } from '.';
import { iconArrowDownTag } from '../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../icons/arrow-up';
import { iconTwoSquaresInBracketsTag } from '../../../icons/two-squares-in-brackets';
import { TableColumnAlignment, TableColumnSortDirection } from '../../types';
import {
    tableColumnHeaderGroupedLabel,
    tableColumnHeaderSortedAscendingLabel,
    tableColumnHeaderSortedDescendingLabel
} from '../../../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader"
        class="${x => (x.alignment === TableColumnAlignment.right ? 'right-align' : '')}"
        aria-sort="${x => x.ariaSort}"
        ${'' /* Prevent header double clicks from selecting text */}
        @mousedown="${(_x, c) => !((c.event as MouseEvent).detail > 1)}"
    >
        <slot></slot>

        ${when(x => !x.indicatorsHidden, html<TableHeader>`
            ${'' /* Set aria-hidden="true" on sort indicators because aria-sort is set on the 1st sorted column */}
            ${when(x => x.sortDirection === TableColumnSortDirection.ascending, html<TableHeader>`
                <${iconArrowUpTag}
                    class="sort-indicator"
                    title="${x => tableColumnHeaderSortedAscendingLabel.getValueFor(x)}"
                    aria-hidden="true"
                ></${iconArrowUpTag}>
            `)}
            ${when(x => x.sortDirection === TableColumnSortDirection.descending, html<TableHeader>`
                <${iconArrowDownTag}
                    class="sort-indicator"
                    title="${x => tableColumnHeaderSortedDescendingLabel.getValueFor(x)}"
                    aria-hidden="true"
                ></${iconArrowDownTag}>
            `)}
            ${when(x => x.isGrouped, html<TableHeader>`
                <${iconTwoSquaresInBracketsTag}
                    class="grouped-indicator"
                    title="${x => tableColumnHeaderGroupedLabel.getValueFor(x)}"
                    role="img"
                    aria-label="${x => tableColumnHeaderGroupedLabel.getValueFor(x)}"
                ></${iconTwoSquaresInBracketsTag}>
            `)}
        `)}
    </template>
`;
