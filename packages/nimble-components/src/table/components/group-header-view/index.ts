import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

export interface TableGroupHeaderState<
    TGroupValue = unknown,
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
    TGroupValue = unknown,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableGroupHeaderState<TGroupValue, TColumnConfig> {
    @observable
    public groupHeaderValue!: TGroupValue;

    @observable
    public columnConfig?: TColumnConfig;
}
