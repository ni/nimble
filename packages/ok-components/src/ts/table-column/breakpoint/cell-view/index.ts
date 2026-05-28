import { DesignSystem } from '@ni/fast-foundation';
import { TableCellView } from '@ni/nimble-components/dist/esm/table-column/base/cell-view';
import { template } from './template';
import { styles } from './styles';
import { BreakpointState, type BreakpointToggleEventDetail, type BreakpointContextMenuEventDetail } from '../types';
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

    /** @internal */
    public button?: HTMLButtonElement;

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
        const mouseEvent = event as MouseEvent;
        this.emitContextMenu(mouseEvent.clientX, mouseEvent.clientY);
    }

    /** @internal */
    public onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this.onButtonClick(event);
            return;
        }

        if ((event.key === 'F10' && event.shiftKey)
            || event.key === TsTableColumnBreakpointCellView.menuKeyAlias) {
            event.preventDefault();
            event.stopPropagation();
            this.emitContextMenuFromButton();
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

    private emitContextMenu(anchorX: number, anchorY: number): void {
        const detail: BreakpointContextMenuEventDetail = {
            recordId: this.recordId ?? '',
            currentState: this.currentState,
            anchorX,
            anchorY
        };
        this.$emit('breakpoint-column-context-menu', detail);
    }

    private emitContextMenuFromButton(): void {
        const rect = this.button?.getBoundingClientRect();
        if (rect) {
            this.emitContextMenu(rect.left, rect.bottom);
        } else {
            this.emitContextMenu(0, 0);
        }
    }
}

const tsTableColumnBreakpointCellView = TsTableColumnBreakpointCellView.compose({
    baseName: 'ts-table-column-breakpoint-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('ok').register(tsTableColumnBreakpointCellView());
export const tsTableColumnBreakpointCellViewTag = 'ok-ts-table-column-breakpoint-cell-view';
