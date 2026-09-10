import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingHarness } from '@angular/router/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorModule } from '../nimble-anchor.module';
import type { Anchor } from '../nimble-anchor.directive';

describe('Nimble anchor RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-anchor #anchor [nimbleRouterLink]="route" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                Anchor text
            </nimble-anchor>
         `,
        standalone: false
    })
    class TestHostComponent {
        @ViewChild('anchor', { static: true }) public anchor: ElementRef<Anchor>;
        public route = 'page1';
    }

    @Component({ template: '', standalone: false })
    class BlankComponent { }

    let anchor: Anchor;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let innerAnchor: HTMLAnchorElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [NimbleAnchorModule,
                CommonModule,
            ],
            providers: [
                provideRouter([
                    { path: 'page1', component: BlankComponent },
                    { path: '', component: TestHostComponent }
                ]),
                provideZoneChangeDetection(),
            ]
        });
        harness = await RouterTestingHarness.create('');
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        testHostComponent = harness.fixture.debugElement.query(By.directive(TestHostComponent)).componentInstance as TestHostComponent;
        anchor = testHostComponent.anchor.nativeElement;
        processUpdates();
        innerAnchor = anchor!.shadowRoot!.querySelector('a')!;
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        anchorClickHandlerSpy = jasmine.createSpy('click').and.callFake((event: Event) => event.preventDefault());
        innerAnchor!.addEventListener('click', anchorClickHandlerSpy);
    });

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

    it('sanitizes href created from nimbleRouterLink', () => {
        testHostComponent.route = '/page1;javascript:alert(1)';
        harness.detectChanges();
        processUpdates();
        expect(innerAnchor.getAttribute('href')).toBe('/page1%3Bjavascript:alert%281%29?param1=true');
    });
});
