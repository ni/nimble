/* eslint-disable max-classes-per-file */
import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '../../text';
import type {
    TableColumnNumericTextCellRecord,
    TableColumnNumericTextColumnConfig
} from '../../numeric-text';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';
import type { TableCellRecord } from '../../base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-cell-view': TableColumnTextCellView;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-numeric-text-cell-view': TableColumnNumericTextCellView;
    }
}

/**
 * A cell view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextCellViewBase<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> extends TableCellView<TCellRecord, TColumnConfig> {
    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    public textSpan!: HTMLElement;

    public abstract get text(): string;

    public abstract get placeholder(): string;

    public abstract get shouldUsePlaceholder(): boolean;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder
            ? this.placeholder
            : this.text;
    }
}

/**
 * A cell view for displaying strings as text
 */
export class TableColumnTextCellView extends TableColumnTextCellViewBase<TableColumnTextCellRecord, TableColumnTextColumnConfig> {
    public override get text(): string {
        return this.cellRecord.value!;
    }

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.cellRecord.value !== 'string';
    }
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = DesignSystem.tagFor(
    TableColumnTextCellView
);

/**
 * A cell view for displaying numbers as text
 */
 export class TableColumnNumericTextCellView extends TableColumnTextCellViewBase<TableColumnNumericTextCellRecord, TableColumnNumericTextColumnConfig> {
    public override get text(): string {
        return this.cellRecord.value?.toString()!;
    }

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.cellRecord.value !== 'number';
    }
}

const numericTextCellView = TableColumnNumericTextCellView.compose({
    baseName: 'table-column-numeric-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(numericTextCellView());
export const tableColumnNumericTextCellViewTag = DesignSystem.tagFor(
    TableColumnNumericTextCellView
);