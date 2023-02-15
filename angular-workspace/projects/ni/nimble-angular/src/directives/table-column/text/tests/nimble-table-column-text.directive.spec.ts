import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnTextModule } from '../nimble-table-column-text.module';
import { NimbleTableColumnTextDirective, TableColumnText } from '../nimble-table-column-text.directive';

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
            public columnId = 'my-column';
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
            public columnId = 'my-column';
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
    });
});
