import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';
import { FvMasterDetailListItem, fvMasterDetailListItemTag } from '../master-detail-list-item';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-master-detail-list': FvMasterDetailList;
    }
}

export interface FvMasterDetailListChangeDetail {
    item: FvMasterDetailListItem | null;
    value: string | null;
}

/**
 * A filterable master-detail list with keyboard selection.
 */
export class FvMasterDetailList extends FoundationElement {
    @attr
    public placeholder = 'Filter items...';

    /** @internal */
    @observable
    public filterText = '';

    /** @internal */
    @observable
    public activeItemId: string | null = null;

    /** @internal */
    @observable
    public items: FvMasterDetailListItem[] = [];

    /** @internal */
    public readonly inputId = uniqueId('ok-fv-master-detail-list-input');

    /** @internal */
    public readonly listboxId = uniqueId('ok-fv-master-detail-list-listbox');

    private filterInput: HTMLInputElement | null = null;

    private selectedItem: FvMasterDetailListItem | null = null;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        queueMicrotask(() => {
            this.refreshItems();
        });
    }

    /** @internal */
    public filterTextChanged(): void {
        if (this.$fastController.isConnected) {
            this.applyFilter(true);
        }
    }

    /** @internal */
    public captureFilterInput(input: HTMLInputElement | null): void {
        this.filterInput = input;
    }

    /** @internal */
    public get hasVisibleItems(): boolean {
        return this.visibleItems.length > 0;
    }

    /** @internal */
    public handleFilterInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.filterText = input.value;
    }

    /** @internal */
    public handleFilterKeydown(event: KeyboardEvent): boolean {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return true;
        }

        const visibleItems = this.visibleItems;
        if (visibleItems.length === 0) {
            event.preventDefault();
            return false;
        }

        const currentIndex = visibleItems.findIndex(item => item.selected);
        let startingIndex = currentIndex;

        if (startingIndex < 0) {
            startingIndex = event.key === 'ArrowDown' ? -1 : visibleItems.length;
        }

        const nextIndex = event.key === 'ArrowDown'
            ? Math.min(startingIndex + 1, visibleItems.length - 1)
            : Math.max(startingIndex - 1, 0);

        this.setSelectedItem(visibleItems[nextIndex] ?? null, true);
        visibleItems[nextIndex]?.scrollIntoView({ block: 'nearest' });
        event.preventDefault();
        return false;
    }

    /** @internal */
    public handleItemsSlotChange(): void {
        this.refreshItems();
    }

    /** @internal */
    public handleItemsClick(event: Event): void {
        const item = event.composedPath().find(
            pathItem => pathItem instanceof HTMLElement && pathItem.localName === fvMasterDetailListItemTag
        ) as FvMasterDetailListItem | undefined;

        if (!item || item.hidden) {
            return;
        }

        this.setSelectedItem(item, true);
        this.filterInput?.focus();
    }

    private get visibleItems(): FvMasterDetailListItem[] {
        return this.items.filter(item => !item.hidden);
    }

    private refreshItems(): void {
        const slot = this.shadowRoot?.querySelector('slot');
        const assignedItems = slot?.assignedElements({ flatten: true }).filter(
            element => element instanceof HTMLElement && element.localName === fvMasterDetailListItemTag
        ) as FvMasterDetailListItem[] | undefined;

        this.items = assignedItems ?? [];
        for (const item of this.items) {
            if (item.id.length === 0) {
                item.id = uniqueId('ok-fv-master-detail-list-item');
            }
        }

        this.applyFilter(false);
    }

    private applyFilter(emitSelectionChange: boolean): void {
        const normalizedFilter = diacriticInsensitiveStringNormalizer(this.filterText.trim());
        let firstVisibleItem: FvMasterDetailListItem | null = null;

        for (const item of this.items) {
            const searchableText = diacriticInsensitiveStringNormalizer(
                `${item.titleText} ${item.subtitle} ${item.value}`.trim()
            );
            const matches = normalizedFilter.length === 0 || searchableText.includes(normalizedFilter);
            item.hidden = !matches;

            if (matches && firstVisibleItem === null) {
                firstVisibleItem = item;
            }
        }

        const visibleSelectedItems = this.visibleItems.filter(item => item.selected);
        const preferredSelectedItem = visibleSelectedItems[0] ?? null;

        for (const extraSelectedItem of visibleSelectedItems.slice(1)) {
            extraSelectedItem.selected = false;
        }

        if (preferredSelectedItem) {
            this.setSelectedItem(
                preferredSelectedItem,
                emitSelectionChange && preferredSelectedItem !== this.selectedItem
            );
            return;
        }

        this.setSelectedItem(
            firstVisibleItem,
            emitSelectionChange && firstVisibleItem !== this.selectedItem
        );
    }

    private setSelectedItem(nextItem: FvMasterDetailListItem | null, emitChange: boolean): void {
        if (this.selectedItem === nextItem) {
            return;
        }

        if (this.selectedItem) {
            this.selectedItem.selected = false;
        }

        this.selectedItem = nextItem;

        if (this.selectedItem) {
            this.selectedItem.selected = true;
            this.activeItemId = this.selectedItem.id;
        } else {
            this.activeItemId = null;
        }

        if (emitChange) {
            this.dispatchEvent(new CustomEvent<FvMasterDetailListChangeDetail>('change', {
                bubbles: true,
                composed: true,
                detail: {
                    item: this.selectedItem,
                    value: this.selectedItem?.value || this.selectedItem?.titleText || null
                }
            }));
        }
    }
}

const okFvMasterDetailList = FvMasterDetailList.compose({
    baseName: 'fv-master-detail-list',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvMasterDetailList());
export const fvMasterDetailListTag = 'ok-fv-master-detail-list';