import {
    type Notifier,
    Observable,
    attr,
    observable,
    volatile
} from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState } from '../../../table-column/base/types';
import type {
    CellViewSlotRequestEventDetail,
    RowSlotRequestEventDetail,
    TableActionMenuToggleEventDetail,
    TableFieldName,
    TableRecord,
    TableRowExpansionToggleEventDetail,
    TableRowFocusableElements,
    TableRowSelectionToggleEventDetail
} from '../../types';
import type { TableColumn } from '../../../table-column/base';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { tableCellTag } from '../cell';
import {
    ColumnInternals,
    isColumnInternalsProperty
} from '../../../table-column/base/models/column-internals';
import type { Checkbox } from '../../../checkbox';

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

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr({ attribute: 'reserve-collapse-space', mode: 'boolean' })
    public reserveCollapseSpace = false;

    @observable
    public dataRecord?: TDataRecord;

    /**
     * @internal
     * */
    public columnNotifiers: Notifier[] = [];

    @observable
    public columns: TableColumn[] = [];

    @observable
    public currentActionMenuColumn?: TableColumn;

    @observable
    public nestingLevel = 0;

    /**
     * Row index in the flattened set of all regular and group header rows.
     * Represents the index in table.tableData (TableRowState[]).
     */
    @observable
    public resolvedRowIndex?: number;

    @attr({ attribute: 'is-parent-row', mode: 'boolean' })
    public isParentRow = false;

    @attr({ attribute: 'menu-open', mode: 'boolean' })
    public menuOpen = false;

    @attr({ attribute: 'row-operation-grid-cell-hidden', mode: 'boolean' })
    public rowOperationGridCellHidden = false;

    @attr({ mode: 'boolean' })
    public loading = false;

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

    /**
     * @internal
     */
    public readonly expandIcon?: HTMLElement;

    /**
     * @internal
     */
    @observable
    public animationClass = '';

    /**
     * @internal
     */
    @attr({ attribute: 'allow-hover', mode: 'boolean' })
    public allowHover = false;

    @volatile
    public get isTopLevelParentRow(): boolean {
        return this.isParentRow && this.nestingLevel === 0;
    }

    @volatile
    public get isNestedParent(): boolean {
        return this.isParentRow && this.nestingLevel > 0;
    }

    /** @internal */
    @volatile
    public get showSelectionCheckbox(): boolean {
        return this.selectable && !this.hideSelection;
    }

    // Programmatically updating the selection state of a checkbox fires the 'change' event.
    // Therefore, selection change events that occur due to programmatically updating
    // the selection checkbox 'checked' value should be ingored.
    // https://github.com/microsoft/fast/issues/5750
    private ignoreSelectionChangeEvents = false;

    @volatile
    public override get ariaSelected(): 'true' | 'false' | null {
        if (this.selectable) {
            return this.selected ? 'true' : 'false';
        }

        return null;
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeColumnObservers();
    }

    /** @internal */
    public onSelectionCheckboxChange(event: CustomEvent): void {
        if (this.ignoreSelectionChangeEvents) {
            return;
        }

        const checkbox = event.target as Checkbox;
        const checked = checkbox.checked;
        this.onSelectionChange(!checked, checked);
    }

    /** @internal */
    public onSelectionChange(oldState: boolean, newState: boolean): void {
        this.selected = newState;
        const detail: TableRowSelectionToggleEventDetail = {
            oldState,
            newState
        };
        this.$emit('row-selection-toggle', detail);
    }

    /** @internal */
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

    /** @internal */
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

    /** @internal */
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

    /** @internal */
    public getFocusableElements(): TableRowFocusableElements {
        return {
            selectionCheckbox: this.showSelectionCheckbox
                ? this.selectionCheckbox
                : undefined,
            cells: Array.from(
                this.cellContainer.querySelectorAll(tableCellTag)
            ).map(cell => ({
                cell,
                actionMenuButton: cell.hasActionMenu
                    ? cell.actionMenuButton
                    : undefined
            }))
        };
    }

    public onRowExpandToggle(event?: Event): void {
        const expandEventDetail: TableRowExpansionToggleEventDetail = {
            oldState: this.expanded,
            newState: !this.expanded,
            recordId: this.recordId!
        };
        this.$emit('row-expand-toggle', expandEventDetail);
        event?.stopImmediatePropagation();
        // To avoid a visual glitch with improper expand/collapse icons performing an
        // animation (due to visual re-use apparently), we apply a class to the
        // contained expand-collapse button temporarily. We use the 'transitionend' event
        // to remove the temporary class and register a function reference as the handler
        // to avoid issues that may result from the 'transitionend' event not firing, as it
        // will never result in multiple event listeners being registered.
        this.animationClass = 'animating';
        this.expandIcon?.addEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    }

    public onCellViewSlotsRequest(
        column: TableColumn,
        event: CustomEvent<CellViewSlotRequestEventDetail>
    ): void {
        event.stopImmediatePropagation();
        if (typeof this.recordId !== 'string') {
            // The recordId is expected to be defined on any row that can be interacted with, but if
            // it isn't defined, nothing can be done with the request to slot content into the row.
            return;
        }

        const eventDetails: RowSlotRequestEventDetail = {
            recordId: this.recordId,
            columnInternalId: column.columnInternals.uniqueId,
            slots: event.detail.slots
        };
        this.$emit('row-slots-request', eventDetails);
    }

    private readonly removeAnimatingClass = (): void => {
        this.animationClass = '';
        this.expandIcon?.removeEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    };

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
            return i === 0 ? this.nestingLevel : 0;
        });
    }

    private removeColumnObservers(): void {
        this.columnNotifiers.forEach(notifier => {
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
export const tableRowTag = 'nimble-table-row';
