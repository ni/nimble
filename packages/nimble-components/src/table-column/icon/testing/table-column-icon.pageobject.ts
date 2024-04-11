import { Icon } from '../../../icon-base';
import { Spinner } from '../../../spinner';
import type { TablePageObject } from '../../../table/testing/table.pageobject';
import type { TableRecord } from '../../../table/types';
import type { TableCellView } from '../../base/cell-view';
import type { TableGroupHeaderView } from '../../base/group-header-view';

/**
 * Page object for `nimble-table-column-icon`.
 */
export class TableColumnIconPageObject<T extends TableRecord> {
    public constructor(private readonly tablePageObject: TablePageObject<T>) {}

    public getRenderedCellIconSeverity(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconOrSpinner = this.getRenderedIconOrSpinner(
            this.tablePageObject.getRenderedCellView(rowIndex, columnIndex)
        );
        if (!(iconOrSpinner instanceof Icon)) {
            throw new Error(
                `Icon not found at cell ${rowIndex},${columnIndex}`
            );
        }
        return iconOrSpinner.severity ?? '';
    }

    public getRenderedCellIconAriaLabel(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconOrSpinner = this.getRenderedIconOrSpinner(
            this.tablePageObject.getRenderedCellView(rowIndex, columnIndex)
        );
        return iconOrSpinner.getAttribute('aria-label') ?? '';
    }

    public getRenderedCellIconAriaHidden(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconOrSpinner = this.getRenderedIconOrSpinner(
            this.tablePageObject.getRenderedCellView(rowIndex, columnIndex)
        );
        return iconOrSpinner.getAttribute('aria-hidden') ?? '';
    }

    public getRenderedCellIconTitle(
        rowIndex: number,
        columnIndex: number
    ): string {
        const iconOrSpinner = this.getRenderedIconOrSpinner(
            this.tablePageObject.getRenderedCellView(rowIndex, columnIndex)
        );
        return iconOrSpinner.title;
    }

    public getRenderedGroupHeaderIconTagName(groupRowIndex: number): string {
        const iconOrSpinner = this.getRenderedIconOrSpinner(
            this.tablePageObject.getGroupRowHeaderView(groupRowIndex)
        );
        return iconOrSpinner.tagName.toLocaleLowerCase();
    }

    public getRenderedCellTextTitle(
        rowIndex: number,
        columnIndex: number
    ): string {
        const cellView = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        const textElement = this.getRenderedTextElement(cellView);
        return textElement?.title ?? '';
    }

    public getRenderedGroupHeaderTextTitle(groupRowIndex: number): string {
        const groupHeader = this.tablePageObject.getGroupRowHeaderView(groupRowIndex);
        const textElement = this.getRenderedTextElement(groupHeader);
        return textElement?.title ?? '';
    }

    public getRenderedCellText(rowIndex: number, columnIndex: number): string {
        const cellView = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        const textElement = this.getRenderedTextElement(cellView);
        return textElement?.textContent?.trim() ?? '';
    }

    public getRenderedGroupHeaderText(groupRowIndex: number): string {
        const groupHeader = this.tablePageObject.getGroupRowHeaderView(groupRowIndex);
        const textElement = this.getRenderedTextElement(groupHeader);
        return textElement?.textContent?.trim() ?? '';
    }

    public dispatchEventToCellText(
        rowIndex: number,
        columnIndex: number,
        event: Event
    ): boolean | undefined {
        const cellView = this.tablePageObject.getRenderedCellView(
            rowIndex,
            columnIndex
        );
        const textElement = this.getRenderedTextElement(cellView);
        return textElement!.dispatchEvent(event);
    }

    public dispatchEventToGroupHeaderText(
        groupRowIndex: number,
        event: Event
    ): boolean | undefined {
        const groupHeader = this.tablePageObject.getGroupRowHeaderView(groupRowIndex);
        const textElement = this.getRenderedTextElement(groupHeader);
        return textElement!.dispatchEvent(event);
    }

    private getRenderedIconOrSpinner(
        view: TableCellView | TableGroupHeaderView
    ): Icon | Spinner {
        const viewShadowRoot = view.shadowRoot!;
        const spinnerOrIcon = viewShadowRoot.querySelector(
            '.reserve-icon-size'
        )?.firstElementChild;
        if (
            !(spinnerOrIcon instanceof Icon || spinnerOrIcon instanceof Spinner)
        ) {
            throw new Error('Icon or Spinner not found');
        }

        return spinnerOrIcon;
    }

    private getRenderedTextElement(
        view: TableCellView | TableGroupHeaderView
    ): HTMLSpanElement | null {
        return view.shadowRoot!.querySelector<HTMLSpanElement>('.text');
    }
}
