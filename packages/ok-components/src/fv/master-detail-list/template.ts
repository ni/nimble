import { html, ref, when } from '@ni/fast-element';
import type { FvMasterDetailList } from '.';

export const template = html<FvMasterDetailList>`
    <div class="master-detail-list">
        <div class="filter-row">
            <input
                id="${x => x.inputId}"
                class="filter-input"
                type="text"
                placeholder="${x => x.placeholder}"
                :value="${x => x.filterText}"
                aria-controls="${x => x.listboxId}"
                aria-activedescendant="${x => x.activeItemId}"
                aria-label="Filter list items"
                role="combobox"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-expanded="true"
                ${ref('captureFilterInput')}
                @input="${(x, c) => {
                    x.handleFilterInput(c.event);
                    return true;
                }}"
                @keydown="${(x, c) => x.handleFilterKeydown(c.event as KeyboardEvent)}"
            />
        </div>
        <div
            id="${x => x.listboxId}"
            class="items"
            role="listbox"
            aria-labelledby="${x => x.inputId}"
            @click="${(x, c) => {
                x.handleItemsClick(c.event);
                return true;
            }}"
        >
            <slot @slotchange="${x => x.handleItemsSlotChange()}"></slot>
            ${when(
                x => !x.hasVisibleItems,
                html<FvMasterDetailList>`
                    <div class="empty-state">No matches</div>
                `
            )}
        </div>
    </div>
`;