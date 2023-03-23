import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';

export interface TableGroupHeaderValueState<
    TGroupValue = unknown,
    TColumnConfig = unknown
> {
    groupHeaderValue: TGroupValue;
    columnConfig?: TColumnConfig;
}

/**
 * dsa
 */
export abstract class TableGroupHeaderView<
    TGroupValue = unknown,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableGroupHeaderValueState<TGroupValue, TColumnConfig> {
    @observable
    public groupHeaderValue!: TGroupValue;

    @observable
    public columnConfig?: TColumnConfig;
}
