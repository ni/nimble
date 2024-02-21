import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnDateText, tableColumnDateTextTag } from '@ni/nimble-components/dist/esm/table-column/date-text';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';
import {
    DateTextFormat,
    DateStyle,
    DayFormat,
    DayPeriodFormat,
    EraFormat,
    FormatMatcherAlgorithm,
    HourCycleFormat,
    HourFormat,
    LocaleMatcherAlgorithm,
    MinuteFormat,
    MonthFormat,
    SecondFormat,
    TimeStyle,
    TimeZoneNameFormat,
    WeekdayFormat,
    YearFormat
} from '@ni/nimble-components/dist/esm/table-column/date-text/types';

export type { TableColumnDateText };
export { DateStyle };
export { DateTextFormat };
export { DayFormat };
export { DayPeriodFormat };
export { EraFormat };
export { FormatMatcherAlgorithm };
export { HourCycleFormat };
export { HourFormat };
export { LocaleMatcherAlgorithm };
export { MinuteFormat };
export { MonthFormat };
export { SecondFormat };
export { TimeStyle };
export { TimeZoneNameFormat };
export { WeekdayFormat };
export { YearFormat };
export { tableColumnDateTextTag };

/**
 * Directive to provide Angular integration for the table column element for date text.
 */
@Directive({
    selector: 'nimble-table-column-date-text'
})
export class NimbleTableColumnDateTextDirective extends NimbleTableColumnBaseDirective<TableColumnDateText> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get format(): DateTextFormat {
        return this.elementRef.nativeElement.format;
    }

    @Input() public set format(value: DateTextFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'format', value);
    }

    public get customLocaleMatcher(): LocaleMatcherAlgorithm {
        return this.elementRef.nativeElement.customLocaleMatcher;
    }

    @Input('custom-locale-matcher') public set customLocaleMatcher(value: LocaleMatcherAlgorithm) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customLocaleMatcher', value);
    }

    public get customWeekday(): WeekdayFormat {
        return this.elementRef.nativeElement.customWeekday;
    }

    @Input('custom-weekday') public set customWeekday(value: WeekdayFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customWeekday', value);
    }

    public get customEra(): EraFormat {
        return this.elementRef.nativeElement.customEra;
    }

    @Input('custom-era') public set customEra(value: EraFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customEra', value);
    }

    public get customYear(): YearFormat {
        return this.elementRef.nativeElement.customYear;
    }

    @Input('custom-year') public set customYear(value: YearFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customYear', value);
    }

    public get customMonth(): MonthFormat {
        return this.elementRef.nativeElement.customMonth;
    }

    @Input('custom-month') public set customMonth(value: MonthFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customMonth', value);
    }

    public get customDay(): DayFormat {
        return this.elementRef.nativeElement.customDay;
    }

    @Input('custom-day') public set customDay(value: DayFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDay', value);
    }

    public get customHour(): HourFormat {
        return this.elementRef.nativeElement.customHour;
    }

    @Input('custom-hour') public set customHour(value: HourFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customHour', value);
    }

    public get customMinute(): MinuteFormat {
        return this.elementRef.nativeElement.customMinute;
    }

    @Input('custom-minute') public set customMinute(value: MinuteFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customMinute', value);
    }

    public get customSecond(): SecondFormat {
        return this.elementRef.nativeElement.customSecond;
    }

    @Input('custom-second') public set customSecond(value: SecondFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customSecond', value);
    }

    public get customTimeZoneName(): TimeZoneNameFormat {
        return this.elementRef.nativeElement.customTimeZoneName;
    }

    @Input('custom-time-zone-name') public set customTimeZoneName(value: TimeZoneNameFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeZoneName', value);
    }

    public get customFormatMatcher(): FormatMatcherAlgorithm {
        return this.elementRef.nativeElement.customFormatMatcher;
    }

    @Input('custom-format-matcher') public set customFormatMatcher(value: FormatMatcherAlgorithm) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customFormatMatcher', value);
    }

    public get customHour12(): boolean | undefined {
        return this.elementRef.nativeElement.customHour12;
    }

    @Input('custom-hour12') public set customHour12(value: boolean | 'true' | 'false' | undefined) {
        let convertedValue;
        if (typeof value === 'boolean') {
            convertedValue = value;
        } else if (value === undefined) {
            convertedValue = undefined;
        } else {
            convertedValue = value === 'true';
        }
        this.renderer.setProperty(this.elementRef.nativeElement, 'customHour12', convertedValue);
    }

    public get customTimeZone(): string | undefined {
        return this.elementRef.nativeElement.customTimeZone;
    }

    @Input('custom-time-zone') public set customTimeZone(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeZone', value);
    }

    public get customCalendar(): string | undefined {
        return this.elementRef.nativeElement.customCalendar;
    }

    @Input('custom-calendar') public set customCalendar(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customCalendar', value);
    }

    public get customDayPeriod(): DayPeriodFormat {
        return this.elementRef.nativeElement.customDayPeriod;
    }

    @Input('custom-day-period') public set customDayPeriod(value: DayPeriodFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDayPeriod', value);
    }

    public get customNumberingSystem(): string | undefined {
        return this.elementRef.nativeElement.customNumberingSystem;
    }

    @Input('custom-numbering-system') public set customNumberingSystem(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customNumberingSystem', value);
    }

    public get customDateStyle(): DateStyle {
        return this.elementRef.nativeElement.customDateStyle;
    }

    @Input('custom-date-style') public set customDateStyle(value: DateStyle) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDateStyle', value);
    }

    public get customTimeStyle(): TimeStyle {
        return this.elementRef.nativeElement.customTimeStyle;
    }

    @Input('custom-time-style') public set customTimeStyle(value: TimeStyle) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeStyle', value);
    }

    public get customHourCycle(): HourCycleFormat {
        return this.elementRef.nativeElement.customHourCycle;
    }

    @Input('custom-hour-cycle') public set customHourCycle(value: HourCycleFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customHourCycle', value);
    }

    public get fractionalWidth(): number | null | undefined {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
    }

    public get minPixelWidth(): number | null | undefined {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
    }

    public get groupIndex(): number | null | undefined {
        return this.elementRef.nativeElement.groupIndex;
    }

    @Input('group-index') public set groupIndex(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupIndex', toNullableNumberProperty(value));
    }

    public get groupingDisabled(): boolean {
        return this.elementRef.nativeElement.groupingDisabled;
    }

    @Input('grouping-disabled') public set groupingDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupingDisabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnDateText>) {
        super(renderer, elementRef);
    }
}
