import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { TableFieldValue } from '../../types';

export interface TableGroupHeaderValueState<TColumnConfig = unknown> {
    groupHeaderValue: TableFieldValue;
    columnConfig?: TColumnConfig;
}

/**
 * dsa
 */
export abstract class TableGroupHeaderView<TColumnConfig>
    extends FoundationElement
    implements TableGroupHeaderValueState<TColumnConfig> {
    @observable
    public groupHeaderValue: TableFieldValue;

    @observable
    public columnConfig?: TColumnConfig;
}
