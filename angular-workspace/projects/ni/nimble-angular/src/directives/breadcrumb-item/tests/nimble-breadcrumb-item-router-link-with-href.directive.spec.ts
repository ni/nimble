import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleBreadcrumbModule } from '../../breadcrumb/nimble-breadcrumb.module';
import { NimbleBreadcrumbItemModule } from '../nimble-breadcrumb-item.module';
import type { BreadcrumbItem } from '../nimble-breadcrumb-item.directive';

describe('Nimble breadcrumb item RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-breadcrumb>
                <nimble-breadcrumb-item #breadcrumbItem1 nimbleRouterLink="page1" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                    Breadcrumb Text
                </nimble-breadcrumb-item>
            </nimble-breadcrumb>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
        @ViewChild('breadcrumbItem1', { static: true }) public breadcrumbItem1: ElementRef<BreadcrumbItem>;
    }

    @Component({ template: '' })
    class BlankComponent { }

    let breadcrumbItem1: BreadcrumbItem;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let anchor: HTMLAnchorElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [NimbleBreadcrumbModule, NimbleBreadcrumbItemModule,
                CommonModule,
                RouterTestingModule.withRoutes(
                    [
                        { path: '', redirectTo: '/start', pathMatch: 'full' },
                        { path: 'page1', component: BlankComponent },
                        { path: 'start', component: TestHostComponent }
                    ], { useHash: true }
                )
            ]
        });
    });

    beforeEach(fakeAsync(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        breadcrumbItem1 = testHostComponent.breadcrumbItem1.nativeElement;
        fixture.detectChanges();
        tick();
        processUpdates();
        anchor = breadcrumbItem1!.shadowRoot!.querySelector('a')!;
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        anchorClickHandlerSpy = jasmine.createSpy('click');
        anchor!.addEventListener('click', anchorClickHandlerSpy);
    }));

    afterEach(() => {
        processUpdates();
    });

    it('navigates via router.navigateByUrl when link is clicked', fakeAsync(() => {
        anchor!.click();
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

    const secondaryClickTests: { testName: string, clickArgs: { [key: string]: unknown } }[] = [
        { testName: 'middle mouse click', clickArgs: { button: 1 } },
        { testName: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
    ];
    secondaryClickTests.forEach(test => {
        it(`does not do router navigation for non-primary-mouse link clicks for ${test.testName}`, fakeAsync(() => {
            anchor!.dispatchEvent(new MouseEvent('click', {
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
