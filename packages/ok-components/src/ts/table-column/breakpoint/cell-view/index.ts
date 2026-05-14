import { DesignSystem } from '@ni/fast-foundation';
import { TableCellView } from '@ni/nimble-components/dist/esm/table-column/base/cell-view';
import type { MenuButton } from '@ni/nimble-components/dist/esm/menu-button';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import { template } from './template';
import { styles } from './styles';
import { BreakpointState, type BreakpointToggleEventDetail } from '../types';
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
    private static readonly contextMenuKey = 'ContextMenu';

    private static readonly legacyContextMenuKey = 'Apps';

    private static readonly menuKeyAlias = 'Menu';

    /** @internal */
    public contextMenuButton?: MenuButton;

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
            default:
                return 'Add breakpoint';
        }
    }

    public override get tabbableChildren(): HTMLElement[] {
        const button = this.shadowRoot?.querySelector('.breakpoint-button') as HTMLElement | null;
        if (button) {
            return [button];
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
        this.openContextMenu();
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
            this.openContextMenu();
            return;
        }

        if (event.key === 'F9' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b')) {
            event.preventDefault();
            event.stopPropagation();
            this.onButtonClick(event);
        }
    }

    /** @internal */
    public onDisableMenuItemSelected(): void {
        this.emitToggle(this.currentState, BreakpointState.disabled);
    }

    /** @internal */
    public onAddMenuItemSelected(): void {
        this.emitToggle(this.currentState, BreakpointState.enabled);
    }

    /** @internal */
    public onEnableMenuItemSelected(): void {
        this.emitToggle(this.currentState, BreakpointState.enabled);
    }

    /** @internal */
    public onRemoveMenuItemSelected(): void {
        this.emitToggle(this.currentState, BreakpointState.off);
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

    private openContextMenu(): void {
        if (this.contextMenuButton && !this.contextMenuButton.open) {
            this.contextMenuButton.open = true;
        }
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
