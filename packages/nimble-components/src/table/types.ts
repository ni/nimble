import type { Checkbox } from '../checkbox';
import type { MenuButton } from '../menu-button';
import type { TableColumn } from '../table-column/base';
import type { ValidityObject } from '../utilities/models/validator';
import type { TableCell } from './components/cell';

/**
 * TableFieldName describes the type associated with keys within
 * a table's records.
 */
export type TableFieldName = string;

/**
 * TableFieldValue describes the type associated with values within
 * a table's records.
 */
export type TableFieldValue = string | number | boolean | null | undefined;

/**
 * TableStringFieldValue describes the type associated with values within
 * a table's string records.
 */
export type TableStringFieldValue = string | null | undefined;

/**
 * TableBooleanFieldValue describes the type associated with values within
 * a table's boolean records.
 */
export type TableBooleanFieldValue = boolean | null | undefined;

/**
 * TableNumberFieldValue describes the type associated with values within
 * a table's number records.
 */
export type TableNumberFieldValue = number | null | undefined;

/**
 * TableRecord describes the data structure that backs a single row in a table.
 * It is made up of fields, which are key/value pairs that have a key of type
 * TableFieldName and a value of type TableFieldValue.
 */
export interface TableRecord {
    [key: TableFieldName]: TableFieldValue;
}

/**
 * @internal
 *
 * Describes a hierarchical data structure that is used for
 * the internal representation of the data, and allows us to represent data with
 * parent-child relationships within Tanstack.
 */
export interface TableNode<TRecord extends TableRecord = TableRecord> {
    subRows?: TableNode<TRecord>[];
    originalIndex: number;
    clientRecord: TRecord;
}

export type TableStringField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableStringFieldValue;
};

export type TableBooleanField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableBooleanFieldValue;
};

export type TableNumberField<FieldName extends TableFieldName> = {
    [name in FieldName]: TableNumberFieldValue;
};

export interface TableValidity extends ValidityObject {
    readonly duplicateRecordId: boolean;
    readonly missingRecordId: boolean;
    readonly invalidRecordId: boolean;
    readonly duplicateColumnId: boolean;
    readonly missingColumnId: boolean;
    readonly duplicateSortIndex: boolean;
    readonly duplicateGroupIndex: boolean;
    readonly idFieldNameNotConfigured: boolean;
    readonly invalidColumnConfiguration: boolean;
    readonly invalidParentIdConfiguration: boolean;
}

/**
 * The hierarachy options for a record in the table.
 */
export interface TableSetRecordHierarchyOptions {
    recordId: string;
    options: TableRecordHierarchyOptions;
}

/**
 * Describes the hierarchy options that can be configured for a record in the table.
 */
export interface TableRecordHierarchyOptions {
    delayedHierarchyState: TableRecordDelayedHierarchyState;
}

export const TableRecordDelayedHierarchyState = {
    none: undefined,
    canLoadChildren: 'can-load-children',
    loadingChildren: 'loading-children'
} as const;
export type TableRecordDelayedHierarchyState =
    (typeof TableRecordDelayedHierarchyState)[keyof typeof TableRecordDelayedHierarchyState];

export interface TableActionMenuToggleEventDetail {
    newState: boolean;
    oldState: boolean;
    recordIds: string[];
    columnId?: string;
}

/**
 * The possible directions a table column can be sorted in.
 */
export const TableColumnSortDirection = {
    none: undefined,
    ascending: 'ascending',
    descending: 'descending'
} as const;
export type TableColumnSortDirection =
    (typeof TableColumnSortDirection)[keyof typeof TableColumnSortDirection];

/**
 * The selection modes of rows in the table.
 */
export const TableRowSelectionMode = {
    none: undefined,
    single: 'single',
    multiple: 'multiple'
} as const;
export type TableRowSelectionMode =
    (typeof TableRowSelectionMode)[keyof typeof TableRowSelectionMode];

/**
 * @internal
 *
 * The possible selection states that the table or a table row can be in.
 */
export const TableRowSelectionState = {
    notSelected: 'not-selected',
    selected: 'selected',
    partiallySelected: 'partially-selected'
} as const;
export type TableRowSelectionState =
    (typeof TableRowSelectionState)[keyof typeof TableRowSelectionState];

/**
 * @internal
 *
 * Internal event detail type for a row's selection state changing
 */
export interface TableRowSelectionToggleEventDetail {
    oldState: boolean;
    newState: boolean;
}

/**
 * Event detail type for row selection events in the table.
 */
export interface TableRowSelectionEventDetail {
    selectedRecordIds: string[];
}

/**
 * Event detail type for row toggle events in the table.
 */
export interface TableRowExpansionToggleEventDetail {
    oldState: boolean;
    newState: boolean;
    recordId: string;
}

/**
 * Event detail type for interactive column configuration changes.
 *
 * The column-configuration-change event is emitted when a column's configuration
 * is modified programmatically, such as by clicking on the column's header to sort
 * the column. The items in the `columns` array are specified in the same order as
 * the columns are listed in the DOM.
 */
export interface TableColumnConfigurationChangeEventDetail {
    columns: TableColumnConfiguration[];
}

/**
 * A representation of the current configuration of a column within the table.
 */
export interface TableColumnConfiguration {
    columnId?: string;
    sortIndex?: number;
    sortDirection: TableColumnSortDirection;
    groupIndex?: number;
    hidden: boolean;
    fractionalWidth: number;
    pixelWidth?: number;
}

/**
 * @internal
 *
 * Internal representation of a row in the table
 */
export interface TableRowState<TData extends TableRecord = TableRecord> {
    record: TData;
    id: string;
    selectionState: TableRowSelectionState;
    isGroupRow: boolean;
    groupRowValue?: unknown;
    isExpanded: boolean;
    nestingLevel?: number;
    immediateChildCount?: number;
    groupColumn?: TableColumn;
    isParentRow: boolean;
    isLoadingChildren: boolean;
    requestedSlots: SlotMetadata[];
    resolvedRowIndex?: number;
}

/**
 * @internal
 *
 * Alignment of column content
 */
export const TableColumnAlignment = {
    left: 'left',
    right: 'right'
} as const;
export type TableColumnAlignment =
    (typeof TableColumnAlignment)[keyof typeof TableColumnAlignment];

/**
 * Table keyboard focus types
 */
export const TableFocusType = {
    none: 'none',
    columnHeader: 'columnHeader',
    headerActions: 'headerActions',
    row: 'row',
    rowSelectionCheckbox: 'rowSelectionCheckbox',
    cell: 'cell',
    cellActionMenu: 'cellActionMenu',
    cellContent: 'cellContent'
} as const;
export type TableFocusType =
    (typeof TableFocusType)[keyof typeof TableFocusType];

/**
 * @internal
 *
 * Focusable elements of a table row
 */
export interface TableRowFocusableElements {
    selectionCheckbox?: Checkbox;
    cells: {
        cell: TableCell,
        actionMenuButton?: MenuButton
    }[];
}

/**
 * Focusable elements of a table's header
 */
export interface TableHeaderFocusableElements {
    headerActions: HTMLElement[];
    columnHeaders: HTMLElement[];
}

/**
 * @internal
 */
export interface CellViewSlotRequestEventDetail {
    slots: SlotMetadata[];
}

/**
 * @internal
 */
export interface RowSlotRequestEventDetail {
    columnInternalId: string;
    recordId: string;
    slots: SlotMetadata[];
}

/**
 * @internal
 */
export interface SlotMetadata {
    slot: string;
    name: string;
}
