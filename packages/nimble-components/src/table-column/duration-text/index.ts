import {
    DesignSystem,
    DesignTokenSubscriber
} from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnDurationTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { lang } from '../../theme-provider';
import { DurationFormatter } from './models/duration-formatter';
import { tableColumnDurationTextGroupHeaderViewTag } from './group-header-view';
import type { TableColumnTextBaseColumnConfig } from '../text-base/cell-view';
import { TableColumnTextBase, mixinTextBase } from '../text-base';

export type TableColumnDurationTextCellRecord = TableNumberField<'value'>;
export interface TableColumnDurationTextColumnConfig
    extends TableColumnTextBaseColumnConfig {
    formatter: DurationFormatter;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-duration-text': TableColumnDurationText;
    }
}

/**
 * The table column for displaying a duration value as text.
 */
export class TableColumnDurationText extends mixinTextBase(TableColumnTextBase<TableColumnDurationTextColumnConfig>) {
    private readonly langSubscriber: DesignTokenSubscriber<typeof lang> = {
        handleChange: () => {
            this.updateColumnConfig();
        }
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        lang.subscribe(this.langSubscriber, this);
        this.updateColumnConfig();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        lang.unsubscribe(this.langSubscriber, this);
    }

    public placeholderChanged(): void {
        this.updateColumnConfig();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnDurationTextCellViewTag,
            groupHeaderViewTag: tableColumnDurationTextGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    private updateColumnConfig(): void {
        const formatter = new DurationFormatter(lang.getValueFor(this));

        const columnConfig: TableColumnDurationTextColumnConfig = {
            formatter,
            placeholder: this.placeholder
        };
        this.columnInternals.columnConfig = columnConfig;
    }
}

const nimbleTableColumnDurationText = TableColumnDurationText.compose({
    baseName: 'table-column-duration-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnDurationText());
export const tableColumnDurationTextTag = 'nimble-table-column-duration-text';
