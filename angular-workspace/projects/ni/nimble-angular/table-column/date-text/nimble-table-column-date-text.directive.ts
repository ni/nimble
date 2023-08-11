import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnDateText, tableColumnDateTextTag } from '@ni/nimble-components/dist/esm/table-column/date-text';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';
import type {
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
export type { DateStyle };
export type { DateTextFormat };
export type { DayFormat };
export type { DayPeriodFormat };
export type { EraFormat };
export type { FormatMatcherAlgorithm };
export type { HourCycleFormat };
export type { HourFormat };
export type { LocaleMatcherAlgorithm };
export type { MinuteFormat };
export type { MonthFormat };
export type { SecondFormat };
export type { TimeStyle };
export type { TimeZoneNameFormat };
export type { WeekdayFormat };
export type { YearFormat };
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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-locale-matcher') public set customLocaleMatcher(value: LocaleMatcherAlgorithm) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customLocaleMatcher', value);
    }

    public get customWeekday(): WeekdayFormat {
        return this.elementRef.nativeElement.customWeekday;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-weekday') public set customWeekday(value: WeekdayFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customWeekday', value);
    }

    public get customEra(): EraFormat {
        return this.elementRef.nativeElement.customEra;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-era') public set customEra(value: EraFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customEra', value);
    }

    public get customYear(): YearFormat {
        return this.elementRef.nativeElement.customYear;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-year') public set customYear(value: YearFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customYear', value);
    }

    public get customMonth(): MonthFormat {
        return this.elementRef.nativeElement.customMonth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-month') public set customMonth(value: MonthFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customMonth', value);
    }

    public get customDay(): DayFormat {
        return this.elementRef.nativeElement.customDay;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-day') public set customDay(value: DayFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDay', value);
    }

    public get customHour(): HourFormat {
        return this.elementRef.nativeElement.customHour;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-hour') public set customHour(value: HourFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customHour', value);
    }

    public get customMinute(): MinuteFormat {
        return this.elementRef.nativeElement.customMinute;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-minute') public set customMinute(value: MinuteFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customMinute', value);
    }

    public get customSecond(): SecondFormat {
        return this.elementRef.nativeElement.customSecond;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-second') public set customSecond(value: SecondFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customSecond', value);
    }

    public get customTimeZoneName(): TimeZoneNameFormat {
        return this.elementRef.nativeElement.customTimeZoneName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-time-zone-name') public set customTimeZoneName(value: TimeZoneNameFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeZoneName', value);
    }

    public get customFormatMatcher(): FormatMatcherAlgorithm {
        return this.elementRef.nativeElement.customFormatMatcher;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-format-matcher') public set customFormatMatcher(value: FormatMatcherAlgorithm) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customFormatMatcher', value);
    }

    public get customHour12(): boolean | undefined {
        return this.elementRef.nativeElement.customHour12;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-time-zone') public set customTimeZone(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeZone', value);
    }

    public get customCalendar(): string | undefined {
        return this.elementRef.nativeElement.customCalendar;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-calendar') public set customCalendar(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customCalendar', value);
    }

    public get customDayPeriod(): DayPeriodFormat {
        return this.elementRef.nativeElement.customDayPeriod;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-day-period') public set customDayPeriod(value: DayPeriodFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDayPeriod', value);
    }

    public get customNumberingSystem(): string | undefined {
        return this.elementRef.nativeElement.customNumberingSystem;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-numbering-system') public set customNumberingSystem(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customNumberingSystem', value);
    }

    public get customDateStyle(): DateStyle {
        return this.elementRef.nativeElement.customDateStyle;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-date-style') public set customDateStyle(value: DateStyle) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customDateStyle', value);
    }

    public get customTimeStyle(): TimeStyle {
        return this.elementRef.nativeElement.customTimeStyle;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-time-style') public set customTimeStyle(value: TimeStyle) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customTimeStyle', value);
    }

    public get customHourCycle(): HourCycleFormat {
        return this.elementRef.nativeElement.customHourCycle;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('custom-hour-cycle') public set customHourCycle(value: HourCycleFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'customHourCycle', value);
    }

    public get fractionalWidth(): number | null | undefined {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
    }

    public get minPixelWidth(): number | null | undefined {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
    }

    public get groupIndex(): number | null | undefined {
        return this.elementRef.nativeElement.groupIndex;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('group-index') public set groupIndex(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupIndex', toNullableNumberProperty(value));
    }

    public get groupingDisabled(): boolean {
        return this.elementRef.nativeElement.groupingDisabled;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('grouping-disabled') public set groupingDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupingDisabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnDateText>) {
        super(renderer, elementRef);
    }
}
