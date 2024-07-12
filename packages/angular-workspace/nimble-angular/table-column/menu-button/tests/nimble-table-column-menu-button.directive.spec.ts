import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTableModule } from '../../../table/nimble-table.module';
import { NimbleTableColumnMenuButtonModule } from '../nimble-table-column-menu-button.module';
import { NimbleTableColumnMenuButtonDirective, TableColumnMenuButton } from '../nimble-table-column-menu-button.directive';

describe('NimbleTableColumnMenuButtonDirective', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTableColumnMenuButtonModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-table-column-menu-button')).not.toBeUndefined();
        });
    });

    describe('with default configuration', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-menu-button #column field-name="field1">
                    </nimble-table-column-menu-button>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnMenuButtonDirective }) public directive: NimbleTableColumnMenuButtonDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnMenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnMenuButtonDirective;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnMenuButtonModule, NimbleTableModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('has valid configuration by default', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(directive.validity.invalidDecimalDigits).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-menu-button
                        #column
                        column-id="my-column"
                        field-name="field1"
                        action-menu-slot="my-slot"
                        action-menu-label="my menu"
                        column-hidden="true"
                        fractional-width="2"
                        min-pixel-width="40"
                        menu-slot="my-menu-slot"
                    ></nimble-table-column-menu-button>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnMenuButtonDirective }) public directive: NimbleTableColumnMenuButtonDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnMenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnMenuButtonDirective;
        let nativeElement: TableColumnMenuButton;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnMenuButtonModule, NimbleTableModule]
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

        it('will use template string values for fractionalWidth', () => {
            expect(directive.fractionalWidth).toBe(2);
            expect(nativeElement.fractionalWidth).toBe(2);
        });

        it('will use template string values for minPixelWidth', () => {
            expect(directive.minPixelWidth).toBe(40);
            expect(nativeElement.minPixelWidth).toBe(40);
        });

        it('will use template string values for menuSlot', () => {
            expect(directive.menuSlot).toBe('my-menu-slot');
            expect(nativeElement.menuSlot).toBe('my-menu-slot');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-menu-button
                        #column
                        [column-id]="columnId"
                        [field-name]="field"
                        [action-menu-slot]="actionMenuSlot"
                        [action-menu-label]="actionMenuLabel"
                        [column-hidden]="columnHidden"
                        [fractional-width]="fractionalWidth"
                        [min-pixel-width]="minPixelWidth"
                        [menu-slot]="menuSlot"
                    ></nimble-table-column-menu-button>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnMenuButtonDirective }) public directive: NimbleTableColumnMenuButtonDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnMenuButton>;
            public field = 'field1';
            public actionMenuSlot = 'my-slot';
            public actionMenuLabel = 'my menu';
            public fractionalWidth: number | null = 2;
            public minPixelWidth: number | null = 40;
            public columnId = 'my-column';
            public columnHidden = true;
            public menuSlot = 'my-menu-slot';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnMenuButtonDirective;
        let nativeElement: TableColumnMenuButton;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnMenuButtonModule, NimbleTableModule]
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

        it('can be configured with property binding for menuSlot', () => {
            expect(directive.menuSlot).toBe('my-menu-slot');
            expect(nativeElement.menuSlot).toBe('my-menu-slot');

            fixture.componentInstance.menuSlot = 'new-slot';
            fixture.detectChanges();

            expect(directive.menuSlot).toBe('new-slot');
            expect(nativeElement.menuSlot).toBe('new-slot');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-table>
                    <nimble-table-column-menu-button
                        #column
                        [attr.column-id]="columnId"
                        [attr.field-name]="field"
                        [attr.action-menu-slot]="actionMenuSlot"
                        [attr.action-menu-label]="actionMenuLabel"
                        [attr.column-hidden]="columnHidden"
                        [attr.fractional-width]="fractionalWidth"
                        [attr.min-pixel-width]="minPixelWidth"
                        [attr.menu-slot]="menuSlot"
                    ></nimble-table-column-menu-button>
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('column', { read: NimbleTableColumnMenuButtonDirective }) public directive: NimbleTableColumnMenuButtonDirective;
            @ViewChild('column', { read: ElementRef }) public elementRef: ElementRef<TableColumnMenuButton>;
            public field = 'field1';
            public actionMenuSlot = 'my-slot';
            public actionMenuLabel = 'my menu';
            public fractionalWidth: number | null = 2;
            public minPixelWidth: number | null = 40;
            public columnId = 'my-column';
            public columnHidden = true;
            public menuSlot = 'my-menu-slot';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableColumnMenuButtonDirective;
        let nativeElement: TableColumnMenuButton;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableColumnMenuButtonModule, NimbleTableModule]
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

        it('can be configured with attribute binding for menuSlot', () => {
            expect(directive.menuSlot).toBe('my-menu-slot');
            expect(nativeElement.menuSlot).toBe('my-menu-slot');

            fixture.componentInstance.menuSlot = 'new-slot';
            fixture.detectChanges();

            expect(directive.menuSlot).toBe('new-slot');
            expect(nativeElement.menuSlot).toBe('new-slot');
        });
    });
});
