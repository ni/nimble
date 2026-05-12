import { html, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import type { FvSummaryPanel } from '.';

export const template = html<FvSummaryPanel>`
    <section class="summary-panel" part="panel">
        <div class="summary-item-container" part="items">
            <slot @slotchange="${x => x.handleItemsSlotChange()}"></slot>
        </div>
        ${when(x => x.showEditItemsButton, html<FvSummaryPanel>`
            <${buttonTag}
                class="edit-items-button"
                part="edit-items-button"
                appearance="${ButtonAppearance.ghost}"
                content-hidden
                title="${x => x.editItemsButtonLabel}"
                aria-label="${x => x.editItemsButtonLabel}"
                @click="${x => {
                    x.handleEditItemsClick();
                    return true;
                }}"
            >
                ${x => x.editItemsButtonLabel}
                <${iconCogTag} slot="start"></${iconCogTag}>
            </${buttonTag}>
        `)}
    </section>
`;