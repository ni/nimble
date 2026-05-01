import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/icons/cog';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-summary-panel': FvSummaryPanel;
    }
}

/**
 * A layout container for summary tiles with an optional edit-items affordance.
 */
export class FvSummaryPanel extends FoundationElement {
    @attr({ attribute: 'show-edit-items-button', mode: 'boolean' })
    public showEditItemsButton = false;

    @attr({ attribute: 'legacy-style', mode: 'boolean' })
    public legacyStyle = false;

    @attr({ attribute: 'edit-items-button-label' })
    public editItemsButtonLabel = 'Configure';

    public override connectedCallback(): void {
        super.connectedCallback();
        this.syncTileLegacyStyle();
    }

    public legacyStyleChanged(): void {
        if (this.$fastController.isConnected) {
            this.syncTileLegacyStyle();
        }
    }

    public handleEditItemsClick(): void {
        this.dispatchEvent(new CustomEvent('edit-items', {
            bubbles: true,
            composed: true
        }));
    }

    public handleItemsSlotChange(): void {
        this.syncTileLegacyStyle();
    }

    private syncTileLegacyStyle(): void {
        for (const element of this.shadowRoot?.querySelector('slot')?.assignedElements({ flatten: true }) ?? []) {
            if (element.localName !== 'ok-fv-summary-panel-tile') {
                continue;
            }

            if (this.legacyStyle) {
                element.setAttribute('legacy-style', '');
            }
            else {
                element.removeAttribute('legacy-style');
            }
        }
    }
}

const okFvSummaryPanel = FvSummaryPanel.compose({
    baseName: 'fv-summary-panel',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSummaryPanel());
export const fvSummaryPanelTag = 'ok-fv-summary-panel';