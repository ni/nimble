import { DesignSystem } from '@microsoft/fast-foundation';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnDateTextCellRecord,
    TableColumnDateTextColumnConfig
} from '..';
import { styles } from '../../text-base/cell-view/styles';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import type { TableNumberFieldValue } from '../../../table/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-cell-view': TableColumnDateTextCellView;
    }
}

/**
 * A cell view for displaying date/time fields as text
 */
export class TableColumnDateTextCellView extends TableColumnTextCellViewBase<
TableColumnDateTextCellRecord,
TableColumnDateTextColumnConfig
> {
    public static formatNumericDate(
        date: TableNumberFieldValue,
        columnConfig?: TableColumnDateTextColumnConfig
    ): string {
        if (!columnConfig) {
            return '';
        }
        let options: Intl.DateTimeFormatOptions;
        if (columnConfig.format === 'custom') {
            options = TableColumnDateTextCellView.getCustomFormattingOptions(
                columnConfig
            );
        } else {
            options = {
                dateStyle: 'medium',
                timeStyle: 'medium'
            };
        }
        if (typeof date === 'number') {
            const formatter = new Intl.DateTimeFormat(undefined, options);
            try {
                return formatter.format(date);
            } catch (e) {
                return '';
            }
        } else {
            return '';
        }
    }

    private static getCustomFormattingOptions(
        columnConfig: TableColumnDateTextColumnConfig
    ): Intl.DateTimeFormatOptions {
        const options: Intl.DateTimeFormatOptions = {};
        options.localeMatcher = columnConfig.customLocaleMatcher;
        options.weekday = columnConfig.customWeekday;
        options.era = columnConfig.customEra;
        options.year = columnConfig.customYear;
        options.month = columnConfig.customMonth;
        options.day = columnConfig.customDay;
        options.hour = columnConfig.customHour;
        options.minute = columnConfig.customMinute;
        options.second = columnConfig.customSecond;
        options.timeZoneName = columnConfig.customTimeZoneName;
        options.formatMatcher = columnConfig.customFormatMatcher;
        options.hour12 = columnConfig.customHour12;
        options.timeZone = columnConfig.customTimeZone;
        options.calendar = columnConfig.customCalendar;
        options.dayPeriod = columnConfig.customDayPeriod;
        options.numberingSystem = columnConfig.customNumberingSystem;
        options.dateStyle = columnConfig.customDateStyle;
        options.timeStyle = columnConfig.customTimeStyle;
        options.hourCycle = columnConfig.customHourCycle;
        return options;
    }

    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = TableColumnDateTextCellView.formatNumericDate(
            this.cellRecord.value,
            this.columnConfig
        );
    }
}

const dateTextCellView = TableColumnDateTextCellView.compose({
    baseName: 'table-column-date-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(dateTextCellView());
export const tableColumnDateTextCellViewTag = DesignSystem.tagFor(
    TableColumnDateTextCellView
);
