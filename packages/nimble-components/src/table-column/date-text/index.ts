import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { tableColumnDateTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnDateTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import {
    DateTextFormat,
    LocaleMatcherAlgorithm,
    EraFormat,
    YearFormat,
    DayFormat,
    HourFormat,
    MinuteFormat,
    SecondFormat,
    TimeZoneNameFormat,
    FormatMatcherAlgorithm,
    DayPeriodFormat,
    DateStyle,
    TimeStyle,
    HourCycleFormat,
    MonthFormat,
    WeekdayFormat
} from './types';
import { TableColumnDateTextValidator } from './models/table-column-date-text-validator';
import { optionalBooleanConverter } from '../../utilities/models/converter';

export type TableColumnDateTextCellRecord = TableNumberField<'value'>;
export interface TableColumnDateTextColumnConfig {
    formatter: Intl.DateTimeFormat;
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
    public customYear: YearFormat;

    @attr({ attribute: 'custom-month' })
    public customMonth: MonthFormat;

    @attr({ attribute: 'custom-day' })
    public customDay: DayFormat;

    @attr({ attribute: 'custom-hour' })
    public customHour: HourFormat;

    @attr({ attribute: 'custom-minute' })
    public customMinute: MinuteFormat;

    @attr({ attribute: 'custom-second' })
    public customSecond: SecondFormat;

    @attr({ attribute: 'custom-time-zone-name' })
    public customTimeZoneName: TimeZoneNameFormat;

    @attr({ attribute: 'custom-format-matcher' })
    public customFormatMatcher: FormatMatcherAlgorithm;

    // Later versions of FAST (than the legacy branch we're on) have a nullableBooleanConverter.
    // We should replace our converter with that one when it is available to us.
    // See issue related to adopting FastElement 2.0: https://github.com/ni/nimble/issues/572
    @attr({ attribute: 'custom-hour12', converter: optionalBooleanConverter })
    public customHour12?: boolean;

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
    public customHourCycle: HourCycleFormat;

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
            groupHeaderViewTag: tableColumnDateTextGroupHeaderViewTag,
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
        const formatter = this.createFormatter();

        if (formatter) {
            const columnConfig: TableColumnDateTextColumnConfig = {
                formatter
            };
            this.columnInternals.columnConfig = columnConfig;
            this.validator.setCustomOptionsValidity(true);
        } else {
            this.columnInternals.columnConfig = undefined;
            this.validator.setCustomOptionsValidity(false);
        }
    }

    private createFormatter(): Intl.DateTimeFormat | undefined {
        let options: Intl.DateTimeFormatOptions;
        if (this.format === DateTextFormat.default) {
            options = {
                dateStyle: 'medium',
                timeStyle: 'medium'
            };
        } else {
            options = this.getCustomFormattingOptions();
        }
        try {
            return new Intl.DateTimeFormat(undefined, options);
        } catch (e) {
            return undefined;
        }
    }

    private getCustomFormattingOptions(): Intl.DateTimeFormatOptions {
        // There's a FAST bug (https://github.com/microsoft/fast/issues/6630) where removing
        // attributes sets their values to null instead of undefined. To work around this,
        // translate null values to undefined.
        const options: Intl.DateTimeFormatOptions = {
            localeMatcher: this.customLocaleMatcher ?? undefined,
            weekday: this.customWeekday ?? undefined,
            era: this.customEra ?? undefined,
            year: this.customYear ?? undefined,
            month: this.customMonth ?? undefined,
            day: this.customDay ?? undefined,
            hour: this.customHour ?? undefined,
            minute: this.customMinute ?? undefined,
            second: this.customSecond ?? undefined,
            timeZoneName: this.customTimeZoneName ?? undefined,
            formatMatcher: this.customFormatMatcher ?? undefined,
            hour12: this.customHour12 ?? undefined,
            timeZone: this.customTimeZone ?? undefined,
            calendar: this.customCalendar ?? undefined,
            dayPeriod: this.customDayPeriod ?? undefined,
            numberingSystem: this.customNumberingSystem ?? undefined,
            dateStyle: this.customDateStyle ?? undefined,
            timeStyle: this.customTimeStyle ?? undefined,
            hourCycle: this.customHourCycle ?? undefined
        };
        return options;
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
