/* eslint-disable @typescript-eslint/prefer-readonly */
import type { MenuButton } from '../../menu-button';
import type { TableCell } from '../components/cell';
import { TableFocusType, TableHeaderFocusableElements, TableRowFocusableElements } from '../types';

/**
 * Table focus state
 */
export class TableFocusState {
    public get focusType(): TableFocusType {
        return this._focusType;
    }

    public get headerActionIndex(): number {
        return this._headerActionIndex;
    }

    public get rowIndex(): number {
        return this._rowIndex;
    }

    public get columnIndex(): number {
        return this._columnIndex;
    }

    public get cellContentIndex(): number {
        return this._cellContentIndex;
    }

    private _focusType: TableFocusType = TableFocusType.none;
    private _headerActionIndex = -1;
    private _rowIndex = -1;
    private _columnIndex = -1;
    private _cellContentIndex = -1;

    public setNoFocusType(): void {
        this._focusType = TableFocusType.none;
        this._headerActionIndex = -1;
        this._rowIndex = -1;
        this._columnIndex = -1;
        this._cellContentIndex = -1;
    }

    public setCellActionMenuType(rowIndex?: number, columnIndex?: number): void {
        this._focusType = TableFocusType.cellActionMenu;
        if (rowIndex !== undefined) {
            this._rowIndex = rowIndex;
        }
        if (columnIndex !== undefined) {
            this._columnIndex = columnIndex;
        }
    }

    public setCellContentType(cellContentIndex: number, rowIndex?: number, columnIndex?: number): void {
        this._focusType = TableFocusType.cellContent;
        this._cellContentIndex = cellContentIndex;
        if (rowIndex !== undefined) {
            this._rowIndex = rowIndex;
        }
        if (columnIndex !== undefined) {
            this._columnIndex = columnIndex;
        }
    }

    public setRowType(rowIndex?: number): void {
        this._focusType = TableFocusType.row;
        if (rowIndex !== undefined) {
            this._rowIndex = rowIndex;
        }
    }

    public setRowSelectionCheckboxType(rowIndex?: number): void {
        this._focusType = TableFocusType.rowSelectionCheckbox;
        if (rowIndex !== undefined) {
            this._rowIndex = rowIndex;
        }
    }

    public setCellType(columnIndex?: number, rowIndex?: number): void {
        this._focusType = TableFocusType.cell;
        if (rowIndex !== undefined) {
            this._rowIndex = rowIndex;
        }
        if (columnIndex !== undefined) {
            this._columnIndex = columnIndex;
        }
    }

    public setColumnHeaderType(columnIndex: number): void {
        this._focusType = TableFocusType.columnHeader;
        this._columnIndex = columnIndex;
    }

    public setHeaderActionType(headerActionIndex: number): void {
        this._focusType = TableFocusType.headerActions;
        this._headerActionIndex = headerActionIndex;
    }

    public hasRowOrCellFocusType(): boolean {
        switch (this.focusType) {
            case TableFocusType.cell:
            case TableFocusType.cellActionMenu:
            case TableFocusType.cellContent:
            case TableFocusType.row:
            case TableFocusType.rowSelectionCheckbox:
                return true;
            default:
                return false;
        }
    }

    public hasHeaderFocusType(): boolean {
        switch (this.focusType) {
            case TableFocusType.headerActions:
            case TableFocusType.columnHeader:
                return true;
            default:
                return false;
        }
    }

    public canSetCellFocusType(rowFocusableElements: TableRowFocusableElements, columnIndex?: number): boolean {
        const newColumnIndex = columnIndex ?? this._columnIndex;
        return newColumnIndex >= 0 && newColumnIndex <= rowFocusableElements.cells.length;
    }

    public canSetCellActionMenuFocusType(rowFocusableElements: TableRowFocusableElements, columnIndex?: number): boolean {
        const newColumnIndex = columnIndex ?? this._columnIndex;
        const cellInfo = rowFocusableElements.cells[newColumnIndex];
        if (cellInfo !== undefined) {
            return cellInfo.actionMenuButton !== undefined;
        }
        return false;
    }

    public canSetCellContentFocusType(rowFocusableElements: TableRowFocusableElements, cellContentIndex: number, columnIndex?: number): boolean {
        const newColumnIndex = columnIndex ?? this._columnIndex;
        const cellInfo = rowFocusableElements.cells[newColumnIndex];
        if (cellInfo !== undefined) {
            return cellInfo.cell.cellView.tabbableChildren[cellContentIndex] !== undefined;
        }
        return false;
    }

    public canSetHeaderActionFocusType(headerFocusableElements: TableHeaderFocusableElements, headerActionIndex?: number): boolean {
        const newHeaderActionIndex = headerActionIndex ?? this._headerActionIndex;
        return headerFocusableElements.headerActions[newHeaderActionIndex] !== undefined;
    }

    public canSetColumnHeaderFocusType(headerFocusableElements: TableHeaderFocusableElements, columnIndex?: number): boolean {
        const newColumnIndex = columnIndex ?? this._columnIndex;
        return headerFocusableElements.columnHeaders[newColumnIndex] !== undefined;
    }
}