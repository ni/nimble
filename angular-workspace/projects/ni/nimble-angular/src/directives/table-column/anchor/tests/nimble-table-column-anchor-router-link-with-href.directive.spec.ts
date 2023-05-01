import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
// Must import here. Cannot re-export from directive, because cannot import in non-test code.
// eslint-disable-next-line no-restricted-imports
import { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import { processUpdates, waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { NimbleTableColumnAnchorModule } from '../nimble-table-column-anchor.module';
import { NimbleTableColumnAnchorRouterLinkWithHrefDirective } from '../nimble-table-column-anchor-router-link-with-href.directive';
import type { TableColumnAnchor } from '../nimble-table-column-anchor.directive';
import type { Table } from '../../../table/nimble-table.directive';
import type { Anchor } from '../../../anchor/nimble-anchor.directive';
import { NimbleTableModule } from '../../../table/nimble-table.module';

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
                ], { useHash: true })
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
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        anchorClickHandlerSpy = jasmine.createSpy('click');
        innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
        fixture.detectChanges();
    });

    afterEach(() => {
        processUpdates();
    });

    it('navigates via router.navigateByUrl when link is clicked', fakeAsync(() => {
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

    it('throws error when setting routerLink', () => {
        expect(() => {
            testHostComponent.directive.routerLink = 'foo';
        }).toThrowError();
    });

    const secondaryClickTests: { testName: string, clickArgs: { [key: string]: unknown } }[] = [
        { testName: 'middle mouse click', clickArgs: { button: 1 } },
        { testName: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
    ];
    secondaryClickTests.forEach(test => {
        it(`does not do router navigation for non-primary-mouse link clicks for ${test.testName}`, fakeAsync(() => {
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
});
