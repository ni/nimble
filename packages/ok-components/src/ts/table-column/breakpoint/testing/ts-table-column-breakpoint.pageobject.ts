import type { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { anchoredRegionTag } from '@ni/nimble-components/dist/esm/anchored-region';
import { BreakpointState } from '../types';
import { TsTableColumnBreakpointCellView } from '../cell-view';

/**
 * Page object for ts-table-column-breakpoint tests.
 */
export class TsTableColumnBreakpointPageObject<T extends TableRecord> {
    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public clickBreakpointButton(rowIndex: number, columnIndex: number): void {
        this.getBreakpointButton(rowIndex, columnIndex).click();
    }

    public rightClickBreakpointButton(rowIndex: number, columnIndex: number): void {
        this.getBreakpointButton(rowIndex, columnIndex).dispatchEvent(
            new MouseEvent('contextmenu', { bubbles: true })
        );
    }

    public focusBreakpointButton(rowIndex: number, columnIndex: number): void {
        this.getBreakpointButton(rowIndex, columnIndex).focus();
    }

    public pressBreakpointButtonKey(
        rowIndex: number,
        columnIndex: number,
        eventInit: KeyboardEventInit
    ): boolean {
        return this.getBreakpointButton(rowIndex, columnIndex).dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                ...eventInit
            })
        );
    }

    public getBreakpointButtonIconTag(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconTag = this
            .getBreakpointButton(rowIndex, columnIndex)
            .querySelector(':scope > *')
            ?.tagName;
        return iconTag?.toLocaleLowerCase() ?? '';
    }

    public getCurrentState(rowIndex: number, columnIndex: number): BreakpointState {
        return this.getRenderedCellView(rowIndex, columnIndex).currentState;
    }

    public getTooltipText(rowIndex: number, columnIndex: number): string {
        return this.getRenderedCellView(rowIndex, columnIndex).tooltipText;
    }

    public getTabbableChildrenCount(rowIndex: number, columnIndex: number): number {
        return this.getRenderedCellView(rowIndex, columnIndex).tabbableChildren.length;
    }

    public isContextMenuOpen(rowIndex: number, columnIndex: number): boolean {
        return this.getContextMenuRegion(rowIndex, columnIndex) !== null;
    }

    public isRowMenuOpen(rowIndex: number): boolean {
        return this.tablePageObject.getRow(rowIndex).hasAttribute('menu-open');
    }

    public pressContextMenuKey(
        rowIndex: number,
        columnIndex: number,
        eventInit: KeyboardEventInit
    ): boolean {
        const region = this.getContextMenuRegion(rowIndex, columnIndex);
        if (!region) {
            throw new Error(
                `Expected context menu at cell ${rowIndex},${columnIndex}`
            );
        }

        return region.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                ...eventInit
            })
        );
    }

    private getRenderedCellView(
        rowIndex: number,
        columnIndex: number
    ): TsTableColumnBreakpointCellView {
        return this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        ) as TsTableColumnBreakpointCellView;
    }

    private getBreakpointButton(
        rowIndex: number,
        columnIndex: number
    ): HTMLButtonElement {
        const button = this.getRenderedCellView(
            rowIndex,
            columnIndex
        ).shadowRoot!.querySelector<HTMLButtonElement>('.breakpoint-button');
        if (!button) {
            throw new Error(
                `Expected breakpoint button at cell ${rowIndex},${columnIndex}`
            );
        }
        return button;
    }

    private getContextMenuRegion(
        rowIndex: number,
        columnIndex: number
    ): HTMLElement | null {
        return this.getRenderedCellView(
            rowIndex,
            columnIndex
        ).shadowRoot!.querySelector(anchoredRegionTag);
    }
}