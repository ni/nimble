import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { tableColumnDateTextGroupHeaderTag } from './group-header-view';
import { tableColumnDateTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import type {
    DateTextFormat,
    LocaleMatcherAlgorithm,
    EraFormat,
    SimpleNumberFormat,
    TimeZoneFormat,
    FormatMatcherAlgorithm,
    DayPeriodFormat,
    DateStyle,
    TimeStyle,
    HourCycle,
    MonthFormat,
    WeekdayFormat
} from './types';
import { createFormatter } from './models/format-helper';
import { TableColumnDateTextValidator } from './models/table-column-date-text-validator';

export type TableColumnDateTextCellRecord = TableNumberField<'value'>;
export interface TableColumnDateTextColumnConfig {
    format: DateTextFormat;
    customLocaleMatcher: LocaleMatcherAlgorithm;
    customWeekday: WeekdayFormat;
    customEra: EraFormat;
    customYear: SimpleNumberFormat;
    customMonth: MonthFormat;
    customDay: SimpleNumberFormat;
    customHour: SimpleNumberFormat;
    customMinute: SimpleNumberFormat;
    customSecond: SimpleNumberFormat;
    customTimeZoneName: TimeZoneFormat;
    customFormatMatcher: FormatMatcherAlgorithm;
    customHour12: boolean;
    customTimeZone?: string;
    customCalendar?: string;
    customDayPeriod: DayPeriodFormat;
    customNumberingSystem?: string;
    customDateStyle: DateStyle;
    customTimeStyle: TimeStyle;
    customHourCycle: HourCycle;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text': TableColumnDateText;
    }
}

/**
 * The table column for displaying dates/times as text.
 */
export class TableColumnDateText extends TableColumnTextBase {
    /** @internal */
    public validator = new TableColumnDateTextValidator(this.columnInternals);

    @attr
    public format: DateTextFormat;

    @attr({ attribute: 'custom-locale-matcher' })
    public customLocaleMatcher: LocaleMatcherAlgorithm;

    @attr({ attribute: 'custom-weekday' })
    public customWeekday: WeekdayFormat;

    @attr({ attribute: 'custom-era' })
    public customEra: EraFormat;

    @attr({ attribute: 'custom-year' })
    public customYear: SimpleNumberFormat;

    @attr({ attribute: 'custom-month' })
    public customMonth: MonthFormat;

    @attr({ attribute: 'custom-day' })
    public customDay: SimpleNumberFormat;

    @attr({ attribute: 'custom-hour' })
    public customHour: SimpleNumberFormat;

    @attr({ attribute: 'custom-minute' })
    public customMinute: SimpleNumberFormat;

    @attr({ attribute: 'custom-second' })
    public customSecond: SimpleNumberFormat;

    @attr({ attribute: 'custom-time-zone-name' })
    public customTimeZoneName: TimeZoneFormat;

    @attr({ attribute: 'custom-format-matcher' })
    public customFormatMatcher: FormatMatcherAlgorithm;

    @attr({ attribute: 'custom-hour12', mode: 'boolean' })
    public customHour12 = false;

    @attr({ attribute: 'custom-time-zone' })
    public customTimeZone?: string;

    @attr({ attribute: 'custom-calendar' })
    public customCalendar?: string;

    @attr({ attribute: 'custom-day-period' })
    public customDayPeriod: DayPeriodFormat;

    @attr({ attribute: 'custom-numbering-system' })
    public customNumberingSystem?: string;

    @attr({ attribute: 'custom-date-style' })
    public customDateStyle: DateStyle;

    @attr({ attribute: 'custom-time-style' })
    public customTimeStyle: TimeStyle;

    @attr({ attribute: 'custom-hour-cycle' })
    public customHourCycle: HourCycle;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateColumnConfig();
    }

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnDateTextCellViewTag,
            groupHeaderViewTag: tableColumnDateTextGroupHeaderTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    protected formatChanged(): void {
        this.updateColumnConfig();
    }

    protected customLocaleMatcherChanged(): void {
        this.updateColumnConfig();
    }

    protected customWeekdayChanged(): void {
        this.updateColumnConfig();
    }

    protected customEraChanged(): void {
        this.updateColumnConfig();
    }

    protected customYearChanged(): void {
        this.updateColumnConfig();
    }

    protected customMonthChanged(): void {
        this.updateColumnConfig();
    }

    protected customDayChanged(): void {
        this.updateColumnConfig();
    }

    protected customHourChanged(): void {
        this.updateColumnConfig();
    }

    protected customMinuteChanged(): void {
        this.updateColumnConfig();
    }

    protected customSecondChanged(): void {
        this.updateColumnConfig();
    }

    protected customTimeZoneNameChanged(): void {
        this.updateColumnConfig();
    }

    protected customFormatMatcherChanged(): void {
        this.updateColumnConfig();
    }

    protected customHour12Changed(): void {
        this.updateColumnConfig();
    }

    protected customTimeZoneChanged(): void {
        this.updateColumnConfig();
    }

    protected customCalendarChanged(): void {
        this.updateColumnConfig();
    }

    protected customDayPeriodChanged(): void {
        this.updateColumnConfig();
    }

    protected customNumberingSystemChanged(): void {
        this.updateColumnConfig();
    }

    protected customDateStyleChanged(): void {
        this.updateColumnConfig();
    }

    protected customTimeStyleChanged(): void {
        this.updateColumnConfig();
    }

    protected customHourCycleChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        const columnConfig: TableColumnDateTextColumnConfig = {
            format: this.format,
            customLocaleMatcher: this.customLocaleMatcher,
            customWeekday: this.customWeekday,
            customEra: this.customEra,
            customYear: this.customYear,
            customMonth: this.customMonth,
            customDay: this.customDay,
            customHour: this.customHour,
            customMinute: this.customMinute,
            customSecond: this.customSecond,
            customTimeZoneName: this.customTimeZoneName,
            customFormatMatcher: this.customFormatMatcher,
            customHour12: this.customHour12,
            customTimeZone: this.customTimeZone,
            customCalendar: this.customCalendar,
            customDayPeriod: this.customDayPeriod,
            customNumberingSystem: this.customNumberingSystem,
            customDateStyle: this.customDateStyle,
            customTimeStyle: this.customTimeStyle,
            customHourCycle: this.customHourCycle
        };
        this.columnInternals.columnConfig = columnConfig;
        this.validator.setCustomOptionsValidity(
            createFormatter(columnConfig) !== undefined
        );
    }
}

const nimbleTableColumnDateText = TableColumnDateText.compose({
    baseName: 'table-column-date-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnDateText());
export const tableColumnDateTextTag = DesignSystem.tagFor(TableColumnDateText);
