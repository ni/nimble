import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { waitForUpdatesAsync } from '@ni/nimble-angular';
import { NimbleTableModule, Table, TableRecord } from '@ni/nimble-angular/table';
import { NimbleTableColumnTextModule } from '@ni/nimble-angular/table-column/text';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { TablePageObject } from '../table.pageobject';

describe('Table page object', () => {
    describe('data updates', () => {
        interface SimpleRecord extends TableRecord {
            field1: string;
            field2: string;
        }

        @Component({
            template: `
                <nimble-table #table [data$]="data$" [class.fit-height]="fitHeight">
                    <nimble-table-column-text field-name="field1">Column 1</nimble-table-column-text>
                    <nimble-table-column-text field-name="field2">Column 2</nimble-table-column-text>
                </nimble-table>
            `,
            styles: [`
                .fit-height {
                    height: var(${tableFitRowsHeight.cssCustomProperty});
                }
            `]
        })
        class TestHostComponent {
            @ViewChild('table', { read: ElementRef }) public tableElement: ElementRef<Table<SimpleRecord>>;
            public dataSubject = new Subject<SimpleRecord[]>();
            public data$ = this.dataSubject.asObservable();
            public fitHeight = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let pageObject: TablePageObject<SimpleRecord>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [
                    NimbleTableModule,
                    NimbleTableColumnTextModule
                ]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();

            pageObject = new TablePageObject<SimpleRecord>(fixture.componentInstance.tableElement.nativeElement);
        });

        it('can await rendering to be done after emitting a new value to data$ observable', async () => {
            expect(pageObject.getRenderedRowCount()).toBe(0);

            const data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            fixture.componentInstance.dataSubject.next(data);
            expect(pageObject.getRenderedRowCount()).toBe(0);

            await pageObject.waitForDataUpdatesToRender();
            expect(pageObject.getRenderedRowCount()).toBe(1);
        });

        it('can await multiple data updates', async () => {
            let data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            fixture.componentInstance.dataSubject.next(data);

            await pageObject.waitForDataUpdatesToRender();
            expect(pageObject.getRenderedRowCount()).toBe(1);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
            expect(pageObject.getRenderedCellTextContent(0, 1)).toBe('bar');

            data = [{
                field1: 'hello',
                field2: 'world'
            }];
            fixture.componentInstance.dataSubject.next(data);

            await pageObject.waitForDataUpdatesToRender();
            expect(pageObject.getRenderedRowCount()).toBe(1);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('hello');
            expect(pageObject.getRenderedCellTextContent(0, 1)).toBe('world');
        });

        it('waits for row height to be applied when using fit-rows-height token', async () => {
            fixture.componentInstance.fitHeight = true;
            fixture.detectChanges();
            await waitForUpdatesAsync();

            const data: SimpleRecord[] = [{
                field1: 'foo',
                field2: 'bar'
            }];
            fixture.componentInstance.dataSubject.next(data);
            await pageObject.waitForDataUpdatesToRender();
            expect(pageObject.getRenderedRowCount()).toBe(1);
        });
    });
});
