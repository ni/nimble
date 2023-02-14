import { attr, observable, volatile } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type {
    TableActionMenuToggleEventDetail,
    TableCellState,
    TableDataRecord,
    TableFieldName
} from '../../types';
import type { TableColumn } from '../../../table-column/base';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

export interface ColumnState {
    column: TableColumn;
    cellState: TableCellState;
}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TDataRecord extends TableDataRecord = TableDataRecord
> extends FoundationElement {
    @attr({ attribute: 'record-id' })
    public recordId?: string;

    @observable
    public dataRecord?: TDataRecord;

    @observable
    public columns: TableColumn[] = [];

    @observable
    public currentActionMenuColumn?: TableColumn;

    @observable
    public menuIsOpen = false;

    @volatile
    public get columnStates(): ColumnState[] {
        return this.columns.map(column => {
            const fieldNames = column.getDataRecordFieldNames();
            let cellState: TableCellState;
            if (this.hasValidFieldNames(fieldNames) && this.dataRecord) {
                const cellDataValues = fieldNames.map(
                    field => this.dataRecord![field]
                );
                const cellRecord = Object.fromEntries(
                    column.cellRecordFieldNames.map((k, i) => [
                        k,
                        cellDataValues[i]
                    ])
                );
                const columnConfig = column.getColumnConfig?.() ?? {};
                cellState = {
                    cellRecord,
                    columnConfig
                };
            } else {
                cellState = { cellRecord: {}, columnConfig: {} };
            }

            return { column, cellState };
        });
    }

    public onCellActionMenuBeforeToggle(
        event: CustomEvent,
        column: TableColumn
    ): void {
        this.currentActionMenuColumn = column;
        this.emitToggleEvent(
            'row-action-menu-beforetoggle',
            event.detail as MenuButtonToggleEventDetail,
            column
        );
    }

    public onCellActionMenuToggle(
        event: CustomEvent,
        column: TableColumn
    ): void {
        const menuButtonEventDetail = event.detail as MenuButtonToggleEventDetail;
        this.menuIsOpen = menuButtonEventDetail.newState;
        this.emitToggleEvent(
            'row-action-menu-toggle',
            menuButtonEventDetail,
            column
        );
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
        keys: (TableFieldName | undefined)[]
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
