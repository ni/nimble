import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Table, TableRecord } from '@ni/nimble-angular';
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
    });

    describe('with property bound values', () => {
        interface SimpleRecord extends TableRecord {
            myStr: string;
            myNum: number;
        }

        @Component({
            template: `
                <nimble-table #table [data]="data"></nimble-table>
            `
        })
        class TestHostComponent {
            @ViewChild('table', { read: NimbleTableDirective }) public directive: NimbleTableDirective<SimpleRecord>;
            @ViewChild('table', { read: ElementRef }) public elementRef: ElementRef<Table<SimpleRecord>>;
            public readonly originalData = [{
                myStr: 'hello world',
                myNum: 5
            }] as const;

            public data: SimpleRecord[] = [...this.originalData];
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
                myStr: 'abc',
                myNum: -6
            }, {
                myStr: 'hello world',
                myNum: 7
            }, {
                myStr: 'foo bar baz',
                myNum: 999
            }] as const;
            fixture.componentInstance.data = [...newData];
            fixture.detectChanges();

            expect(directive.data).toEqual(newData);
            expect(nativeElement.data).toEqual(newData);
        });
    });
});
