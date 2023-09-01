import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { TableColumnSortDirection } from '../../nimble-table-column-base.directive';
import { NimbleTableColumnNumberTextDirective, NumberTextFormat, TableColumnNumberText } from '../nimble-table-column-number-text.directive';
import { NimbleTableColumnNumberTextModule } from '../nimble-table-column-number-text.module';

describe('NimbleTableColumnNumberText', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTableColumnNumberTextModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-table-column-number-text')).not.toBeUndefined();
        });
    });

    describe('with default configuration', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-number-text #column field-name="field1">
                    </nimble-table-column-number-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnNumberTextDirective }) public directive: NimbleTableColumnNumberTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnNumberText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnNumberTextDirective;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnNumberTextModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('has valid configuration by default', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(directive.validity.invalidDecimalDigits).toBeFalse();
        });

        it('has invalid configuration with format set to decimal with invalid decimal-digits', () => {
            directive.format = NumberTextFormat.decimal;
            directive.decimalDigits = 100;
            expect(directive.checkValidity()).toBeFalse();
            expect(directive.validity.invalidDecimalDigits).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-number-text
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
                        format="${NumberTextFormat.decimal}"
                        decimal-digits="6"
                    ></nimble-table-column-number-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnNumberTextDirective }) public directive: NimbleTableColumnNumberTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnNumberText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnNumberTextDirective;
        let nativeElement: TableColumnNumberText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnNumberTextModule, NimbleTableModule]
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
            expect(directive.columnHidden).toBeTrue();
            expect(nativeElement.columnHidden).toBeTrue();
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
            expect(directive.format).toBe(NumberTextFormat.decimal);
            expect(nativeElement.format).toBe(NumberTextFormat.decimal);
        });

        it('will use template string values for decimalDigits', () => {
            expect(directive.decimalDigits).toBe(6);
            expect(nativeElement.decimalDigits).toBe(6);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-number-text
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
                        [decimal-digits]="decimalDigits"
                    ></nimble-table-column-number-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnNumberTextDirective }) public directive: NimbleTableColumnNumberTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnNumberText>;
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
            public format: NumberTextFormat = NumberTextFormat.roundToInteger;
            public decimalDigits: number | null = 9;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnNumberTextDirective;
        let nativeElement: TableColumnNumberText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnNumberTextModule, NimbleTableModule]
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
            expect(directive.columnHidden).toBeTrue();
            expect(nativeElement.columnHidden).toBeTrue();

            fixture.componentInstance.columnHidden = false;
            fixture.detectChanges();

            expect(directive.columnHidden).toBeFalse();
            expect(nativeElement.columnHidden).toBeFalse();
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

            expect(directive.sortIndex).toBeNull();
            expect(nativeElement.sortIndex).toBeNull();
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

            expect(directive.fractionalWidth).toBeNull();
            expect(nativeElement.fractionalWidth).toBeNull();
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

            expect(directive.minPixelWidth).toBeNull();
            expect(nativeElement.minPixelWidth).toBeNull();
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

            expect(directive.groupIndex).toBeNull();
            expect(nativeElement.groupIndex).toBeNull();
        });

        it('can be configured with property binding for groupingDisabled', () => {
            expect(directive.groupingDisabled).toBeFalse();
            expect(nativeElement.groupingDisabled).toBeFalse();

            fixture.componentInstance.groupingDisabled = true;
            fixture.detectChanges();

            expect(directive.groupingDisabled).toBeTrue();
            expect(nativeElement.groupingDisabled).toBeTrue();
        });

        it('can be configured with property binding for format', () => {
            expect(directive.format).toBe(NumberTextFormat.roundToInteger);
            expect(nativeElement.format).toBe(NumberTextFormat.roundToInteger);

            fixture.componentInstance.format = NumberTextFormat.decimal;
            fixture.detectChanges();

            expect(directive.format).toBe(NumberTextFormat.decimal);
            expect(nativeElement.format).toBe(NumberTextFormat.decimal);
        });

        it('can be configured with property binding for decimalDigits', () => {
            expect(directive.decimalDigits).toBe(9);
            expect(nativeElement.decimalDigits).toBe(9);

            fixture.componentInstance.decimalDigits = 7;
            fixture.detectChanges();

            expect(directive.decimalDigits).toBe(7);
            expect(nativeElement.decimalDigits).toBe(7);
        });

        it('can be configured with property binding for decimalDigits updated to null', () => {
            expect(directive.decimalDigits).toBe(9);
            expect(nativeElement.decimalDigits).toBe(9);

            fixture.componentInstance.decimalDigits = null;
            fixture.detectChanges();

            expect(directive.decimalDigits).toBeNull();
            expect(nativeElement.decimalDigits).toBeNull();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-number-text
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
                        [attr.decimal-digits]="decimalDigits"
                    ></nimble-table-column-number-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnNumberTextDirective }) public directive: NimbleTableColumnNumberTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnNumberText>;
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
            public format: NumberTextFormat = NumberTextFormat.roundToInteger;
            public decimalDigits: number | null = 9;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnNumberTextDirective;
        let nativeElement: TableColumnNumberText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnNumberTextModule, NimbleTableModule]
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
            expect(directive.columnHidden).toBeTrue();
            expect(nativeElement.columnHidden).toBeTrue();

            fixture.componentInstance.columnHidden = false;
            fixture.detectChanges();

            expect(directive.columnHidden).toBeFalse();
            expect(nativeElement.columnHidden).toBeFalse();
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

            expect(directive.sortIndex).toBeNull();
            expect(nativeElement.sortIndex).toBeNull();
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

            expect(directive.fractionalWidth).toBeNull();
            expect(nativeElement.fractionalWidth).toBeNull();
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

            expect(directive.minPixelWidth).toBeNull();
            expect(nativeElement.minPixelWidth).toBeNull();
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

            expect(directive.groupIndex).toBeNull();
            expect(nativeElement.groupIndex).toBeNull();
        });

        it('can be configured with attribute binding for groupingDisabled', () => {
            expect(directive.groupingDisabled).toBeFalse();
            expect(nativeElement.groupingDisabled).toBeFalse();

            fixture.componentInstance.groupingDisabled = true;
            fixture.detectChanges();

            expect(directive.groupingDisabled).toBeTrue();
            expect(nativeElement.groupingDisabled).toBeTrue();
        });

        it('can be configured with attribute binding for format', () => {
            expect(directive.format).toBe(NumberTextFormat.roundToInteger);
            expect(nativeElement.format).toBe(NumberTextFormat.roundToInteger);

            fixture.componentInstance.format = NumberTextFormat.decimal;
            fixture.detectChanges();

            expect(directive.format).toBe(NumberTextFormat.decimal);
            expect(nativeElement.format).toBe(NumberTextFormat.decimal);
        });

        it('can be configured with attribute binding for decimalDigts', () => {
            expect(directive.decimalDigits).toBe(9);
            expect(nativeElement.decimalDigits).toBe(9);

            fixture.componentInstance.decimalDigits = 7;
            fixture.detectChanges();

            expect(directive.decimalDigits).toBe(7);
            expect(nativeElement.decimalDigits).toBe(7);
        });

        it('can be configured with attribute binding for decimalDigts set to null', () => {
            expect(directive.decimalDigits).toBe(9);
            expect(nativeElement.decimalDigits).toBe(9);

            fixture.componentInstance.decimalDigits = 7;
            fixture.detectChanges();

            expect(directive.decimalDigits).toBe(7);
            expect(nativeElement.decimalDigits).toBe(7);
        });
    });
});
