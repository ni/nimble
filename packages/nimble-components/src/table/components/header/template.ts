import { html, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableHeader } from '.';
import { IconArrowDown } from '../../../icons/arrow-down';
import { IconArrowUp } from '../../../icons/arrow-up';
import { TableColumnSortDirection } from '../../types';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader" aria-sort="${x => x.ariaSort}">
        <slot></slot>

        <span class="sort-indicator">
            ${when(x => x.sortDirection === TableColumnSortDirection.ascending, html`
                <${DesignSystem.tagFor(IconArrowDown)}></${DesignSystem.tagFor(IconArrowDown)}>
            `)}
            ${when(x => x.sortDirection === TableColumnSortDirection.descending, html`
                <${DesignSystem.tagFor(IconArrowUp)}></${DesignSystem.tagFor(IconArrowUp)}>
            `)}
        </span>
    </template>
`;
