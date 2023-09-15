import {
    Notifier,
    Observable,
    attr,
    observable,
    volatile
} from '@microsoft/fast-element';
import {
    Checkbox,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState } from '../../../table-column/base/types';
import type {
    TableActionMenuToggleEventDetail,
    TableFieldName,
    TableRecord,
    TableRowSelectionToggleEventDetail
} from '../../types';
import type { TableColumn } from '../../../table-column/base';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { TableCell } from '../cell';
import {
    ColumnInternals,
    isColumnInternalsProperty
} from '../../../table-column/base/models/column-internals';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
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

    @attr({ attribute: 'hide-selection', mode: 'boolean' })
    public hideSelection = false;

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

    /**
     * @internal
     * An array that parallels the `columns` array and contains the indent
     * level of each column's cell.
     * */
    @observable
    public cellIndentLevels: number[] = [];

    /**
     * @internal
     * An array that parallels the `columns` array and contains the cell state
     * of each column's cell.
     * */
    @observable
    public cellStates: (TableCellState | undefined)[] = [];

    /** @internal */
    @observable
    public readonly selectionCheckbox?: Checkbox;

    /** @internal */
    public readonly cellContainer!: HTMLSpanElement;

    // Programmatically updating the selection state of a checkbox fires the 'change' event.
    // Therefore, selection change events that occur due to programmatically updating
    // the selection checkbox 'checked' value should be ingored.
    // https://github.com/microsoft/fast/issues/5750
    private ignoreSelectionChangeEvents = false;

    private columnNotifiers?: Notifier[] = [];

    @volatile
    public override get ariaSelected(): 'true' | 'false' | null {
        if (this.selectable) {
            return this.selected ? 'true' : 'false';
        }

        return null;
    }

    public onSelectionChange(event: CustomEvent): void {
        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        const checkbox = event.target as Checkbox;
        const checked = checkbox.checked;
        this.selected = checked;
        const detail: TableRowSelectionToggleEventDetail = {
            oldState: !checked,
            newState: checked
        };
        this.$emit('row-selection-toggle', detail);
    }

    public onCellActionMenuBeforeToggle(
        event: CustomEvent<MenuButtonToggleEventDetail>,
        column: TableColumn
    ): void {
        this.currentActionMenuColumn = column;
        this.emitActionMenuToggleEvent(
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
        this.emitActionMenuToggleEvent(
            'row-action-menu-toggle',
            event.detail,
            column
        );
    }

    public closeOpenActionMenus(): void {
        if (this.menuOpen) {
            const cellWithMenuOpen = Array.from(
                this.cellContainer.children
            ).find(c => c instanceof TableCell && c.menuOpen) as TableCell;
            if (cellWithMenuOpen?.actionMenuButton?.open) {
                cellWithMenuOpen.actionMenuButton.toggleButton!.control.click();
            }
        }
    }

    public handleChange(source: unknown, args: unknown): void {
        if (
            source instanceof ColumnInternals
            && typeof args === 'string'
            && (isColumnInternalsProperty(args, 'columnConfig')
                || isColumnInternalsProperty(args, 'dataRecordFieldNames'))
        ) {
            this.updateCellStates();
        }
    }

    private emitActionMenuToggleEvent(
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

    private columnsChanged(): void {
        this.updateCellIndentLevels();
        this.updateCellStates();

        this.observeColumns();
    }

    private dataRecordChanged(): void {
        this.updateCellStates();
    }

    private nestingLevelChanged(): void {
        this.updateCellIndentLevels();
    }

    private updateCellIndentLevels(): void {
        this.cellIndentLevels = this.columns.map((_, i) => {
            if (i === 0 && this.nestingLevel > 0) {
                return this.nestingLevel - 1;
            }
            return 0;
        });
    }

    private removeColumnObservers(): void {
        this.columnNotifiers?.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.columnNotifiers = [];
    }

    private observeColumns(): void {
        this.removeColumnObservers();

        this.columnNotifiers = this.columns.map(column => {
            const notifier = Observable.getNotifier(column.columnInternals);
            notifier.subscribe(this);
            return notifier;
        });
    }

    private updateCellStates(): void {
        this.cellStates = this.columns.map(column => {
            const fieldNames = column.columnInternals.dataRecordFieldNames;
            let cellState: TableCellState | undefined;
            if (this.hasValidFieldNames(fieldNames) && this.dataRecord) {
                const cellDataValues = fieldNames.map(
                    field => this.dataRecord![field]
                );
                const cellRecord = Object.fromEntries(
                    column.columnInternals.cellRecordFieldNames.map((k, j) => [
                        k,
                        cellDataValues[j]
                    ])
                );
                const columnConfig = column.columnInternals.columnConfig;
                cellState = {
                    cellRecord,
                    columnConfig
                };
            }
            return cellState;
        });
    }

    private hasValidFieldNames(
        keys: readonly (TableFieldName | undefined)[]
    ): keys is TableFieldName[] {
        return keys.every(key => key !== undefined);
    }

    private selectedChanged(): void {
        this.setSelectionCheckboxState();
    }

    private selectionCheckboxChanged(): void {
        this.setSelectionCheckboxState();
    }

    private setSelectionCheckboxState(): void {
        if (this.selectionCheckbox) {
            this.ignoreSelectionChangeEvents = true;
            this.selectionCheckbox.checked = this.selected;
            this.ignoreSelectionChangeEvents = false;
        }
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
export const tableRowTag = DesignSystem.tagFor(TableRow);
