import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { processUpdates, Table, TableRecord, TableValidity } from '@ni/nimble-angular';
import { Observable, Subject } from 'rxjs';
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

    describe('data updates', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table [data$]="data$"></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;

            public dataSubject = new Subject<SimpleRecord[]>();
            public data$ = this.dataSubject.asObservable();
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let nativeElement: Table<SimpleRecord>;
        let spy: jasmine.Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
            spy = spyOn(nativeElement, 'setData');
        });

        it('`setData()` is called when data is emitted from the `data$` observable', () => {
            const data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            fixture.componentInstance.dataSubject.next(data);
            expect(spy).toHaveBeenCalledOnceWith(data);
        });

        it('`setData()` is called after the bound observable changes', () => {
            const newSubject = new Subject<SimpleRecord[]>();
            const newObservable = newSubject.asObservable();
            fixture.componentInstance.data$ = newObservable;
            fixture.detectChanges();

            const data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            newSubject.next(data);
            expect(spy).toHaveBeenCalledOnceWith(data);
        });

        it('changing bound `data$` observable unsubscribes from the original observable', () => {
            fixture.componentInstance.data$ = new Observable<SimpleRecord[]>();
            fixture.detectChanges();

            const data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            fixture.componentInstance.dataSubject.next(data);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('validity', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table [idFieldName]="idFieldName"></nimble-table>
            `
        })
        class TestHostComponent implements AfterViewInit {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;
            public readonly originalData: readonly SimpleRecord[] = [{
                field1: 'hello world',
                field2: 'foo'
            }] as const;

            public idFieldName = 'field1';

            public ngAfterViewInit(): void {
                this.directive.setData(this.originalData);
            }
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
            processUpdates();

            expect(directive.checkValidity()).toBeFalse();
            expect(nativeElement.checkValidity()).toBeFalse();
        });

        it('`validity` property returns expected state', () => {
            fixture.componentInstance.idFieldName = 'not-a-field';
            fixture.detectChanges();
            processUpdates();

            const expectedValidity: TableValidity = {
                duplicateRecordId: false,
                invalidRecordId: false,
                missingRecordId: true,
                duplicateColumnId: false,
                missingColumnId: false,
                duplicateSortIndex: false,
                idFieldNameNotConfigured: false
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

        it('has expected defaults for data$', () => {
            expect(directive.data$).toEqual(undefined);
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
                <nimble-table #table [data$]="data$" [idFieldName]="idFieldName"></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;

            public data$ = new Observable<SimpleRecord[]>();
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
            expect(directive.data$).toEqual(fixture.componentInstance.data$);

            const newData$ = new Observable<SimpleRecord[]>();
            fixture.detectChanges();

            expect(directive.data$).toEqual(newData$);
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
