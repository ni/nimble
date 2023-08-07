import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnDateTextModule } from '../nimble-table-column-date-text.module';
import {
    NimbleTableColumnDateTextDirective,
    TableColumnDateText,
    DateStyle,
    DateTextFormat,
    DayFormat,
    DayPeriodFormat,
    EraFormat,
    FormatMatcherAlgorithm,
    HourCycleFormat,
    Hour12Format,
    HourFormat,
    LocaleMatcherAlgorithm,
    MinuteFormat,
    MonthFormat,
    SecondFormat,
    TimeStyle,
    TimeZoneNameFormat,
    WeekdayFormat,
    YearFormat
} from '../nimble-table-column-date-text.directive';
import { TableColumnSortDirection } from '../../nimble-table-column-base.directive';

describe('NimbleTableColumnDateText', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTableColumnDateTextModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-table-column-date-text')).not.toBeUndefined();
        });
    });

    describe('with default configuration', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-date-text #column field-name="field1">
                    </nimble-table-column-date-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnDateTextDirective }) public directive: NimbleTableColumnDateTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnDateText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnDateTextDirective;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnDateTextModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('has valid configuration by default', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(directive.validity.invalidCustomOptionsCombination).toBeFalse();
        });

        it('has invalid configuration with both customDateStyle and customMonth set', () => {
            directive.format = 'custom';
            directive.customDateStyle = 'full';
            directive.customMonth = 'long';
            expect(directive.checkValidity()).toBeFalse();
            expect(directive.validity.invalidCustomOptionsCombination).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-date-text
                        #column
                        column-id="my-column"
                        field-name="field1"
                        action-menu-slot="my-slot"
                        action-menu-label="my menu"
                        column-hidden="true"
                        fractional-width="2"
                        min-pixel-width="40"
                        sort-direction="${TableColumnSortDirection.ascending}"
                        sort-index="0"
                        group-index="0"
                        grouping-disabled
                        format="custom"
                        custom-locale-matcher="lookup"
                        custom-weekday="narrow"
                        custom-era="long"
                        custom-year="numeric"
                        custom-month="short"
                        custom-day="2-digit"
                        custom-hour="numeric"
                        custom-minute="2-digit"
                        custom-second="numeric"
                        custom-time-zone-name="shortOffset"
                        custom-format-matcher="basic"
                        custom-hour12="false"
                        custom-time-zone="America/Chicago"
                        custom-calendar="hebrew"
                        custom-day-period="long"
                        custom-numbering-system="latn"
                        custom-date-style="medium"
                        custom-time-style="full"
                        custom-hour-cycle="h23"
                    ></nimble-table-column-date-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnDateTextDirective }) public directive: NimbleTableColumnDateTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnDateText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnDateTextDirective;
        let nativeElement: TableColumnDateText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnDateTextModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for fieldName', () => {
            expect(directive.fieldName).toBe('field1');
            expect(nativeElement.fieldName).toBe('field1');
        });

        it('will use template string values for actionMenuSlot', () => {
            expect(directive.actionMenuSlot).toBe('my-slot');
            expect(nativeElement.actionMenuSlot).toBe('my-slot');
        });

        it('will use template string values for actionMenuLabel', () => {
            expect(directive.actionMenuLabel).toBe('my menu');
            expect(nativeElement.actionMenuLabel).toBe('my menu');
        });

        it('will use template string values for columnId', () => {
            expect(directive.columnId).toBe('my-column');
            expect(nativeElement.columnId).toBe('my-column');
        });

        it('will use template string value for columnHidden', () => {
            expect(directive.columnHidden).toBe(true);
            expect(nativeElement.columnHidden).toBe(true);
        });

        it('will use template string values for sortDirection', () => {
            expect(directive.sortDirection).toBe(TableColumnSortDirection.ascending);
            expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.ascending);
        });

        it('will use template string value for sortIndex', () => {
            expect(directive.sortIndex).toBe(0);
            expect(nativeElement.sortIndex).toBe(0);
        });

        it('will use template string values for fractionalWidth', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);
        });

        it('will use template string values for minPixelWidth', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);
        });

        it('will use template string values for groupIndex', () => {
            expect(directive.groupIndex).toBe(0);
            expect(nativeElement.groupIndex).toBe(0);
        });

        it('will use template string values for groupingDisabled', () => {
            expect(directive.groupingDisabled).toBeTrue();
            expect(nativeElement.groupingDisabled).toBeTrue();
        });

        it('will use template string values for format', () => {
            expect(directive.format).toBe('custom');
            expect(nativeElement.format).toBe('custom');
        });

        it('will use template string values for customLocaleMatcher', () => {
            expect(directive.customLocaleMatcher).toBe('lookup');
            expect(nativeElement.customLocaleMatcher).toBe('lookup');
        });

        it('will use template string values for customWeekday', () => {
            expect(directive.customWeekday).toBe('narrow');
            expect(nativeElement.customWeekday).toBe('narrow');
        });

        it('will use template string values for customEra', () => {
            expect(directive.customEra).toBe('long');
            expect(nativeElement.customEra).toBe('long');
        });

        it('will use template string values for customYear', () => {
            expect(directive.customYear).toBe('numeric');
            expect(nativeElement.customYear).toBe('numeric');
        });

        it('will use template string values for customMonth', () => {
            expect(directive.customMonth).toBe('short');
            expect(nativeElement.customMonth).toBe('short');
        });

        it('will use template string values for customDay', () => {
            expect(directive.customDay).toBe('2-digit');
            expect(nativeElement.customDay).toBe('2-digit');
        });

        it('will use template string values for customHour', () => {
            expect(directive.customHour).toBe('numeric');
            expect(nativeElement.customHour).toBe('numeric');
        });

        it('will use template string values for customMinute', () => {
            expect(directive.customMinute).toBe('2-digit');
            expect(nativeElement.customMinute).toBe('2-digit');
        });

        it('will use template string values for customSecond', () => {
            expect(directive.customSecond).toBe('numeric');
            expect(nativeElement.customSecond).toBe('numeric');
        });

        it('will use template string values for customTimeZoneName', () => {
            expect(directive.customTimeZoneName).toBe('shortOffset');
            expect(nativeElement.customTimeZoneName).toBe('shortOffset');
        });

        it('will use template string values for customFormatMatcher', () => {
            expect(directive.customFormatMatcher).toBe('basic');
            expect(nativeElement.customFormatMatcher).toBe('basic');
        });

        it('will use template string values for customHour12', () => {
            expect(directive.customHour12).toBeFalse();
            expect(nativeElement.customHour12).toBeFalse();
        });

        it('will use template string values for customTimeZone', () => {
            expect(directive.customTimeZone).toBe('America/Chicago');
            expect(nativeElement.customTimeZone).toBe('America/Chicago');
        });

        it('will use template string values for customCalendar', () => {
            expect(directive.customCalendar).toBe('hebrew');
            expect(nativeElement.customCalendar).toBe('hebrew');
        });

        it('will use template string values for customDayPeriod', () => {
            expect(directive.customDayPeriod).toBe('long');
            expect(nativeElement.customDayPeriod).toBe('long');
        });

        it('will use template string values for customNumberingSystem', () => {
            expect(directive.customNumberingSystem).toBe('latn');
            expect(nativeElement.customNumberingSystem).toBe('latn');
        });

        it('will use template string values for customDateStyle', () => {
            expect(directive.customDateStyle).toBe('medium');
            expect(nativeElement.customDateStyle).toBe('medium');
        });

        it('will use template string values for customTimeStyle', () => {
            expect(directive.customTimeStyle).toBe('full');
            expect(nativeElement.customTimeStyle).toBe('full');
        });

        it('will use template string values for customHourCycle', () => {
            expect(directive.customHourCycle).toBe('h23');
            expect(nativeElement.customHourCycle).toBe('h23');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-date-text
                        #column
                        [column-id]="columnId"
                        [field-name]="field"
                        [action-menu-slot]="actionMenuSlot"
                        [action-menu-label]="actionMenuLabel"
                        [column-hidden]="columnHidden"
                        [fractional-width]="fractionalWidth"
                        [min-pixel-width]="minPixelWidth"
                        [sort-direction]="sortDirection"
                        [sort-index]="sortIndex"
                        [group-index]="groupIndex"
                        [grouping-disabled]="groupingDisabled"
                        [format]="format"
                        [custom-locale-matcher]="customLocaleMatcher"
                        [custom-weekday]="customWeekday"
                        [custom-era]="customEra"
                        [custom-year]="customYear"
                        [custom-month]="customMonth"
                        [custom-day]="customDay"
                        [custom-hour]="customHour"
                        [custom-minute]="customMinute"
                        [custom-second]="customSecond"
                        [custom-time-zone-name]="customTimeZoneName"
                        [custom-format-matcher]="customFormatMatcher"
                        [custom-hour12]="customHour12"
                        [custom-time-zone]="customTimeZone"
                        [custom-calendar]="customCalendar"
                        [custom-day-period]="customDayPeriod"
                        [custom-numbering-system]="customNumberingSystem"
                        [custom-date-style]="customDateStyle"
                        [custom-time-style]="customTimeStyle"
                        [custom-hour-cycle]="customHourCycle"
                    ></nimble-table-column-date-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnDateTextDirective }) public directive: NimbleTableColumnDateTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnDateText>;
            public field = 'field1';
            public actionMenuSlot = 'my-slot';
            public actionMenuLabel = 'my menu';
            public fractionalWidth: number | null = 2;
            public minPixelWidth: number | null = 40;
            public columnId = 'my-column';
            public columnHidden = true;
            public sortDirection: TableColumnSortDirection = TableColumnSortDirection.ascending;
            public sortIndex: number | null = 0;
            public groupIndex: number | null = 0;
            public groupingDisabled = false;
            public format: DateTextFormat = 'custom';
            public customLocaleMatcher: LocaleMatcherAlgorithm = 'lookup';
            public customWeekday: WeekdayFormat = 'narrow';
            public customEra: EraFormat = 'long';
            public customYear: YearFormat = 'numeric';
            public customMonth: MonthFormat = 'short';
            public customDay: DayFormat = '2-digit';
            public customHour: HourFormat = 'numeric';
            public customMinute: MinuteFormat = '2-digit';
            public customSecond: SecondFormat = 'numeric';
            public customTimeZoneName: TimeZoneNameFormat = 'shortOffset';
            public customFormatMatcher: FormatMatcherAlgorithm = 'basic';
            public customHour12: Hour12Format = false;
            public customTimeZone?: string = 'America/Chicago';
            public customCalendar?: string = 'hebrew';
            public customDayPeriod: DayPeriodFormat = 'long';
            public customNumberingSystem?: string = 'latn';
            public customDateStyle: DateStyle = 'medium';
            public customTimeStyle: TimeStyle = 'full';
            public customHourCycle: HourCycleFormat = 'h23';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnDateTextDirective;
        let nativeElement: TableColumnDateText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnDateTextModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for fieldName', () => {
            expect(directive.fieldName).toBe('field1');
            expect(nativeElement.fieldName).toBe('field1');

            fixture.componentInstance.field = 'field2';
            fixture.detectChanges();

            expect(directive.fieldName).toBe('field2');
            expect(nativeElement.fieldName).toBe('field2');
        });

        it('can be configured with property binding for actionMenuSlot', () => {
            expect(directive.actionMenuSlot).toBe('my-slot');
            expect(nativeElement.actionMenuSlot).toBe('my-slot');

            fixture.componentInstance.actionMenuSlot = 'new-slot';
            fixture.detectChanges();

            expect(directive.actionMenuSlot).toBe('new-slot');
            expect(nativeElement.actionMenuSlot).toBe('new-slot');
        });

        it('can be configured with property binding for actionMenuLabel', () => {
            expect(directive.actionMenuLabel).toBe('my menu');
            expect(nativeElement.actionMenuLabel).toBe('my menu');

            fixture.componentInstance.actionMenuLabel = 'another menu';
            fixture.detectChanges();

            expect(directive.actionMenuLabel).toBe('another menu');
            expect(nativeElement.actionMenuLabel).toBe('another menu');
        });

        it('can be configured with property binding for columnId', () => {
            expect(directive.columnId).toBe('my-column');
            expect(nativeElement.columnId).toBe('my-column');

            fixture.componentInstance.columnId = 'new-column';
            fixture.detectChanges();

            expect(directive.columnId).toBe('new-column');
            expect(nativeElement.columnId).toBe('new-column');
        });

        it('can be configured with property binding for columnHidden', () => {
            expect(directive.columnHidden).toBe(true);
            expect(nativeElement.columnHidden).toBe(true);

            fixture.componentInstance.columnHidden = false;
            fixture.detectChanges();

            expect(directive.columnHidden).toBe(false);
            expect(nativeElement.columnHidden).toBe(false);
        });

        it('can be configured with property binding for sortDirection', () => {
            expect(directive.sortDirection).toBe(TableColumnSortDirection.ascending);
            expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.ascending);

            fixture.componentInstance.sortDirection = TableColumnSortDirection.descending;
            fixture.detectChanges();

            expect(directive.sortDirection).toBe(TableColumnSortDirection.descending);
            expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.descending);
        });

        it('can be configured with property binding for sortIndex', () => {
            expect(directive.sortIndex).toBe(0);
            expect(nativeElement.sortIndex).toBe(0);

            fixture.componentInstance.sortIndex = 1;
            fixture.detectChanges();

            expect(directive.sortIndex).toBe(1);
            expect(nativeElement.sortIndex).toBe(1);
        });

        it('can be configured with property binding for sortIndex updated to null', () => {
            expect(directive.sortIndex).toBe(0);
            expect(nativeElement.sortIndex).toBe(0);

            fixture.componentInstance.sortIndex = null;
            fixture.detectChanges();

            expect(directive.sortIndex).toBe(null);
            expect(nativeElement.sortIndex).toBe(null);
        });

        it('can be configured with property binding for fractionalWidth', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);

            fixture.componentInstance.fractionalWidth = 1;
            fixture.detectChanges();

            expect(directive.fractionalWidth).toBe(1);
            expect(nativeElement.fractionalWidth).toBe(1);
        });

        it('can be configured with property binding for fractionalWidth updated to null', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);

            fixture.componentInstance.fractionalWidth = null;
            fixture.detectChanges();

            expect(directive.fractionalWidth).toBe(null);
            expect(nativeElement.fractionalWidth).toBe(null);
        });

        it('can be configured with property binding for minPixelWidth', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);

            fixture.componentInstance.minPixelWidth = 50;
            fixture.detectChanges();

            expect(directive.minPixelWidth).toBe(50);
            expect(nativeElement.minPixelWidth).toBe(50);
        });

        it('can be configured with property binding for minPixelWidth updated to null', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);

            fixture.componentInstance.minPixelWidth = null;
            fixture.detectChanges();

            expect(directive.minPixelWidth).toBe(null);
            expect(nativeElement.minPixelWidth).toBe(null);
        });

        it('can be configured with property binding for groupIndex', () => {
            expect(directive.groupIndex).toBe(0);
            expect(nativeElement.groupIndex).toBe(0);

            fixture.componentInstance.groupIndex = 1;
            fixture.detectChanges();

            expect(directive.groupIndex).toBe(1);
            expect(nativeElement.groupIndex).toBe(1);
        });

        it('can be configured with property binding for groupIndex updated to null', () => {
            expect(directive.groupIndex).toBe(0);
            expect(nativeElement.groupIndex).toBe(0);

            fixture.componentInstance.groupIndex = null;
            fixture.detectChanges();

            expect(directive.groupIndex).toBe(null);
            expect(nativeElement.groupIndex).toBe(null);
        });

        it('can be configured with property binding for groupingDisabled', () => {
            expect(directive.groupingDisabled).toBeFalse();
            expect(nativeElement.groupingDisabled).toBeFalse();

            fixture.componentInstance.groupingDisabled = true;
            fixture.detectChanges();

            expect(directive.groupingDisabled).toBeTrue();
            expect(nativeElement.groupingDisabled).toBeTrue();
        });

        it('can be configured with property binding for format updated to undefined', () => {
            expect(directive.format).toBe('custom');
            expect(nativeElement.format).toBe('custom');

            fixture.componentInstance.format = undefined;
            fixture.detectChanges();

            expect(directive.format).toBeUndefined();
            expect(nativeElement.format).toBeUndefined();
        });

        it('can be configured with property binding for customLocaleMatcher', () => {
            expect(directive.customLocaleMatcher).toBe('lookup');
            expect(nativeElement.customLocaleMatcher).toBe('lookup');

            fixture.componentInstance.customLocaleMatcher = 'best fit';
            fixture.detectChanges();

            expect(directive.customLocaleMatcher).toBe('best fit');
            expect(nativeElement.customLocaleMatcher).toBe('best fit');
        });

        it('can be configured with property binding for customLocaleMatcher updated to undefined', () => {
            expect(directive.customLocaleMatcher).toBe('lookup');
            expect(nativeElement.customLocaleMatcher).toBe('lookup');

            fixture.componentInstance.customLocaleMatcher = undefined;
            fixture.detectChanges();

            expect(directive.customLocaleMatcher).toBeUndefined();
            expect(nativeElement.customLocaleMatcher).toBeUndefined();
        });

        it('can be configured with property binding for customWeekday', () => {
            expect(directive.customWeekday).toBe('narrow');
            expect(nativeElement.customWeekday).toBe('narrow');

            fixture.componentInstance.customWeekday = 'short';
            fixture.detectChanges();

            expect(directive.customWeekday).toBe('short');
            expect(nativeElement.customWeekday).toBe('short');
        });

        it('can be configured with property binding for customWeekday updated to undefined', () => {
            expect(directive.customWeekday).toBe('narrow');
            expect(nativeElement.customWeekday).toBe('narrow');

            fixture.componentInstance.customWeekday = undefined;
            fixture.detectChanges();

            expect(directive.customWeekday).toBeUndefined();
            expect(nativeElement.customWeekday).toBeUndefined();
        });

        it('can be configured with property binding for customEra', () => {
            expect(directive.customEra).toBe('long');
            expect(nativeElement.customEra).toBe('long');

            fixture.componentInstance.customEra = 'short';
            fixture.detectChanges();

            expect(directive.customEra).toBe('short');
            expect(nativeElement.customEra).toBe('short');
        });

        it('can be configured with property binding for customEra updated to undefined', () => {
            expect(directive.customEra).toBe('long');
            expect(nativeElement.customEra).toBe('long');

            fixture.componentInstance.customEra = undefined;
            fixture.detectChanges();

            expect(directive.customEra).toBeUndefined();
            expect(nativeElement.customEra).toBeUndefined();
        });

        it('can be configured with property binding for customYear', () => {
            expect(directive.customYear).toBe('numeric');
            expect(nativeElement.customYear).toBe('numeric');

            fixture.componentInstance.customYear = '2-digit';
            fixture.detectChanges();

            expect(directive.customYear).toBe('2-digit');
            expect(nativeElement.customYear).toBe('2-digit');
        });

        it('can be configured with property binding for customYear updated to undefined', () => {
            expect(directive.customYear).toBe('numeric');
            expect(nativeElement.customYear).toBe('numeric');

            fixture.componentInstance.customYear = undefined;
            fixture.detectChanges();

            expect(directive.customYear).toBeUndefined();
            expect(nativeElement.customYear).toBeUndefined();
        });

        it('can be configured with property binding for customMonth', () => {
            expect(directive.customMonth).toBe('short');
            expect(nativeElement.customMonth).toBe('short');

            fixture.componentInstance.customMonth = '2-digit';
            fixture.detectChanges();

            expect(directive.customMonth).toBe('2-digit');
            expect(nativeElement.customMonth).toBe('2-digit');
        });

        it('can be configured with property binding for customMonth updated to undefined', () => {
            expect(directive.customMonth).toBe('short');
            expect(nativeElement.customMonth).toBe('short');

            fixture.componentInstance.customMonth = undefined;
            fixture.detectChanges();

            expect(directive.customMonth).toBeUndefined();
            expect(nativeElement.customMonth).toBeUndefined();
        });

        it('can be configured with property binding for customDay', () => {
            expect(directive.customDay).toBe('2-digit');
            expect(nativeElement.customDay).toBe('2-digit');

            fixture.componentInstance.customDay = 'numeric';
            fixture.detectChanges();

            expect(directive.customDay).toBe('numeric');
            expect(nativeElement.customDay).toBe('numeric');
        });

        it('can be configured with property binding for customDay updated to undefined', () => {
            expect(directive.customDay).toBe('2-digit');
            expect(nativeElement.customDay).toBe('2-digit');

            fixture.componentInstance.customDay = undefined;
            fixture.detectChanges();

            expect(directive.customDay).toBeUndefined();
            expect(nativeElement.customDay).toBeUndefined();
        });

        it('can be configured with property binding for customHour', () => {
            expect(directive.customHour).toBe('numeric');
            expect(nativeElement.customHour).toBe('numeric');

            fixture.componentInstance.customHour = '2-digit';
            fixture.detectChanges();

            expect(directive.customHour).toBe('2-digit');
            expect(nativeElement.customHour).toBe('2-digit');
        });

        it('can be configured with property binding for customHour updated to undefined', () => {
            expect(directive.customHour).toBe('numeric');
            expect(nativeElement.customHour).toBe('numeric');

            fixture.componentInstance.customHour = undefined;
            fixture.detectChanges();

            expect(directive.customHour).toBeUndefined();
            expect(nativeElement.customHour).toBeUndefined();
        });

        it('can be configured with property binding for customMinute', () => {
            expect(directive.customMinute).toBe('2-digit');
            expect(nativeElement.customMinute).toBe('2-digit');

            fixture.componentInstance.customMinute = 'numeric';
            fixture.detectChanges();

            expect(directive.customMinute).toBe('numeric');
            expect(nativeElement.customMinute).toBe('numeric');
        });

        it('can be configured with property binding for customMinute updated to undefined', () => {
            expect(directive.customMinute).toBe('2-digit');
            expect(nativeElement.customMinute).toBe('2-digit');

            fixture.componentInstance.customMinute = undefined;
            fixture.detectChanges();

            expect(directive.customMinute).toBeUndefined();
            expect(nativeElement.customMinute).toBeUndefined();
        });

        it('can be configured with property binding for customSecond', () => {
            expect(directive.customSecond).toBe('numeric');
            expect(nativeElement.customSecond).toBe('numeric');

            fixture.componentInstance.customSecond = '2-digit';
            fixture.detectChanges();

            expect(directive.customSecond).toBe('2-digit');
            expect(nativeElement.customSecond).toBe('2-digit');
        });

        it('can be configured with property binding for customSecond updated to undefined', () => {
            expect(directive.customSecond).toBe('numeric');
            expect(nativeElement.customSecond).toBe('numeric');

            fixture.componentInstance.customSecond = undefined;
            fixture.detectChanges();

            expect(directive.customSecond).toBeUndefined();
            expect(nativeElement.customSecond).toBeUndefined();
        });

        it('can be configured with property binding for customTimeZoneName', () => {
            expect(directive.customTimeZoneName).toBe('shortOffset');
            expect(nativeElement.customTimeZoneName).toBe('shortOffset');

            fixture.componentInstance.customTimeZoneName = 'long';
            fixture.detectChanges();

            expect(directive.customTimeZoneName).toBe('long');
            expect(nativeElement.customTimeZoneName).toBe('long');
        });

        it('can be configured with property binding for customTimeZoneName updated to undefined', () => {
            expect(directive.customTimeZoneName).toBe('shortOffset');
            expect(nativeElement.customTimeZoneName).toBe('shortOffset');

            fixture.componentInstance.customTimeZoneName = undefined;
            fixture.detectChanges();

            expect(directive.customTimeZoneName).toBeUndefined();
            expect(nativeElement.customTimeZoneName).toBeUndefined();
        });

        it('can be configured with property binding for customFormatMatcher', () => {
            expect(directive.customFormatMatcher).toBe('basic');
            expect(nativeElement.customFormatMatcher).toBe('basic');

            fixture.componentInstance.customFormatMatcher = 'best fit';
            fixture.detectChanges();

            expect(directive.customFormatMatcher).toBe('best fit');
            expect(nativeElement.customFormatMatcher).toBe('best fit');
        });

        it('can be configured with property binding for customFormatMatcher updated to undefined', () => {
            expect(directive.customFormatMatcher).toBe('basic');
            expect(nativeElement.customFormatMatcher).toBe('basic');

            fixture.componentInstance.customFormatMatcher = undefined;
            fixture.detectChanges();

            expect(directive.customFormatMatcher).toBeUndefined();
            expect(nativeElement.customFormatMatcher).toBeUndefined();
        });

        it('can be configured with property binding for customHour12', () => {
            expect(directive.customHour12).toBeFalse();
            expect(nativeElement.customHour12).toBeFalse();

            fixture.componentInstance.customHour12 = true;
            fixture.detectChanges();

            expect(directive.customHour12).toBeTrue();
            expect(nativeElement.customHour12).toBeTrue();
        });

        it('can be configured with property binding for customHour12 updated to undefined', () => {
            expect(directive.customHour12).toBeFalse();
            expect(nativeElement.customHour12).toBeFalse();

            fixture.componentInstance.customHour12 = undefined;
            fixture.detectChanges();

            expect(directive.customHour12).toBeUndefined();
            expect(nativeElement.customHour12).toBeUndefined();
        });

        it('can be configured with property binding for customTimeZone', () => {
            expect(directive.customTimeZone).toBe('America/Chicago');
            expect(nativeElement.customTimeZone).toBe('America/Chicago');

            fixture.componentInstance.customTimeZone = 'America/New York';
            fixture.detectChanges();

            expect(directive.customTimeZone).toBe('America/New York');
            expect(nativeElement.customTimeZone).toBe('America/New York');
        });

        it('can be configured with property binding for customTimeZone updated to undefined', () => {
            expect(directive.customTimeZone).toBe('America/Chicago');
            expect(nativeElement.customTimeZone).toBe('America/Chicago');

            fixture.componentInstance.customTimeZone = undefined;
            fixture.detectChanges();

            expect(directive.customTimeZone).toBeUndefined();
            expect(nativeElement.customTimeZone).toBeUndefined();
        });

        it('can be configured with property binding for customCalendar', () => {
            expect(directive.customCalendar).toBe('hebrew');
            expect(nativeElement.customCalendar).toBe('hebrew');

            fixture.componentInstance.customCalendar = 'gregorian';
            fixture.detectChanges();

            expect(directive.customCalendar).toBe('gregorian');
            expect(nativeElement.customCalendar).toBe('gregorian');
        });

        it('can be configured with property binding for customCalendar updated to undefined', () => {
            expect(directive.customCalendar).toBe('hebrew');
            expect(nativeElement.customCalendar).toBe('hebrew');

            fixture.componentInstance.customCalendar = undefined;
            fixture.detectChanges();

            expect(directive.customCalendar).toBeUndefined();
            expect(nativeElement.customCalendar).toBeUndefined();
        });

        it('can be configured with property binding for customDayPeriod', () => {
            expect(directive.customDayPeriod).toBe('long');
            expect(nativeElement.customDayPeriod).toBe('long');

            fixture.componentInstance.customDayPeriod = 'narrow';
            fixture.detectChanges();

            expect(directive.customDayPeriod).toBe('narrow');
            expect(nativeElement.customDayPeriod).toBe('narrow');
        });

        it('can be configured with property binding for customDayPeriod updated to undefined', () => {
            expect(directive.customDayPeriod).toBe('long');
            expect(nativeElement.customDayPeriod).toBe('long');

            fixture.componentInstance.customDayPeriod = undefined;
            fixture.detectChanges();

            expect(directive.customDayPeriod).toBeUndefined();
            expect(nativeElement.customDayPeriod).toBeUndefined();
        });

        it('can be configured with property binding for customNumberingSystem', () => {
            expect(directive.customNumberingSystem).toBe('latn');
            expect(nativeElement.customNumberingSystem).toBe('latn');

            fixture.componentInstance.customNumberingSystem = 'fancy';
            fixture.detectChanges();

            expect(directive.customNumberingSystem).toBe('fancy');
            expect(nativeElement.customNumberingSystem).toBe('fancy');
        });

        it('can be configured with property binding for customNumberingSystem updated to undefined', () => {
            expect(directive.customNumberingSystem).toBe('latn');
            expect(nativeElement.customNumberingSystem).toBe('latn');

            fixture.componentInstance.customNumberingSystem = undefined;
            fixture.detectChanges();

            expect(directive.customNumberingSystem).toBeUndefined();
            expect(nativeElement.customNumberingSystem).toBeUndefined();
        });

        it('can be configured with property binding for customDateStyle', () => {
            expect(directive.customDateStyle).toBe('medium');
            expect(nativeElement.customDateStyle).toBe('medium');

            fixture.componentInstance.customDateStyle = 'long';
            fixture.detectChanges();

            expect(directive.customDateStyle).toBe('long');
            expect(nativeElement.customDateStyle).toBe('long');
        });

        it('can be configured with property binding for customDateStyle updated to undefined', () => {
            expect(directive.customDateStyle).toBe('medium');
            expect(nativeElement.customDateStyle).toBe('medium');

            fixture.componentInstance.customDateStyle = undefined;
            fixture.detectChanges();

            expect(directive.customDateStyle).toBeUndefined();
            expect(nativeElement.customDateStyle).toBeUndefined();
        });

        it('can be configured with property binding for customTimeStyle', () => {
            expect(directive.customTimeStyle).toBe('full');
            expect(nativeElement.customTimeStyle).toBe('full');

            fixture.componentInstance.customTimeStyle = 'long';
            fixture.detectChanges();

            expect(directive.customTimeStyle).toBe('long');
            expect(nativeElement.customTimeStyle).toBe('long');
        });

        it('can be configured with property binding for customTimeStyle updated to undefined', () => {
            expect(directive.customTimeStyle).toBe('full');
            expect(nativeElement.customTimeStyle).toBe('full');

            fixture.componentInstance.customTimeStyle = undefined;
            fixture.detectChanges();

            expect(directive.customTimeStyle).toBeUndefined();
            expect(nativeElement.customTimeStyle).toBeUndefined();
        });

        it('can be configured with property binding for customHourCycle', () => {
            expect(directive.customHourCycle).toBe('h23');
            expect(nativeElement.customHourCycle).toBe('h23');

            fixture.componentInstance.customHourCycle = 'h12';
            fixture.detectChanges();

            expect(directive.customHourCycle).toBe('h12');
            expect(nativeElement.customHourCycle).toBe('h12');
        });

        it('can be configured with property binding for customHourCycle updated to undefined', () => {
            expect(directive.customHourCycle).toBe('h23');
            expect(nativeElement.customHourCycle).toBe('h23');

            fixture.componentInstance.customHourCycle = undefined;
            fixture.detectChanges();

            expect(directive.customHourCycle).toBeUndefined();
            expect(nativeElement.customHourCycle).toBeUndefined();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-date-text
                        #column
                        [attr.column-id]="columnId"
                        [attr.field-name]="field"
                        [attr.action-menu-slot]="actionMenuSlot"
                        [attr.action-menu-label]="actionMenuLabel"
                        [attr.column-hidden]="columnHidden"
                        [attr.fractional-width]="fractionalWidth"
                        [attr.min-pixel-width]="minPixelWidth"
                        [attr.sort-direction]="sortDirection"
                        [attr.sort-index]="sortIndex"
                        [attr.group-index]="groupIndex"
                        [attr.grouping-disabled]="groupingDisabled"
                        [attr.format]="format"
                        [attr.custom-locale-matcher]="customLocaleMatcher"
                        [attr.custom-weekday]="customWeekday"
                        [attr.custom-era]="customEra"
                        [attr.custom-year]="customYear"
                        [attr.custom-month]="customMonth"
                        [attr.custom-day]="customDay"
                        [attr.custom-hour]="customHour"
                        [attr.custom-minute]="customMinute"
                        [attr.custom-second]="customSecond"
                        [attr.custom-time-zone-name]="customTimeZoneName"
                        [attr.custom-format-matcher]="customFormatMatcher"
                        [attr.custom-hour12]="customHour12"
                        [attr.custom-time-zone]="customTimeZone"
                        [attr.custom-calendar]="customCalendar"
                        [attr.custom-day-period]="customDayPeriod"
                        [attr.custom-numbering-system]="customNumberingSystem"
                        [attr.custom-date-style]="customDateStyle"
                        [attr.custom-time-style]="customTimeStyle"
                        [attr.custom-hour-cycle]="customHourCycle"
                    ></nimble-table-column-date-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnDateTextDirective }) public directive: NimbleTableColumnDateTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnDateText>;
            public field = 'field1';
            public actionMenuSlot = 'my-slot';
            public actionMenuLabel = 'my menu';
            public fractionalWidth: number | null = 2;
            public minPixelWidth: number | null = 40;
            public columnId = 'my-column';
            public columnHidden = true;
            public sortDirection: TableColumnSortDirection = TableColumnSortDirection.ascending;
            public sortIndex: number | null = 0;
            public groupIndex: number | null = 0;
            public groupingDisabled = false;
            public format: DateTextFormat = 'custom';
            public customLocaleMatcher: LocaleMatcherAlgorithm = 'lookup';
            public customWeekday: WeekdayFormat = 'narrow';
            public customEra: EraFormat = 'long';
            public customYear: YearFormat = 'numeric';
            public customMonth: MonthFormat = 'short';
            public customDay: DayFormat = '2-digit';
            public customHour: HourFormat = 'numeric';
            public customMinute: MinuteFormat = '2-digit';
            public customSecond: SecondFormat = 'numeric';
            public customTimeZoneName: TimeZoneNameFormat = 'shortOffset';
            public customFormatMatcher: FormatMatcherAlgorithm = 'basic';
            public customHour12: Hour12Format = false;
            public customTimeZone?: string = 'America/Chicago';
            public customCalendar?: string = 'hebrew';
            public customDayPeriod: DayPeriodFormat = 'long';
            public customNumberingSystem?: string = 'latn';
            public customDateStyle: DateStyle = 'medium';
            public customTimeStyle: TimeStyle = 'full';
            public customHourCycle: HourCycleFormat = 'h23';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnDateTextDirective;
        let nativeElement: TableColumnDateText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnDateTextModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for fieldName', () => {
            expect(directive.fieldName).toBe('field1');
            expect(nativeElement.fieldName).toBe('field1');

            fixture.componentInstance.field = 'field2';
            fixture.detectChanges();

            expect(directive.fieldName).toBe('field2');
            expect(nativeElement.fieldName).toBe('field2');
        });

        it('can be configured with attribute binding for actionMenuSlot', () => {
            expect(directive.actionMenuSlot).toBe('my-slot');
            expect(nativeElement.actionMenuSlot).toBe('my-slot');

            fixture.componentInstance.actionMenuSlot = 'new-slot';
            fixture.detectChanges();

            expect(directive.actionMenuSlot).toBe('new-slot');
            expect(nativeElement.actionMenuSlot).toBe('new-slot');
        });

        it('can be configured with attribute binding for actionMenuLabel', () => {
            expect(directive.actionMenuLabel).toBe('my menu');
            expect(nativeElement.actionMenuLabel).toBe('my menu');

            fixture.componentInstance.actionMenuLabel = 'another menu';
            fixture.detectChanges();

            expect(directive.actionMenuLabel).toBe('another menu');
            expect(nativeElement.actionMenuLabel).toBe('another menu');
        });

        it('can be configured with attribute binding for columnId', () => {
            expect(directive.columnId).toBe('my-column');
            expect(nativeElement.columnId).toBe('my-column');

            fixture.componentInstance.columnId = 'new-column';
            fixture.detectChanges();

            expect(directive.columnId).toBe('new-column');
            expect(nativeElement.columnId).toBe('new-column');
        });

        it('can be configured with attribute binding for columnHidden', () => {
            expect(directive.columnHidden).toBe(true);
            expect(nativeElement.columnHidden).toBe(true);

            fixture.componentInstance.columnHidden = false;
            fixture.detectChanges();

            expect(directive.columnHidden).toBe(false);
            expect(nativeElement.columnHidden).toBe(false);
        });

        it('can be configured with attribute binding for sortDirection', () => {
            expect(directive.sortDirection).toBe(TableColumnSortDirection.ascending);
            expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.ascending);

            fixture.componentInstance.sortDirection = TableColumnSortDirection.descending;
            fixture.detectChanges();

            expect(directive.sortDirection).toBe(TableColumnSortDirection.descending);
            expect(nativeElement.sortDirection).toBe(TableColumnSortDirection.descending);
        });

        it('can be configured with attribute binding for sortIndex', () => {
            expect(directive.sortIndex).toBe(0);
            expect(nativeElement.sortIndex).toBe(0);

            fixture.componentInstance.sortIndex = 1;
            fixture.detectChanges();

            expect(directive.sortIndex).toBe(1);
            expect(nativeElement.sortIndex).toBe(1);
        });

        it('can be configured with attribute binding for sortIndex updated to null', () => {
            expect(directive.sortIndex).toBe(0);
            expect(nativeElement.sortIndex).toBe(0);

            fixture.componentInstance.sortIndex = null;
            fixture.detectChanges();

            expect(directive.sortIndex).toBe(null);
            expect(nativeElement.sortIndex).toBe(null);
        });

        it('can be configured with attribute binding for fractionalWidth', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);

            fixture.componentInstance.fractionalWidth = 1;
            fixture.detectChanges();

            expect(directive.fractionalWidth).toBe(1);
            expect(nativeElement.fractionalWidth).toBe(1);
        });

        it('can be configured with attribute binding for fractionalWidth set to null', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);

            fixture.componentInstance.fractionalWidth = null;
            fixture.detectChanges();

            expect(directive.fractionalWidth).toBe(null);
            expect(nativeElement.fractionalWidth).toBe(null);
        });

        it('can be configured with attribute binding for minPixelWidth', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);

            fixture.componentInstance.minPixelWidth = 50;
            fixture.detectChanges();

            expect(directive.minPixelWidth).toBe(50);
            expect(nativeElement.minPixelWidth).toBe(50);
        });

        it('can be configured with attribute binding for minPixelWidth set to null', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);

            fixture.componentInstance.minPixelWidth = null;
            fixture.detectChanges();

            expect(directive.minPixelWidth).toBe(null);
            expect(nativeElement.minPixelWidth).toBe(null);
        });

        it('can be configured with attribute binding for groupIndex', () => {
            expect(directive.groupIndex).toBe(0);
            expect(nativeElement.groupIndex).toBe(0);

            fixture.componentInstance.groupIndex = 1;
            fixture.detectChanges();

            expect(directive.groupIndex).toBe(1);
            expect(nativeElement.groupIndex).toBe(1);
        });

        it('can be configured with attribute binding for groupIndex updated to null', () => {
            expect(directive.groupIndex).toBe(0);
            expect(nativeElement.groupIndex).toBe(0);

            fixture.componentInstance.groupIndex = null;
            fixture.detectChanges();

            expect(directive.groupIndex).toBe(null);
            expect(nativeElement.groupIndex).toBe(null);
        });

        it('can be configured with attribute binding for groupingDisabled', () => {
            expect(directive.groupingDisabled).toBe(false);
            expect(nativeElement.groupingDisabled).toBe(false);

            fixture.componentInstance.groupingDisabled = true;
            fixture.detectChanges();

            expect(directive.groupingDisabled).toBe(true);
            expect(nativeElement.groupingDisabled).toBe(true);
        });

        it('can be configured with attribute binding for format updated to undefined', () => {
            expect(directive.format).toBe('custom');
            expect(nativeElement.format).toBe('custom');

            fixture.componentInstance.format = undefined;
            fixture.detectChanges();

            expect(directive.format).toBeNull();
            expect(nativeElement.format).toBeNull();
        });

        it('can be configured with attribute binding for customLocaleMatcher', () => {
            expect(directive.customLocaleMatcher).toBe('lookup');
            expect(nativeElement.customLocaleMatcher).toBe('lookup');

            fixture.componentInstance.customLocaleMatcher = 'best fit';
            fixture.detectChanges();

            expect(directive.customLocaleMatcher).toBe('best fit');
            expect(nativeElement.customLocaleMatcher).toBe('best fit');
        });

        it('can be configured with attribute binding for customLocaleMatcher updated to undefined', () => {
            expect(directive.customLocaleMatcher).toBe('lookup');
            expect(nativeElement.customLocaleMatcher).toBe('lookup');

            fixture.componentInstance.customLocaleMatcher = undefined;
            fixture.detectChanges();

            expect(directive.customLocaleMatcher).toBeNull();
            expect(nativeElement.customLocaleMatcher).toBeNull();
        });

        it('can be configured with attribute binding for customWeekday', () => {
            expect(directive.customWeekday).toBe('narrow');
            expect(nativeElement.customWeekday).toBe('narrow');

            fixture.componentInstance.customWeekday = 'short';
            fixture.detectChanges();

            expect(directive.customWeekday).toBe('short');
            expect(nativeElement.customWeekday).toBe('short');
        });

        it('can be configured with attribute binding for customWeekday updated to undefined', () => {
            expect(directive.customWeekday).toBe('narrow');
            expect(nativeElement.customWeekday).toBe('narrow');

            fixture.componentInstance.customWeekday = undefined;
            fixture.detectChanges();

            expect(directive.customWeekday).toBeNull();
            expect(nativeElement.customWeekday).toBeNull();
        });

        it('can be configured with attribute binding for customEra', () => {
            expect(directive.customEra).toBe('long');
            expect(nativeElement.customEra).toBe('long');

            fixture.componentInstance.customEra = 'short';
            fixture.detectChanges();

            expect(directive.customEra).toBe('short');
            expect(nativeElement.customEra).toBe('short');
        });

        it('can be configured with attribute binding for customEra updated to undefined', () => {
            expect(directive.customEra).toBe('long');
            expect(nativeElement.customEra).toBe('long');

            fixture.componentInstance.customEra = undefined;
            fixture.detectChanges();

            expect(directive.customEra).toBeNull();
            expect(nativeElement.customEra).toBeNull();
        });

        it('can be configured with attribute binding for customYear', () => {
            expect(directive.customYear).toBe('numeric');
            expect(nativeElement.customYear).toBe('numeric');

            fixture.componentInstance.customYear = '2-digit';
            fixture.detectChanges();

            expect(directive.customYear).toBe('2-digit');
            expect(nativeElement.customYear).toBe('2-digit');
        });

        it('can be configured with attribute binding for customYear updated to undefined', () => {
            expect(directive.customYear).toBe('numeric');
            expect(nativeElement.customYear).toBe('numeric');

            fixture.componentInstance.customYear = undefined;
            fixture.detectChanges();

            expect(directive.customYear).toBeNull();
            expect(nativeElement.customYear).toBeNull();
        });

        it('can be configured with attribute binding for customMonth', () => {
            expect(directive.customMonth).toBe('short');
            expect(nativeElement.customMonth).toBe('short');

            fixture.componentInstance.customMonth = '2-digit';
            fixture.detectChanges();

            expect(directive.customMonth).toBe('2-digit');
            expect(nativeElement.customMonth).toBe('2-digit');
        });

        it('can be configured with attribute binding for customMonth updated to undefined', () => {
            expect(directive.customMonth).toBe('short');
            expect(nativeElement.customMonth).toBe('short');

            fixture.componentInstance.customMonth = undefined;
            fixture.detectChanges();

            expect(directive.customMonth).toBeNull();
            expect(nativeElement.customMonth).toBeNull();
        });

        it('can be configured with attribute binding for customDay', () => {
            expect(directive.customDay).toBe('2-digit');
            expect(nativeElement.customDay).toBe('2-digit');

            fixture.componentInstance.customDay = 'numeric';
            fixture.detectChanges();

            expect(directive.customDay).toBe('numeric');
            expect(nativeElement.customDay).toBe('numeric');
        });

        it('can be configured with attribute binding for customDay updated to undefined', () => {
            expect(directive.customDay).toBe('2-digit');
            expect(nativeElement.customDay).toBe('2-digit');

            fixture.componentInstance.customDay = undefined;
            fixture.detectChanges();

            expect(directive.customDay).toBeNull();
            expect(nativeElement.customDay).toBeNull();
        });

        it('can be configured with attribute binding for customHour', () => {
            expect(directive.customHour).toBe('numeric');
            expect(nativeElement.customHour).toBe('numeric');

            fixture.componentInstance.customHour = '2-digit';
            fixture.detectChanges();

            expect(directive.customHour).toBe('2-digit');
            expect(nativeElement.customHour).toBe('2-digit');
        });

        it('can be configured with attribute binding for customHour updated to undefined', () => {
            expect(directive.customHour).toBe('numeric');
            expect(nativeElement.customHour).toBe('numeric');

            fixture.componentInstance.customHour = undefined;
            fixture.detectChanges();

            expect(directive.customHour).toBeNull();
            expect(nativeElement.customHour).toBeNull();
        });

        it('can be configured with attribute binding for customMinute', () => {
            expect(directive.customMinute).toBe('2-digit');
            expect(nativeElement.customMinute).toBe('2-digit');

            fixture.componentInstance.customMinute = 'numeric';
            fixture.detectChanges();

            expect(directive.customMinute).toBe('numeric');
            expect(nativeElement.customMinute).toBe('numeric');
        });

        it('can be configured with attribute binding for customMinute updated to undefined', () => {
            expect(directive.customMinute).toBe('2-digit');
            expect(nativeElement.customMinute).toBe('2-digit');

            fixture.componentInstance.customMinute = undefined;
            fixture.detectChanges();

            expect(directive.customMinute).toBeNull();
            expect(nativeElement.customMinute).toBeNull();
        });

        it('can be configured with attribute binding for customSecond', () => {
            expect(directive.customSecond).toBe('numeric');
            expect(nativeElement.customSecond).toBe('numeric');

            fixture.componentInstance.customSecond = '2-digit';
            fixture.detectChanges();

            expect(directive.customSecond).toBe('2-digit');
            expect(nativeElement.customSecond).toBe('2-digit');
        });

        it('can be configured with attribute binding for customSecond updated to undefined', () => {
            expect(directive.customSecond).toBe('numeric');
            expect(nativeElement.customSecond).toBe('numeric');

            fixture.componentInstance.customSecond = undefined;
            fixture.detectChanges();

            expect(directive.customSecond).toBeNull();
            expect(nativeElement.customSecond).toBeNull();
        });

        it('can be configured with attribute binding for customTimeZoneName', () => {
            expect(directive.customTimeZoneName).toBe('shortOffset');
            expect(nativeElement.customTimeZoneName).toBe('shortOffset');

            fixture.componentInstance.customTimeZoneName = 'long';
            fixture.detectChanges();

            expect(directive.customTimeZoneName).toBe('long');
            expect(nativeElement.customTimeZoneName).toBe('long');
        });

        it('can be configured with attribute binding for customTimeZoneName updated to undefined', () => {
            expect(directive.customTimeZoneName).toBe('shortOffset');
            expect(nativeElement.customTimeZoneName).toBe('shortOffset');

            fixture.componentInstance.customTimeZoneName = undefined;
            fixture.detectChanges();

            expect(directive.customTimeZoneName).toBeNull();
            expect(nativeElement.customTimeZoneName).toBeNull();
        });

        it('can be configured with attribute binding for customFormatMatcher', () => {
            expect(directive.customFormatMatcher).toBe('basic');
            expect(nativeElement.customFormatMatcher).toBe('basic');

            fixture.componentInstance.customFormatMatcher = 'best fit';
            fixture.detectChanges();

            expect(directive.customFormatMatcher).toBe('best fit');
            expect(nativeElement.customFormatMatcher).toBe('best fit');
        });

        it('can be configured with attribute binding for customFormatMatcher updated to undefined', () => {
            expect(directive.customFormatMatcher).toBe('basic');
            expect(nativeElement.customFormatMatcher).toBe('basic');

            fixture.componentInstance.customFormatMatcher = undefined;
            fixture.detectChanges();

            expect(directive.customFormatMatcher).toBeNull();
            expect(nativeElement.customFormatMatcher).toBeNull();
        });

        it('can be configured with attribute binding for customHour12', () => {
            expect(directive.customHour12).toBeFalse();
            expect(nativeElement.customHour12).toBeFalse();

            fixture.componentInstance.customHour12 = true;
            fixture.detectChanges();

            expect(directive.customHour12).toBeTrue();
            expect(nativeElement.customHour12).toBeTrue();
        });

        it('can be configured with attribute binding for customHour12 updated to undefined', () => {
            expect(directive.customHour12).toBeFalse();
            expect(nativeElement.customHour12).toBeFalse();

            fixture.componentInstance.customHour12 = undefined;
            fixture.detectChanges();

            expect(directive.customHour12).toBeNull();
            expect(nativeElement.customHour12).toBeNull();
        });

        it('can be configured with attribute binding for customTimeZone', () => {
            expect(directive.customTimeZone).toBe('America/Chicago');
            expect(nativeElement.customTimeZone).toBe('America/Chicago');

            fixture.componentInstance.customTimeZone = 'America/New York';
            fixture.detectChanges();

            expect(directive.customTimeZone).toBe('America/New York');
            expect(nativeElement.customTimeZone).toBe('America/New York');
        });

        it('can be configured with attribute binding for customTimeZone updated to undefined', () => {
            expect(directive.customTimeZone).toBe('America/Chicago');
            expect(nativeElement.customTimeZone).toBe('America/Chicago');

            fixture.componentInstance.customTimeZone = undefined;
            fixture.detectChanges();

            expect(directive.customTimeZone).toBeNull();
            expect(nativeElement.customTimeZone).toBeNull();
        });

        it('can be configured with attribute binding for customCalendar', () => {
            expect(directive.customCalendar).toBe('hebrew');
            expect(nativeElement.customCalendar).toBe('hebrew');

            fixture.componentInstance.customCalendar = 'gregorian';
            fixture.detectChanges();

            expect(directive.customCalendar).toBe('gregorian');
            expect(nativeElement.customCalendar).toBe('gregorian');
        });

        it('can be configured with attribute binding for customCalendar updated to undefined', () => {
            expect(directive.customCalendar).toBe('hebrew');
            expect(nativeElement.customCalendar).toBe('hebrew');

            fixture.componentInstance.customCalendar = undefined;
            fixture.detectChanges();

            expect(directive.customCalendar).toBeNull();
            expect(nativeElement.customCalendar).toBeNull();
        });

        it('can be configured with attribute binding for customDayPeriod', () => {
            expect(directive.customDayPeriod).toBe('long');
            expect(nativeElement.customDayPeriod).toBe('long');

            fixture.componentInstance.customDayPeriod = 'narrow';
            fixture.detectChanges();

            expect(directive.customDayPeriod).toBe('narrow');
            expect(nativeElement.customDayPeriod).toBe('narrow');
        });

        it('can be configured with attribute binding for customDayPeriod updated to undefined', () => {
            expect(directive.customDayPeriod).toBe('long');
            expect(nativeElement.customDayPeriod).toBe('long');

            fixture.componentInstance.customDayPeriod = undefined;
            fixture.detectChanges();

            expect(directive.customDayPeriod).toBeNull();
            expect(nativeElement.customDayPeriod).toBeNull();
        });

        it('can be configured with attribute binding for customNumberingSystem', () => {
            expect(directive.customNumberingSystem).toBe('latn');
            expect(nativeElement.customNumberingSystem).toBe('latn');

            fixture.componentInstance.customNumberingSystem = 'fancy';
            fixture.detectChanges();

            expect(directive.customNumberingSystem).toBe('fancy');
            expect(nativeElement.customNumberingSystem).toBe('fancy');
        });

        it('can be configured with attribute binding for customNumberingSystem updated to undefined', () => {
            expect(directive.customNumberingSystem).toBe('latn');
            expect(nativeElement.customNumberingSystem).toBe('latn');

            fixture.componentInstance.customNumberingSystem = undefined;
            fixture.detectChanges();

            expect(directive.customNumberingSystem).toBeNull();
            expect(nativeElement.customNumberingSystem).toBeNull();
        });

        it('can be configured with attribute binding for customDateStyle', () => {
            expect(directive.customDateStyle).toBe('medium');
            expect(nativeElement.customDateStyle).toBe('medium');

            fixture.componentInstance.customDateStyle = 'long';
            fixture.detectChanges();

            expect(directive.customDateStyle).toBe('long');
            expect(nativeElement.customDateStyle).toBe('long');
        });

        it('can be configured with attribute binding for customDateStyle updated to undefined', () => {
            expect(directive.customDateStyle).toBe('medium');
            expect(nativeElement.customDateStyle).toBe('medium');

            fixture.componentInstance.customDateStyle = undefined;
            fixture.detectChanges();

            expect(directive.customDateStyle).toBeNull();
            expect(nativeElement.customDateStyle).toBeNull();
        });

        it('can be configured with attribute binding for customTimeStyle', () => {
            expect(directive.customTimeStyle).toBe('full');
            expect(nativeElement.customTimeStyle).toBe('full');

            fixture.componentInstance.customTimeStyle = 'long';
            fixture.detectChanges();

            expect(directive.customTimeStyle).toBe('long');
            expect(nativeElement.customTimeStyle).toBe('long');
        });

        it('can be configured with attribute binding for customTimeStyle updated to undefined', () => {
            expect(directive.customTimeStyle).toBe('full');
            expect(nativeElement.customTimeStyle).toBe('full');

            fixture.componentInstance.customTimeStyle = undefined;
            fixture.detectChanges();

            expect(directive.customTimeStyle).toBeNull();
            expect(nativeElement.customTimeStyle).toBeNull();
        });

        it('can be configured with attribute binding for customHourCycle', () => {
            expect(directive.customHourCycle).toBe('h23');
            expect(nativeElement.customHourCycle).toBe('h23');

            fixture.componentInstance.customHourCycle = 'h12';
            fixture.detectChanges();

            expect(directive.customHourCycle).toBe('h12');
            expect(nativeElement.customHourCycle).toBe('h12');
        });

        it('can be configured with attribute binding for customHourCycle updated to undefined', () => {
            expect(directive.customHourCycle).toBe('h23');
            expect(nativeElement.customHourCycle).toBe('h23');

            fixture.componentInstance.customHourCycle = undefined;
            fixture.detectChanges();

            expect(directive.customHourCycle).toBeNull();
            expect(nativeElement.customHourCycle).toBeNull();
        });
    });
});
