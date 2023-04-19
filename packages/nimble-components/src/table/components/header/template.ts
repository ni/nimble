import { html, repeat, when } from '@microsoft/fast-element';
import type { TableHeader } from '.';
import { iconArrowDownTag } from '../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../icons/arrow-up';
import { TableColumnSortDirection } from '../../types';
import { menuButtonTag } from '../../../menu-button';
import { iconArrowExpanderDownTag } from '../../../icons/arrow-expander-down';
import { ButtonAppearance } from '../../../button/types';
import { menuTag } from '../../../menu';
import { menuItemTag } from '../../../menu-item';
import { iconCheckTag } from '../../../icons/check';
import type { TableColumn } from '../../../table-column/base';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader" aria-sort="${x => x.ariaSort}">
        <span class="title">
            <slot></slot>
        </span>

        ${when(x => x.sortDirection === TableColumnSortDirection.ascending, html`
            <${iconArrowUpTag} class="sort-indicator" aria-hidden="true"></${iconArrowUpTag}>
        `)}
        ${when(x => x.sortDirection === TableColumnSortDirection.descending, html`
            <${iconArrowDownTag} class="sort-indicator" aria-hidden="true"></${iconArrowDownTag}>
        `)}

        <${menuButtonTag}
            class="column-menu"
            content-hidden
            appearance="${() => ButtonAppearance.ghost}"
        >
            <${iconArrowExpanderDownTag} slot="start"></${iconArrowExpanderDownTag}>

            <${menuTag} slot="menu">
                <${menuItemTag}>
                    Columns
                    
                    <${menuTag}>
                        ${repeat(x => x.possibleColumns, html<TableColumn, TableHeader>`
                            <${menuItemTag}
                                @change="${(x, c) => c.parent.onColumnSelectionChange(x)}"
                            >
                                ${when(x => !x.columnHidden, html`
                                    <${iconCheckTag} slot="start"></${iconCheckTag}>
                                `)}

                                ${x => x.textContent}
                            </${menuItemTag}>
                        `)}
                    </${menuTag}>
                </${menuItemTag}>
            </${menuTag}>
        </${menuButtonTag}>
    </template>
`;
