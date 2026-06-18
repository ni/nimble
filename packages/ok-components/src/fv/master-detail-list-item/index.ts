import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-master-detail-list-item': FvMasterDetailListItem;
    }
}

/**
 * A selectable master-detail list item with title, subtitle, and optional status content.
 */
export class FvMasterDetailListItem extends FoundationElement {
    @attr({ attribute: 'title-text' })
    public titleText = '';

    @attr
    public subtitle = '';

    @attr
    public value = '';

    @attr({ mode: 'boolean' })
    public compact = false;

    @attr({ mode: 'boolean' })
    public selected = false;

    @attr({ attribute: 'status-color' })
    public statusColor = '';

    @attr({ attribute: 'status-label' })
    public statusLabel = '';

    /** @internal */
    @observable
    public hasStatusSlotContent = false;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();

        if (this.id.length === 0) {
            this.id = uniqueId('ok-fv-master-detail-list-item');
        }

        this.setAttribute('role', 'option');
        this.syncSelectionAria();
    }

    /** @internal */
    public selectedChanged(): void {
        if (this.$fastController.isConnected) {
            this.syncSelectionAria();
        }
    }

    /** @internal */
    public handleStatusSlotChange(event: Event): void {
        const slot = event.target as HTMLSlotElement;
        this.hasStatusSlotContent = slot.assignedNodes({ flatten: true }).length > 0;
    }

    /** @internal */
    public get hasStatus(): boolean {
        return this.hasStatusSlotContent || this.statusColor.trim().length > 0;
    }

    /** @internal */
    public get fallbackStatusLabel(): string | null {
        if (this.hasStatusSlotContent || this.statusColor.trim().length === 0) {
            return null;
        }

        const normalizedStatusLabel = this.statusLabel.trim();
        return normalizedStatusLabel.length > 0 ? normalizedStatusLabel : null;
    }

    private syncSelectionAria(): void {
        this.setAttribute('aria-selected', String(this.selected));
    }
}

const okFvMasterDetailListItem = FvMasterDetailListItem.compose({
    baseName: 'fv-master-detail-list-item',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvMasterDetailListItem());
export const fvMasterDetailListItemTag = 'ok-fv-master-detail-list-item';