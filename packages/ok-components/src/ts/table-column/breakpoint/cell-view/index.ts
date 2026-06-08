import { DesignSystem } from '@ni/fast-foundation';
import { TableCellView } from '@ni/nimble-components/dist/esm/table-column/base/cell-view';
import { attr, observable } from '@ni/fast-element';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { MenuButtonPosition, type MenuButtonPosition as BreakpointMenuPosition } from '@ni/nimble-components/dist/esm/menu-button/types';
import type { CellViewSlotRequestEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { template } from './template';
import { styles } from './styles';
import {
    BreakpointState,
    breakpointCellViewMenuSlotName,
    breakpointMenuItemStateAttributeName,
    type BreakpointToggleEventDetail,
    type BreakpointStateChangeRequestedEventDetail
} from '../types';
import type { TsTableColumnBreakpointCellRecord, TsTableColumnBreakpointColumnConfig } from '..';

declare global {
    interface HTMLElementTagNameMap {
        'ok-ts-table-column-breakpoint-cell-view': TsTableColumnBreakpointCellView;
    }
}

/**
 * Cell view for the breakpoint column that renders a clickable breakpoint indicator.
 */
export class TsTableColumnBreakpointCellView extends TableCellView<
    TsTableColumnBreakpointCellRecord,
    TsTableColumnBreakpointColumnConfig
> {
    private static readonly menuKeyAlias = 'Menu';

    private static readonly contextMenuKeyAlias = 'ContextMenu';

    /** @internal */
    public button?: HTMLButtonElement;

    /**
     * Specifies whether or not the menu is open.
     */
    @attr({ mode: 'boolean' })
    public open = false;

    /** @internal */
    @observable
    public readonly region?: AnchoredRegion;

    /** @internal */
    @observable
    public readonly slottedMenus?: HTMLElement[];

    private focusLastItemWhenOpened = false;

    /** @internal */
    @observable
    private readonly breakpointEnabledString = 'Breakpoint enabled';

    /** @internal */
    @observable
    private readonly breakpointDisabledString = 'Breakpoint disabled';

    /** @internal */
    @observable
    private readonly breakpointHitString = 'Breakpoint hit';

    /** @internal */
    @observable
    private readonly breakpointConditionalString = 'Conditional breakpoint';

    /** @internal */
    @observable
    private readonly breakpointHitDisabledString = 'Breakpoint hit (disabled)';

    /** @internal */
    @observable
    private readonly breakpointAddString = 'Add breakpoint';

    /** @internal */
    @observable
    private readonly breakpointRemoveString = 'Remove breakpoint';

    /** @internal */
    public get currentState(): BreakpointState {
        const value = this.cellRecord?.value;
        if (value && Object.values(BreakpointState).includes(value as BreakpointState)) {
            return value as BreakpointState;
        }
        return BreakpointState.off;
    }

    /** @internal */
    public get tooltipText(): string {
        if (this.currentState === BreakpointState.off) {
            return this.breakpointAddString;
        }
        return this.breakpointRemoveString;
    }

    /** @internal */
    public get ariaLabelText(): string {
        switch (this.currentState) {
            case BreakpointState.enabled:
                return this.breakpointEnabledString;
            case BreakpointState.disabled:
                return this.breakpointDisabledString;
            case BreakpointState.hit:
                return this.breakpointHitString;
            case BreakpointState.conditional:
                return this.breakpointConditionalString;
            case BreakpointState.hitDisabled:
                return this.breakpointHitDisabledString;
            default:
                return this.breakpointAddString;
        }
    }

    /** @internal */
    public get menuPosition(): BreakpointMenuPosition {
        return this.columnConfig?.position ?? MenuButtonPosition.auto;
    }

    public override get tabbableChildren(): HTMLElement[] {
        if (this.button) {
            return [this.button];
        }
        return [];
    }

    /** @internal */
    public onButtonClick(event: Event): void {
        event.stopPropagation();
        const oldState = this.currentState;
        const newState = oldState === BreakpointState.off
            ? BreakpointState.enabled
            : BreakpointState.off;
        this.emitToggle(oldState, newState);
    }

    /** @internal */
    public onContextMenu(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.requestContextMenu();
    }

    /** @internal */
    public onKeyDown(event: KeyboardEvent): boolean {
        if ((event.key === 'F10' && event.shiftKey)
            || event.key === TsTableColumnBreakpointCellView.menuKeyAlias
            || (event.key === TsTableColumnBreakpointCellView.contextMenuKeyAlias)) {
            event.preventDefault();
            event.stopPropagation();
            this.requestContextMenu();
            return false;
        }

        if (event.key === 'F9' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b')) {
            event.preventDefault();
            event.stopPropagation();
            this.onButtonClick(event);
            return false;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            this.focusLastItemWhenOpened = false;
            this.requestContextMenu();
            return false;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            this.focusLastItemWhenOpened = true;
            this.requestContextMenu();
            return false;
        }

        return true;
    }

    public regionLoadedHandler(): void {
        if (this.focusLastItemWhenOpened) {
            this.focusLastItemWhenOpened = false;
            this.focusLastMenuItem();
        } else {
            this.focusMenu();
        }
    }

    public regionChanged(prev: AnchoredRegion | undefined, _next: AnchoredRegion | undefined): void {
        if (prev) {
            prev.removeEventListener('change', this.menuChangeHandler, { capture: true });
        }

        if (this.region) {
            this.region.anchorElement = this.button ?? this;
            this.region.addEventListener('change', this.menuChangeHandler, { capture: true });
        }
    }

    public buttonChanged(): void {
        if (this.region) {
            this.region.anchorElement = this.button ?? this;
        }
    }

    public focusoutHandler(e: FocusEvent): boolean {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (
            !this.contains(focusTarget)
            && !this.region?.contains(focusTarget)
            && !this.getMenu()?.contains(focusTarget)
        ) {
            this.open = false;
            return false;
        }

        return true;
    }

    public contextMenuKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case 'Escape':
                this.open = false;
                this.button?.focus();
                return false;
            default:
                return true;
        }
    }

    public onContextMenuChange(event: Event): void {
        const requestedState = this.getRequestedStateFromEvent(event);
        if (!requestedState) {
            return;
        }

        const detail: BreakpointStateChangeRequestedEventDetail = {
            recordId: this.recordId!,
            requestedState,
            currentState: this.currentState
        };
        this.$emit('breakpoint-column-state-change-requested', detail);
    }

    private getMenu(): HTMLElement | undefined {
        if (!this.slottedMenus || this.slottedMenus.length === 0) {
            return undefined;
        }

        let currentItem: HTMLElement | undefined = this.slottedMenus[0];
        while (currentItem) {
            if (currentItem.getAttribute('role') === 'menu') {
                return currentItem;
            }

            if (this.isSlotElement(currentItem)) {
                const firstNode = currentItem.assignedNodes()[0];
                if (firstNode instanceof HTMLElement) {
                    currentItem = firstNode;
                } else {
                    currentItem = undefined;
                }
            } else {
                return undefined;
            }
        }

        return undefined;
    }

    private isSlotElement(
        element: HTMLElement | undefined
    ): element is HTMLSlotElement {
        return element?.nodeName === 'SLOT';
    }

    private focusMenu(): void {
        this.getMenu()?.focus();
    }

    private focusLastMenuItem(): void {
        const menuItems = this.getMenu()?.querySelectorAll('[role=menuitem]');
        if (menuItems && menuItems.length > 0) {
            const lastMenuItem = menuItems[menuItems.length - 1] as HTMLElement;
            lastMenuItem.focus();
        }
    }

    private emitToggle(
        oldState: BreakpointState,
        newState: BreakpointState
    ): void {
        const detail: BreakpointToggleEventDetail = {
            recordId: this.recordId!,
            newState,
            oldState
        };
        this.$emit('breakpoint-column-toggle', detail);
    }

    private requestContextMenu(): void {
        this.openMenuFromColumnSlot();
    }

    private openMenuFromColumnSlot(): void {
        const configuredSlotName = this.columnConfig?.menuSlot;
        if (!configuredSlotName) {
            return;
        }

        const eventDetail: CellViewSlotRequestEventDetail = {
            slots: [
                {
                    name: configuredSlotName,
                    slot: breakpointCellViewMenuSlotName
                }
            ]
        };
        this.$emit('cell-view-slots-request', eventDetail);
        this.open = true;
    }

    private readonly menuChangeHandler = (): void => {
        this.open = false;
        this.button?.focus();
    };

    private getRequestedStateFromEvent(event: Event): BreakpointState | undefined {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return undefined;
        }

        const stateElement = target.closest(`[${breakpointMenuItemStateAttributeName}]`);
        if (!stateElement) {
            return undefined;
        }

        const requestedState = stateElement.getAttribute(breakpointMenuItemStateAttributeName);
        if (requestedState && Object.values(BreakpointState).includes(requestedState as BreakpointState)) {
            return requestedState as BreakpointState;
        }

        return undefined;
    }
}

const tsTableColumnBreakpointCellView = TsTableColumnBreakpointCellView.compose({
    baseName: 'ts-table-column-breakpoint-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('ok').register(tsTableColumnBreakpointCellView());
export const tsTableColumnBreakpointCellViewTag = 'ok-ts-table-column-breakpoint-cell-view';
