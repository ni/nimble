import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorModule } from '../nimble-anchor.module';
import type { Anchor } from '../nimble-anchor.directive';

describe('Nimble anchor RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-anchor #anchor nimbleRouterLink="page1" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                Anchor text
            </nimble-anchor>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
        @ViewChild('anchor', { static: true }) public anchor: ElementRef<Anchor>;
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
            imports: [NimbleAnchorModule,
                CommonModule,
                RouterTestingModule.withRoutes([
                    { path: '', redirectTo: '/start', pathMatch: 'full' },
                    { path: 'page1', component: BlankComponent },
                    { path: 'start', component: TestHostComponent }
                ], { useHash: true })
            ]
        });
    });

    beforeEach(fakeAsync(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        anchor = testHostComponent.anchor.nativeElement;
        fixture.detectChanges();
        tick();
        processUpdates();
        innerAnchor = anchor!.shadowRoot!.querySelector('a')!;
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        anchorClickHandlerSpy = jasmine.createSpy('click');
        innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
    }));

    afterEach(() => {
        processUpdates();
    });

    it('navigates via router.navigateByUrl when link is clicked', fakeAsync(() => {
        innerAnchor!.click();
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
            innerAnchor!.dispatchEvent(new MouseEvent('click', {
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
