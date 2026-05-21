import { DesignSystem } from '@ni/fast-foundation';
import { observable } from '@ni/fast-element';
import { eventChange, keyEscape } from '@ni/fast-web-utilities';
import { TableCellView } from '@ni/nimble-components/dist/esm/table-column/base/cell-view';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import type { CellViewSlotRequestEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { template } from './template';
import { styles } from './styles';
import { BreakpointState, type BreakpointToggleEventDetail, type BreakpointContextMenuEventDetail } from '../types';
import type { TsTableColumnBreakpointCellRecord, TsTableColumnBreakpointColumnConfig } from '../index';

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
    /** @internal */
    @observable
    public open = false;

    /** @internal */
    public button?: HTMLButtonElement;

    /** @internal */
    @observable
    public region?: AnchoredRegion;

    /** @internal */
    @observable
    public slottedMenus?: HTMLElement[];

    private static readonly contextMenuKey = 'ContextMenu';

    private static readonly legacyContextMenuKey = 'Apps';

    private static readonly menuKeyAlias = 'Menu';

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
            return 'Add breakpoint';
        }
        return 'Remove breakpoint';
    }

    /** @internal */
    public get ariaLabelText(): string {
        switch (this.currentState) {
            case BreakpointState.enabled:
                return 'Breakpoint enabled';
            case BreakpointState.disabled:
                return 'Breakpoint disabled';
            case BreakpointState.hit:
                return 'Breakpoint hit';
            case BreakpointState.conditional:
                return 'Conditional breakpoint';
            case BreakpointState.hitDisabled:
                return 'Breakpoint hit (disabled)';
            default:
                return 'Add breakpoint';
        }
    }

    public override get tabbableChildren(): HTMLElement[] {
        if (this.button) {
            return [this.button];
        }
        return [];
    }

    public regionChanged(
        prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (prev) {
            prev.removeEventListener(eventChange, this.menuChangeHandler);
        }

        if (this.region && this.button) {
            this.region.anchorElement = this.button;
            this.region.addEventListener(eventChange, this.menuChangeHandler, {
                capture: true
            });
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.region) {
            this.region.removeEventListener(eventChange, this.menuChangeHandler);
        }
    }

    /** @internal */
    public onContextMenuKeyDown(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyEscape:
                this.setContextMenuOpen(false);
                this.button?.focus();
                return false;
            default:
                return true;
        }
    }

    /** @internal */
    public regionLoadedHandler(): void {
        this.focusMenu();
    }

    /** @internal */
    public onContextMenuFocusOut(e: FocusEvent): boolean {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (!this.contains(focusTarget) && !this.getMenu()?.contains(focusTarget)) {
            this.setContextMenuOpen(false);
            return false;
        }

        return true;
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
        this.emitContextMenu();
    }

    /** @internal */
    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            this.tryFocusSiblingBreakpoint(event.key === 'ArrowUp');
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this.onButtonClick(event);
            return;
        }

        if ((event.key === 'F10' && event.shiftKey)
            || event.key === TsTableColumnBreakpointCellView.contextMenuKey
            || event.key === TsTableColumnBreakpointCellView.legacyContextMenuKey
            || event.key === TsTableColumnBreakpointCellView.menuKeyAlias) {
            event.preventDefault();
            event.stopPropagation();
            this.emitContextMenu();
            return;
        }

        if (event.key === 'F9' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b')) {
            event.preventDefault();
            event.stopPropagation();
            this.onButtonClick(event);
        }
    }

    private emitToggle(
        oldState: BreakpointState,
        newState: BreakpointState
    ): void {
        const detail: BreakpointToggleEventDetail = {
            recordId: this.recordId ?? '',
            newState,
            oldState
        };
        this.$emit('breakpoint-column-toggle', detail);
    }

    private emitContextMenu(): void {
        const slotRequestDetail: CellViewSlotRequestEventDetail = {
            slots: [{ name: 'menu', slot: 'menu' }]
        };
        this.$emit('cell-view-slots-request', slotRequestDetail);
        this.setContextMenuOpen(true);
    }

    private setContextMenuOpen(newValue: boolean): void {
        if (this.open === newValue) {
            return;
        }

        const detail: BreakpointContextMenuEventDetail = {
            recordId: this.recordId ?? '',
            currentState: this.currentState
        };

        if (newValue) {
            // Emit beforetoggle when opening
            this.$emit('breakpoint-column-beforetoggle', detail);
        }

        this.open = newValue;

        if (newValue) {
            // Emit context-menu event only when opening.
            this.$emit('breakpoint-column-context-menu', detail);
        }
    }

    private getMenu(): HTMLElement | undefined {
        // Resolve nested slot forwarding (table -> row -> cell-view) to find the actual menu.
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

    private isSlotElement(element: HTMLElement | undefined): element is HTMLSlotElement {
        return element?.nodeName === 'SLOT';
    }

    private readonly menuChangeHandler = (): void => {
        this.setContextMenuOpen(false);
        this.button?.focus();
    };

    private focusMenu(): void {
        this.getMenu()?.focus();
    }

    private tryFocusSiblingBreakpoint(backward: boolean): boolean {
        const currentCell = this.getContainingHost(this) as {
            getRootNode: () => Node;
        } | undefined;
        if (!currentCell) {
            return false;
        }

        const currentRow = this.getContainingHost(currentCell) as {
            getFocusableElements: () => { cells: Array<{ cell: { cellView: TableCellView } }> };
            getRootNode: () => Node;
        } | undefined;
        if (!currentRow) {
            return false;
        }

        const table = this.getContainingHost(currentRow) as Table | undefined;
        if (!table) {
            return false;
        }

        const rowElements = table.rowElements;
        const rowIndex = rowElements.findIndex(row => row === currentRow);
        if (rowIndex < 0) {
            return false;
        }

        const currentRowCells = currentRow.getFocusableElements().cells;
        const columnIndex = currentRowCells.findIndex(cellInfo => cellInfo.cell === currentCell as unknown as typeof cellInfo.cell);
        if (columnIndex < 0) {
            return false;
        }

        const delta = backward ? -1 : 1;
        for (let i = rowIndex + delta; i >= 0 && i < rowElements.length; i += delta) {
            const row = rowElements[i] as {
                getFocusableElements?: () => { cells: Array<{ cell: { cellView: TableCellView } }> };
            };
            if (!row.getFocusableElements) {
                continue;
            }

            const cellInfo = row.getFocusableElements().cells[columnIndex];
            const target = cellInfo?.cell.cellView.tabbableChildren[0];
            if (target) {
                target.focus();
                return true;
            }
        }

        return false;
    }

    private getContainingHost(element: { getRootNode: () => Node }): HTMLElement | undefined {
        const root = element.getRootNode();
        if (root instanceof ShadowRoot && root.host instanceof HTMLElement) {
            return root.host;
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
