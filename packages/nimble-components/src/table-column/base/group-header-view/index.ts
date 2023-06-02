import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { TableFieldValue } from '../../../table/types';

export interface TableGroupHeaderState<
    TGroupValue = TableFieldValue,
    TColumnConfig = unknown
> {
    groupHeaderValue: TGroupValue;
    columnConfig?: TColumnConfig;
}

/**
 * The base class for group header views, which are displayed in a TableGroupRow.
 * A TableColumn that uses the GroupableColumn mixin must provide a TableGroupHeaderView
 * type (linked via TableColumn.groupHeaderViewTag).
 */
export abstract class TableGroupHeaderView<
    TGroupValue = TableFieldValue,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableGroupHeaderState<TGroupValue, TColumnConfig> {
    @observable
    public groupHeaderValue!: TGroupValue;

    @observable
    public columnConfig?: TColumnConfig;
}
