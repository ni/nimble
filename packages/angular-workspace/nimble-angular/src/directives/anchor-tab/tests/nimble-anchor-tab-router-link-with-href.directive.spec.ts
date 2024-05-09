import { Component, ElementRef, Sanitizer, SecurityContext, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorTabModule } from '../nimble-anchor-tab.module';
import type { AnchorTab } from '../nimble-anchor-tab.directive';

describe('Nimble anchor tab RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-anchor-tab #anchorTab nimbleRouterLink="page1" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                Anchor text
            </nimble-anchor-tab>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
        @ViewChild('anchorTab', { static: true }) public anchorTab: ElementRef<AnchorTab>;
    }

    @Component({ template: '' })
    class BlankComponent { }

    let anchorTab: AnchorTab;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let innerAnchor: HTMLAnchorElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;
    let sanitizer: jasmine.SpyObj<Sanitizer>;

    beforeEach(() => {
        sanitizer = jasmine.createSpyObj<Sanitizer>('Sanitizer', ['sanitize']);
        sanitizer.sanitize.and.callFake((_, value: string) => value);

        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [NimbleAnchorTabModule,
                CommonModule,
                RouterTestingModule.withRoutes([
                    { path: '', redirectTo: '/start', pathMatch: 'full' },
                    { path: 'page1', component: BlankComponent },
                    { path: 'start', component: TestHostComponent }
                ], { useHash: true })
            ],
            providers: [
                { provide: Sanitizer, useValue: sanitizer }
            ]
        });
    });

    beforeEach(fakeAsync(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        anchorTab = testHostComponent.anchorTab.nativeElement;
        fixture.detectChanges();
        tick();
        processUpdates();
        innerAnchor = anchorTab!.shadowRoot!.querySelector('a')!;
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

    it('does not navigate when link is clicked if disabled', fakeAsync(() => {
        anchorTab.disabled = true;
        innerAnchor!.click();
        tick();

        expect(routerNavigateByUrlSpy).not.toHaveBeenCalled();
    }));

    const secondaryClickTests = [
        { name: 'middle mouse click', clickArgs: { button: 1 } },
        { name: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
    ] as const;
    parameterizeSpec(secondaryClickTests, (spec, name, value) => {
        spec(`does not do router navigation for non-primary-mouse link clicks for ${name}`, fakeAsync(() => {
            innerAnchor!.dispatchEvent(new MouseEvent('click', {
                ...{
                    bubbles: true,
                    cancelable: true
                },
                ...value.clickArgs
            }));
            tick();

            expect(anchorClickHandlerSpy).toHaveBeenCalledTimes(1);
            expect(routerNavigateByUrlSpy).not.toHaveBeenCalled();
        }));
    });

    it('sanitized initial href created from nimbleRouterLink', () => {
        expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.URL, '/page1?param1=true');
    });
});
