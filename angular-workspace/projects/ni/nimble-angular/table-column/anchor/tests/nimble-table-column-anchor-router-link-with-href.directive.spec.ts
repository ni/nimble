import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Anchor, processUpdates, waitForUpdatesAsync } from '@ni/nimble-angular';
import { TablePageObject } from '@ni/nimble-angular/table/testing';
import { NimbleTableModule, Table } from '@ni/nimble-angular/table';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';
import { NimbleTableColumnAnchorRouterLinkWithHrefDirective } from '../nimble-table-column-anchor-router-link-with-href.directive';
import type { TableColumnAnchor } from '../nimble-table-column-anchor.directive';

describe('Nimble anchor table column RouterLinkWithHrefDirective', () => {
    const data = [
        { name: 'jim', link: 'page1' },
    ];

    @Component({
        template: `
            <nimble-table #table>
                <nimble-table-column-anchor #column label-field-name="name" href-field-name="link" nimbleRouterLink [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                    Link
                </nimble-table-column-anchor>
            </nimble-table>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
        @ViewChild('table', { static: true }) public table: ElementRef<Table>;
        @ViewChild('column', { static: true }) public column: ElementRef<TableColumnAnchor>;
        @ViewChild('column', { read: NimbleTableColumnAnchorRouterLinkWithHrefDirective }) public directive: NimbleTableColumnAnchorRouterLinkWithHrefDirective;
    }

    @Component({ template: '' })
    class BlankComponent { }

    let anchor: Anchor;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let innerAnchor: HTMLAnchorElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [NimbleTableColumnAnchorModule,
                NimbleTableModule,
                CommonModule,
                RouterTestingModule.withRoutes([
                    { path: '', redirectTo: '/start', pathMatch: 'full' },
                    { path: 'page1', component: BlankComponent },
                    { path: 'start', component: TestHostComponent }
                ], { useHash: false })
            ]
        });
    });

    beforeEach(async () => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        await testHostComponent.table.nativeElement.setData(data);
        await waitForUpdatesAsync();
        const pageObject = new TablePageObject(testHostComponent.table.nativeElement);
        anchor = pageObject.getRenderedCellAnchor(0, 0);
        innerAnchor = anchor!.shadowRoot!.querySelector('a')!;
        anchorClickHandlerSpy = jasmine.createSpy('click');
        innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
        fixture.detectChanges();
    });

    afterEach(() => {
        processUpdates();
    });

    it('navigates via router.navigateByUrl when link is clicked', fakeAsync(() => {
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        innerAnchor.click();
        tick();

        const expectedDestinationUrl = '/page1?param1=true';
        const expectedUrlTree = router.parseUrl(expectedDestinationUrl);
        expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedUrlTree, jasmine.objectContaining({
            state: {
                stateProperty: 123
            }
        }));
        expect(location.path()).toEqual(expectedDestinationUrl);
    }));

    it('leaves urlTree null before and after clicking', fakeAsync(() => {
        expect(testHostComponent.directive.urlTree).toBeNull();
        innerAnchor.click();
        tick();
        expect(testHostComponent.directive.urlTree).toBeNull();
    }));

    it('throws error when setting nimbleRouterLink', () => {
        expect(() => {
            testHostComponent.directive.nimbleRouterLink = 'foo';
        }).toThrowError();
    });

    const secondaryClickTests: { testName: string, clickArgs: { [key: string]: unknown } }[] = [
        { testName: 'middle mouse click', clickArgs: { button: 1 } },
        { testName: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
    ];
    secondaryClickTests.forEach(test => {
        it(`does not do router navigation for non-primary-mouse link clicks for ${test.testName}`, fakeAsync(() => {
            routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
            innerAnchor.dispatchEvent(new MouseEvent('click', {
                ...{
                    bubbles: true,
                    cancelable: true
                },
                ...test.clickArgs
            }));
            tick();

            expect(anchorClickHandlerSpy).toHaveBeenCalledTimes(1);
            expect(routerNavigateByUrlSpy).not.toHaveBeenCalled();
        }));
    });

    describe('handleLinkClick', () => {
        interface IHandleLinkClickTestCase {
            anchorUrl: string;
            baseHref: string;
            expectedNavigateByUrlArgument: string | undefined;
            expectedReturnValue: boolean;
        }

        const testCases: IHandleLinkClickTestCase[] = [{
            anchorUrl: '/app1/main',
            baseHref: '/app1/',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false

        }, {
            anchorUrl: '/app1/main',
            baseHref: '/app1',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1/main',
            baseHref: 'app1/',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1/main',
            baseHref: 'app1',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1',
            baseHref: '/app1/',
            expectedNavigateByUrlArgument: '',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1',
            baseHref: 'app1/',
            expectedNavigateByUrlArgument: '',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1',
            baseHref: '/app1',
            expectedNavigateByUrlArgument: '',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1',
            baseHref: 'app1',
            expectedNavigateByUrlArgument: '',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app1/other',
            baseHref: '/app1/',
            expectedNavigateByUrlArgument: 'other',
            expectedReturnValue: false
        }, {
            anchorUrl: '/app2/main',
            baseHref: '/app1/',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }, {
            anchorUrl: '/app123/main',
            baseHref: '/app1/',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }, {
            anchorUrl: '/app123/main',
            baseHref: '/app1',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }, {
            anchorUrl: '/app123/main',
            baseHref: 'app1/',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }, {
            anchorUrl: '/app123/main',
            baseHref: 'app1',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }, {
            anchorUrl: '/my/app',
            baseHref: '/my/app/',
            expectedNavigateByUrlArgument: '',
            expectedReturnValue: false
        }, {
            anchorUrl: '/my/app/main',
            baseHref: '/my/app/',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false
        }, {
            anchorUrl: '/my/app/main',
            baseHref: 'my/app',
            expectedNavigateByUrlArgument: 'main',
            expectedReturnValue: false
        }, {
            anchorUrl: '/my',
            baseHref: 'my/app',
            expectedNavigateByUrlArgument: undefined,
            expectedReturnValue: true
        }];

        for (const testCase of testCases) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            it(`should handle tree click correct with anchorUrl of ${testCase.anchorUrl} and baseHref of ${testCase.baseHref}`, async (): Promise<void> => {
                const locationStrategy = TestBed.inject(LocationStrategy);
                spyOn(locationStrategy, 'getBaseHref').and.returnValue(testCase.baseHref);

                await testHostComponent.table.nativeElement.setData([
                    { name: 'jim', link: testCase.anchorUrl },
                ]);
                await waitForUpdatesAsync();
                fixture.detectChanges();

                routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.stub();

                // eslint-disable-next-line @typescript-eslint/dot-notation
                const returnValue = testHostComponent.directive['handleLinkClick'](testCase.anchorUrl, 0, false, false, false, false);
                if (testCase.expectedNavigateByUrlArgument === undefined) {
                    expect(routerNavigateByUrlSpy).not.toHaveBeenCalled();
                } else {
                    const expectedDestinationUrl = `/${testCase.expectedNavigateByUrlArgument}?param1=true`;
                    const expectedUrlTree = router.parseUrl(expectedDestinationUrl);
                    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedUrlTree, jasmine.objectContaining({
                        state: {
                            stateProperty: 123
                        }
                    }));
                }

                expect(returnValue).toEqual(testCase.expectedReturnValue);
            });
        }
    });
});
