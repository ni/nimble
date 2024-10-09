import { Component, ElementRef, Sanitizer, SecurityContext, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingHarness } from '@angular/router/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleBreadcrumbModule } from '../../breadcrumb/nimble-breadcrumb.module';
import { NimbleBreadcrumbItemModule } from '../nimble-breadcrumb-item.module';
import type { BreadcrumbItem } from '../nimble-breadcrumb-item.directive';

xdescribe('Nimble breadcrumb item RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-breadcrumb>
                <nimble-breadcrumb-item #breadcrumbItem1 nimbleRouterLink="page1" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                    Breadcrumb Text
                </nimble-breadcrumb-item>
            </nimble-breadcrumb>
         `
    })
    class TestHostComponent {
        @ViewChild('breadcrumbItem1', { static: true }) public breadcrumbItem1: ElementRef<BreadcrumbItem>;
    }

    @Component({ template: '' })
    class BlankComponent { }

    let breadcrumbItem1: BreadcrumbItem;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let anchor: HTMLAnchorElement;
    let separator: HTMLSpanElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;
    let separatorClickHandlerSpy: jasmine.Spy;
    let sanitizer: jasmine.SpyObj<Sanitizer>;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        sanitizer = jasmine.createSpyObj<Sanitizer>('Sanitizer', ['sanitize']);
        sanitizer.sanitize.and.callFake((_, value: string) => value);

        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [
                NimbleBreadcrumbModule,
                NimbleBreadcrumbItemModule,
                CommonModule,
            ],
            providers: [
                { provide: Sanitizer, useValue: sanitizer },
                provideRouter([
                    { path: 'page1', component: BlankComponent },
                    { path: '', component: TestHostComponent }
                ])
            ]
        });
        harness = await RouterTestingHarness.create('');
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        testHostComponent = harness.fixture.debugElement.query(By.directive(TestHostComponent)).componentInstance as TestHostComponent;
        breadcrumbItem1 = testHostComponent.breadcrumbItem1.nativeElement;
        processUpdates();
        anchor = breadcrumbItem1!.shadowRoot!.querySelector('a')!;
        separator = breadcrumbItem1!.shadowRoot!.querySelector('.separator')!;
        routerNavigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();
        anchorClickHandlerSpy = jasmine.createSpy('click').and.callFake((event: Event) => event.preventDefault());
        separatorClickHandlerSpy = jasmine.createSpy('click');
        anchor.addEventListener('click', anchorClickHandlerSpy);
        separator.addEventListener('click', separatorClickHandlerSpy);
    });

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

    it('does not navigate via router.navigateByUrl when separator is clicked', fakeAsync(() => {
        separator!.click();
        tick();

        expect(separatorClickHandlerSpy).toHaveBeenCalledTimes(1);
        expect(routerNavigateByUrlSpy).not.toHaveBeenCalled();
    }));

    const secondaryClickTests = [
        { name: 'middle mouse click', clickArgs: { button: 1 } },
        { name: 'Ctrl + left-click', clickArgs: { button: 0, ctrlKey: true } }
    ] as const;
    parameterizeSpec(secondaryClickTests, (spec, name, value) => {
        spec(`does not do router navigation for non-primary-mouse link clicks for ${name}`, fakeAsync(() => {
            anchor!.dispatchEvent(new MouseEvent('click', {
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
