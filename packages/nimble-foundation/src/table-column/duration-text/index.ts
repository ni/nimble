import {
    DesignSystem,
    DesignTokenSubscriber
} from '@microsoft/fast-foundation';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnDurationTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { lang } from '../../theme-provider';
import { DurationFormatter } from './models/duration-formatter';
import { tableColumnDurationTextGroupHeaderViewTag } from './group-header-view';

export type TableColumnDurationTextCellRecord = TableNumberField<'value'>;
export interface TableColumnDurationTextColumnConfig {
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
export class TableColumnDurationText extends TableColumnTextBase {
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

        if (formatter) {
            const columnConfig: TableColumnDurationTextColumnConfig = {
                formatter
            };
            this.columnInternals.columnConfig = columnConfig;
        } else {
            this.columnInternals.columnConfig = undefined;
        }
    }
}

export const tableColumnDurationTextTag = DesignSystem.tagFor(
    TableColumnDurationText
);
