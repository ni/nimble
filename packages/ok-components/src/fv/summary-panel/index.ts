import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/icons/cog';
import { styles } from './styles';
import { template } from './template';
import { FvSummaryPanelSize, type FvSummaryPanelSize as FvSummaryPanelSizeType } from './types';

export { FvSummaryPanelSize } from './types';

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

    @attr
    public size: FvSummaryPanelSizeType = FvSummaryPanelSize.default;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public readonly summaryItems!: HTMLElement;

    @attr({ attribute: 'edit-items-button-label' })
    public editItemsButtonLabel = 'Configure';

    private readonly summaryItemsResizeObserver: ResizeObserver;

    public constructor() {
        super();
        this.summaryItemsResizeObserver = new ResizeObserver(() => this.updateOverflow());
    }

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.syncTileAttributes();
        this.observeSummaryItems();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.summaryItemsResizeObserver.disconnect();
    }

    /** @internal */
    public legacyStyleChanged(): void {
        if (this.$fastController.isConnected) {
            this.syncTileAttributes();
            this.updateOverflow();
        }
    }

    /** @internal */
    public sizeChanged(): void {
        if (this.$fastController.isConnected) {
            this.syncTileAttributes();
            this.updateOverflow();
        }
    }

    /** @internal */
    public handleEditItemsClick(): void {
        this.dispatchEvent(new CustomEvent('edit-items', {
            bubbles: true,
            composed: true
        }));
    }

    /** @internal */
    public handleItemsSlotChange(): void {
        this.syncTileAttributes();
        this.observeSummaryItems();
    }

    private observeSummaryItems(): void {
        this.summaryItemsResizeObserver.disconnect();
        this.summaryItemsResizeObserver.observe(this.summaryItems);
        for (const element of this.shadowRoot?.querySelector('slot')?.assignedElements({ flatten: true }) ?? []) {
            this.summaryItemsResizeObserver.observe(element);
        }
        this.updateOverflow();
    }

    private updateOverflow(): void {
        this.hasOverflow = this.size === FvSummaryPanelSize.compact
            && this.summaryItems.scrollWidth > this.summaryItems.clientWidth;
        this.summaryItems.classList.toggle('has-overflow', this.hasOverflow);
    }

    private syncTileAttributes(): void {
        for (const element of this.shadowRoot?.querySelector('slot')?.assignedElements({ flatten: true }) ?? []) {
            if (element.localName !== 'ok-fv-summary-panel-tile') {
                continue;
            }

            if (this.legacyStyle) {
                element.setAttribute('legacy-style', '');
            } else {
                element.removeAttribute('legacy-style');
            }

            if (this.size === FvSummaryPanelSize.compact) {
                element.setAttribute('size', FvSummaryPanelSize.compact);
            } else {
                element.removeAttribute('size');
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