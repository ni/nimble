import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Anchor, processUpdates, waitForUpdatesAsync } from '@ni/nimble-angular';
import { parameterizeNamedList } from '@ni/nimble-angular/testing';
import { TablePageObject } from '@ni/nimble-angular/table/testing';
import { NimbleTableModule, Table } from '@ni/nimble-angular/table';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';

describe('Nimble anchor table column navigation guard', () => {
    const data = [
        { id: '1', name: 'jim', link: 'page1' },
    ];

    @Component({
        template: `
            <nimble-table #table id-field-name="id">
                <nimble-table-column-anchor #column label-field-name="name" href-field-name="link" [navigationGuard]="onClick">
                    Link
                </nimble-table-column-anchor>
            </nimble-table>
        `
    })
    class TestHostBasicComponent {
        @ViewChild('table', { static: true }) public table: ElementRef<Table>;

        public onClick(_rowRecordId: string | undefined): boolean {
            return false;
        }
    }

    @Component({
        template: `
            <nimble-table #table id-field-name="id">
                <nimble-table-column-anchor #column label-field-name="name" href-field-name="link" target="_blank" [navigationGuard]="onClick">
                    Link
                </nimble-table-column-anchor>
            </nimble-table>
        `
    })
    class TestHostWithTargetComponent {
        @ViewChild('table', { static: true }) public table: ElementRef<Table>;

        public onClick(_rowRecordId: string | undefined): boolean {
            return false;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostBasicComponent, TestHostWithTargetComponent],
            imports: [NimbleTableColumnAnchorModule,
                NimbleTableModule,
                CommonModule
            ]
        });
    });

    afterEach(() => {
        processUpdates();
    });

    describe('basic config', () => {
        let anchor: Anchor;
        let fixture: ComponentFixture<TestHostBasicComponent>;
        let testHostComponent: TestHostBasicComponent;
        let innerAnchor: HTMLAnchorElement;
        let anchorClickHandlerSpy: jasmine.Spy;
        let onClickSpy: jasmine.Spy;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostBasicComponent);
            testHostComponent = fixture.componentInstance;
            await testHostComponent.table.nativeElement.setData(data);
            await waitForUpdatesAsync();
            const pageObject = new TablePageObject(testHostComponent.table.nativeElement);
            anchor = pageObject.getRenderedCellAnchor(0, 0);
            innerAnchor = anchor!.shadowRoot!.querySelector('a')!;
            anchorClickHandlerSpy = jasmine.createSpy('click');
            innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
            onClickSpy = spyOn(testHostComponent, 'onClick');

            fixture.detectChanges();
        });

        it('calls configured navigationGuard when link is clicked', fakeAsync(() => {
            innerAnchor.click();
            tick();

            expect(onClickSpy).toHaveBeenCalledOnceWith('1');
        }));

        const secondaryClickTests = [
            { name: 'middle mouse click', clickArgs: { button: 1 } },
            { name: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
        ] as const;
        parameterizeNamedList(secondaryClickTests, (spec, name, value) => {
            spec(`does not call navigationGuard for non-primary-mouse link clicks for ${name}`, fakeAsync(() => {
                innerAnchor.dispatchEvent(new MouseEvent('click', {
                    ...{
                        bubbles: true,
                        cancelable: true
                    },
                    ...value.clickArgs
                }));
                tick();

                expect(anchorClickHandlerSpy).toHaveBeenCalledTimes(1);
                expect(onClickSpy).not.toHaveBeenCalled();
            }));
        });
    });

    describe('with target=_blank', () => {
        let anchor: Anchor;
        let fixture: ComponentFixture<TestHostWithTargetComponent>;
        let testHostComponent: TestHostWithTargetComponent;
        let innerAnchor: HTMLAnchorElement;
        let anchorClickHandlerSpy: jasmine.Spy;
        let onClickSpy: jasmine.Spy;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostWithTargetComponent);
            testHostComponent = fixture.componentInstance;
            await testHostComponent.table.nativeElement.setData(data);
            await waitForUpdatesAsync();
            const pageObject = new TablePageObject(testHostComponent.table.nativeElement);
            anchor = pageObject.getRenderedCellAnchor(0, 0);
            innerAnchor = anchor!.shadowRoot!.querySelector('a')!;
            anchorClickHandlerSpy = jasmine.createSpy('click');
            innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
            onClickSpy = spyOn(testHostComponent, 'onClick');

            fixture.detectChanges();
        });

        it('does not call navigationGuard when link is clicked', fakeAsync(() => {
            innerAnchor.click();
            tick();

            expect(anchorClickHandlerSpy).toHaveBeenCalledTimes(1);
            expect(onClickSpy).not.toHaveBeenCalled();
        }));
    });
});
