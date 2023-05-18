import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnTextModule } from '../nimble-table-column-text.module';
import { NimbleTableColumnTextDirective, TableColumnText } from '../nimble-table-column-text.directive';
import { TableColumnSortDirection } from '../../base/nimble-table-column-base.directive';

describe('NimbleTableColumnText', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTableModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-table')).not.toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-text
                        #column
                        column-id="my-column"
                        field-name="field1"
                        placeholder="no value"
                        action-menu-slot="my-slot"
                        action-menu-label="my menu"
                        column-hidden="true"
                        fractional-width="2"
                        min-pixel-width="40"
                        sort-direction="${TableColumnSortDirection.ascending}"
                        sort-index="0"
                        group-index="0"
                        grouping-disabled
                    ></nimble-table-column-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnTextDirective }) public directive: NimbleTableColumnTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnText>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnTextDirective;
        let nativeElement: TableColumnText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnTextModule, NimbleTableModule]
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

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-text
                        #column
                        [column-id]="columnId"
                        [field-name]="field"
                        [placeholder]="placeholder"
                        [actionMenuSlot]="actionMenuSlot"
                        [actionMenuLabel]="actionMenuLabel"
                        [column-hidden]="columnHidden"
                        [fractional-width]="fractionalWidth"
                        [min-pixel-width]="minPixelWidth"
                        [sort-direction]="sortDirection"
                        [sort-index]="sortIndex"
                        [group-index]="groupIndex"
                        [grouping-disabled]="groupingDisabled"
                    ></nimble-table-column-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnTextDirective }) public directive: NimbleTableColumnTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnText>;
            public field = 'field1';
            public placeholder = 'no value';
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
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnTextDirective;
        let nativeElement: TableColumnText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnTextModule, NimbleTableModule]
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

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');

            fixture.componentInstance.placeholder = 'foo';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('foo');
            expect(nativeElement.placeholder).toBe('foo');
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
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-text
                        #column
                        [attr.column-id]="columnId"
                        [attr.field-name]="field"
                        [attr.placeholder]="placeholder"
                        [attr.action-menu-slot]="actionMenuSlot"
                        [attr.action-menu-label]="actionMenuLabel"
                        [attr.column-hidden]="columnHidden"
                        [attr.fractional-width]="fractionalWidth"
                        [attr.min-pixel-width]="minPixelWidth"
                        [attr.sort-direction]="sortDirection"
                        [attr.sort-index]="sortIndex"
                        [attr.group-index]="groupIndex"
                        [attr.grouping-disabled]="groupingDisabled"
                    ></nimble-table-column-text>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnTextDirective }) public directive: NimbleTableColumnTextDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnText>;
            public field = 'field1';
            public placeholder = 'no value';
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
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnTextDirective;
        let nativeElement: TableColumnText;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnTextModule, NimbleTableModule]
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

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('no value');
            expect(nativeElement.placeholder).toBe('no value');

            fixture.componentInstance.placeholder = 'foo';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('foo');
            expect(nativeElement.placeholder).toBe('foo');
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
    });
});
