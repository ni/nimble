import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Table, TableRecord, TableValidity } from '@ni/nimble-angular';
import { NimbleTableDirective } from '../nimble-table.directive';
import { NimbleTableModule } from '../nimble-table.module';

describe('Nimble table', () => {
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

    describe('validity', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table [data]="data" [idFieldName]="idFieldName"></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;
            public readonly originalData = [{
                field1: 'hello world',
                field2: 'foo'
            }] as const;

            public data: SimpleRecord[] = [...this.originalData];
            public idFieldName = 'field1';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableDirective<SimpleRecord>;
        let nativeElement: Table<SimpleRecord>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('`checkValidity()` returns `true` when the table is valid', () => {
            expect(directive.checkValidity()).toBeTrue();
            expect(nativeElement.checkValidity()).toBeTrue();
        });

        it('`checkValidity()` returns `false` when the table is not valid', () => {
            fixture.componentInstance.idFieldName = 'not-a-field';
            fixture.detectChanges();

            expect(directive.checkValidity()).toBeFalse();
            expect(nativeElement.checkValidity()).toBeFalse();
        });

        it('`validity` property returns expected state', () => {
            fixture.componentInstance.idFieldName = 'not-a-field';
            fixture.detectChanges();

            const expectedValidity: TableValidity = {
                duplicateRecordId: false,
                invalidRecordId: false,
                missingRecordId: true
            };
            expect(directive.validity).toEqual(expectedValidity);
            expect(nativeElement.validity).toEqual(expectedValidity);
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-table #table></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableDirective;
        let nativeElement: Table;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for data', () => {
            expect(directive.data).toEqual([]);
            expect(nativeElement.data).toEqual([]);
        });

        it('has expected defaults for idFieldName', () => {
            expect(directive.idFieldName).toEqual(undefined);
            expect(nativeElement.idFieldName).toEqual(undefined);
        });
    });

    describe('with property bound values', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table [data]="data" [idFieldName]="idFieldName"></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;
            public readonly originalData = [{
                field1: 'hello world',
                field2: 'foo'
            }] as const;

            public data: SimpleRecord[] = [...this.originalData];
            public idFieldName = 'field1';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableDirective<SimpleRecord>;
        let nativeElement: Table<SimpleRecord>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for data', () => {
            expect(directive.data).toEqual(fixture.componentInstance.originalData);
            expect(nativeElement.data).toEqual(fixture.componentInstance.originalData);

            const newData = [{
                field1: 'abc',
                field2: 'xyz'
            }, {
                field1: 'hello world',
                field2: 'hola world'
            }, {
                field1: 'foo bar baz',
                field2: 'fim fam foo'
            }] as const;
            fixture.componentInstance.data = [...newData];
            fixture.detectChanges();

            expect(directive.data).toEqual(newData);
            expect(nativeElement.data).toEqual(newData);
        });

        it('can be configured with property binding for idFieldName', () => {
            expect(directive.idFieldName).toEqual(fixture.componentInstance.idFieldName);
            expect(nativeElement.idFieldName).toEqual(fixture.componentInstance.idFieldName);

            fixture.componentInstance.idFieldName = 'field2';
            fixture.detectChanges();

            expect(directive.idFieldName).toEqual('field2');
            expect(nativeElement.idFieldName).toEqual('field2');
        });
    });

    describe('with attribute bound values', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table
                    [data]="data"
                    [attr.id-field-name]="idFieldName">
                </nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;
            public readonly originalData = [{
                field1: 'hello world',
                field2: 'foo'
            }] as const;

            public data: SimpleRecord[] = [...this.originalData];
            public idFieldName = 'field1';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTableDirective<SimpleRecord>;
        let nativeElement: Table<SimpleRecord>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for idFieldName', () => {
            expect(directive.idFieldName).toEqual(fixture.componentInstance.idFieldName);
            expect(nativeElement.idFieldName).toEqual(fixture.componentInstance.idFieldName);

            fixture.componentInstance.idFieldName = 'field2';
            fixture.detectChanges();

            expect(directive.idFieldName).toEqual('field2');
            expect(nativeElement.idFieldName).toEqual('field2');
        });
    });
});
