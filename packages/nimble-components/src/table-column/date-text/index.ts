import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnDateTextGroupHeaderTag } from './group-header-view';
import { tableColumnDateTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnDateTextCellRecord = TableNumberField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnDateTextColumnConfig {
    format?: 'custom';
    customLocaleMatcher?: 'best fit' | 'lookup';
    customWeekday?: 'long' | 'short' | 'narrow';
    customEra?: 'long' | 'short' | 'narrow';
    customYear?: 'numeric' | '2-digit';
    customMonth?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    customDay?: 'numeric' | '2-digit';
    customHour?: 'numeric' | '2-digit';
    customMinute?: 'numeric' | '2-digit';
    customSecond?: 'numeric' | '2-digit';
    customTimeZoneName?:
    | 'short'
    | 'long'
    | 'shortOffset'
    | 'longOffset'
    | 'shortGeneric'
    | 'longGeneric';
    customFormatMatcher?: 'best fit' | 'basic';
    customHour12?: boolean;
    customTimeZone?: string;
    customCalendar?: string;
    customDayPeriod?: 'narrow' | 'short' | 'long';
    customNumberingSystem?: string;
    customDateStyle?: 'full' | 'long' | 'medium' | 'short';
    customTimeStyle?: 'full' | 'long' | 'medium' | 'short';
    customHourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
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
    @attr
    public format?: 'custom';

    @attr({ attribute: 'custom-locale-matcher' })
    public customLocaleMatcher?: 'best fit' | 'lookup';

    @attr({ attribute: 'custom-weekday' })
    public customWeekday?: 'long' | 'short' | 'narrow';

    @attr({ attribute: 'custom-era' })
    public customEra?: 'long' | 'short' | 'narrow';

    @attr({ attribute: 'custom-year' })
    public customYear?: 'numeric' | '2-digit';

    @attr({ attribute: 'custom-month' })
    public customMonth?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';

    @attr({ attribute: 'custom-day' })
    public customDay?: 'numeric' | '2-digit';

    @attr({ attribute: 'custom-hour' })
    public customHour?: 'numeric' | '2-digit';

    @attr({ attribute: 'custom-minute' })
    public customMinute?: 'numeric' | '2-digit';

    @attr({ attribute: 'custom-second' })
    public customSecond?: 'numeric' | '2-digit';

    @attr({ attribute: 'custom-time-zone-name' })
    public customTimeZoneName?:
    | 'short'
    | 'long'
    | 'shortOffset'
    | 'longOffset'
    | 'shortGeneric'
    | 'longGeneric';

    @attr({ attribute: 'custom-format-matcher' })
    public customFormatMatcher?: 'best fit' | 'basic';

    @attr({ attribute: 'custom-hour12', mode: 'boolean' })
    public customHour12?: boolean;

    @attr({ attribute: 'custom-time-zone' })
    public customTimeZone?: string;

    @attr({ attribute: 'custom-calendar' })
    public customCalendar?: string;

    @attr({ attribute: 'custom-day-period' })
    public customDayPeriod?: 'narrow' | 'short' | 'long';

    @attr({ attribute: 'custom-numbering-system' })
    public customNumberingSystem?: string;

    @attr({ attribute: 'custom-date-style' })
    public customDateStyle?: 'full' | 'long' | 'medium' | 'short';

    @attr({ attribute: 'custom-time-style' })
    public customTimeStyle?: 'full' | 'long' | 'medium' | 'short';

    @attr({ attribute: 'custom-hour-cycle' })
    public customHourCycle?: 'h11' | 'h12' | 'h23' | 'h24';

    public override connectedCallback(): void {
        this.updateColumnConfig();
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
        this.columnInternals.columnConfig = {
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
