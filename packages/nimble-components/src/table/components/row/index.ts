import { attr, observable, volatile } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState } from '../../../table-column/base/types';
import type {
    TableActionMenuToggleEventDetail,
    TableFieldName,
    TableRecord
} from '../../types';
import type { TableColumn } from '../../../table-column/base';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { TableCell } from '../cell';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

export interface ColumnState {
    column: TableColumn;
    cellState: TableCellState;
    cellIndentLevel: number;
}

/** Represents a single row (element) in the Table's data  */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableDataRecord extends TableRecord {}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TDataRecord extends TableDataRecord = TableDataRecord
> extends FoundationElement {
    @attr({ attribute: 'record-id' })
    public recordId?: string;

    @attr({ mode: 'boolean' })
    public selectable = false;

    @attr({ mode: 'boolean' })
    public selected = false;

    @observable
    public dataRecord?: TDataRecord;

    @observable
    public columns: TableColumn[] = [];

    @observable
    public currentActionMenuColumn?: TableColumn;

    @observable
    public nestingLevel = 0;

    @attr({ attribute: 'menu-open', mode: 'boolean' })
    public menuOpen = false;

    @volatile
    public get columnStates(): ColumnState[] {
        return this.columns.map((column, i) => {
            const fieldNames = column.dataRecordFieldNames;
            let cellState: TableCellState;
            if (this.hasValidFieldNames(fieldNames) && this.dataRecord) {
                const cellDataValues = fieldNames.map(
                    field => this.dataRecord![field]
                );
                const cellRecord = Object.fromEntries(
                    column.cellRecordFieldNames.map((k, j) => [
                        k,
                        cellDataValues[j]
                    ])
                );
                const columnConfig = column.columnConfig ?? {};
                cellState = {
                    cellRecord,
                    columnConfig
                };
            } else {
                cellState = {
                    cellRecord: {},
                    columnConfig: {}
                };
            }
            const cellIndentLevel = i === 0 ? this.nestingLevel : 0;
            return { column, cellState, cellIndentLevel };
        });
    }

    @volatile
    public override get ariaSelected(): 'true' | 'false' | null {
        if (this.selectable) {
            return this.selected ? 'true' : 'false';
        }

        return null;
    }

    public onCellActionMenuBeforeToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>,
        column: TableColumn
    ): void {
        this.currentActionMenuColumn = column;
        this.emitToggleEvent(
            'row-action-menu-beforetoggle',
            event.detail,
            column
        );
    }

    public onCellActionMenuToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>,
        column: TableColumn
    ): void {
        this.menuOpen = event.detail.newState;
        this.emitToggleEvent('row-action-menu-toggle', event.detail, column);
    }

    public closeOpenActionMenus(): void {
        if (this.menuOpen) {
            const cellWithMenuOpen = Array.from(this.shadowRoot!.children).find(
                c => c instanceof TableCell && c.menuOpen
            ) as TableCell;
            if (cellWithMenuOpen?.actionMenuButton?.open) {
                cellWithMenuOpen.actionMenuButton.toggleButton!.control.click();
            }
        }
    }

    private emitToggleEvent(
        eventType: string,
        menuButtonEventDetail: MenuButtonToggleEventDetail,
        column: TableColumn
    ): void {
        const detail: TableActionMenuToggleEventDetail = {
            newState: menuButtonEventDetail.newState,
            oldState: menuButtonEventDetail.oldState,
            recordIds: [this.recordId!],
            columnId: column.columnId
        };
        this.$emit(eventType, detail);
    }

    private hasValidFieldNames(
        keys: readonly (TableFieldName | undefined)[]
    ): keys is TableFieldName[] {
        return keys.every(key => key !== undefined);
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
export const tableRowTag = DesignSystem.tagFor(TableRow);
