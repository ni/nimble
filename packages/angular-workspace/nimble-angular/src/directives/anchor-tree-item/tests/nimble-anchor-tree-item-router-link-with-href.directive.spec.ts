import { Component, ElementRef, Sanitizer, SecurityContext, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingHarness } from '@angular/router/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorTreeItemModule } from '../nimble-anchor-tree-item.module';
import type { AnchorTreeItem } from '../nimble-anchor-tree-item.directive';

describe('Nimble anchor tree item RouterLinkWithHrefDirective', () => {
    @Component({
        template: `
            <nimble-anchor-tree-item #treeItem nimbleRouterLink="page1" [queryParams]="{param1: true}" [state]="{stateProperty: 123}">
                Anchor text
            </nimble-anchor-tree-item>
         `
    })
    class TestHostComponent {
        @ViewChild('treeItem', { static: true }) public treeItem: ElementRef<AnchorTreeItem>;
    }

    @Component({ template: '' })
    class BlankComponent { }

    let anchorTreeItem: AnchorTreeItem;
    let testHostComponent: TestHostComponent;
    let router: Router;
    let location: Location;
    let innerAnchor: HTMLAnchorElement;
    let routerNavigateByUrlSpy: jasmine.Spy;
    let anchorClickHandlerSpy: jasmine.Spy;
    let sanitizer: jasmine.SpyObj<Sanitizer>;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        sanitizer = jasmine.createSpyObj<Sanitizer>('Sanitizer', ['sanitize']);
        sanitizer.sanitize.and.callFake((_, value: string) => value);

        TestBed.configureTestingModule({
            declarations: [TestHostComponent, BlankComponent],
            imports: [
                NimbleAnchorTreeItemModule,
                CommonModule,
            ],
            providers: [
                { provide: Sanitizer, useValue: sanitizer },
                provideRouter([
                    { path: 'page1', component: BlankComponent },
                    { path: '', component: TestHostComponent }
                ]),
            ]
        });
        harness = await RouterTestingHarness.create('');
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        testHostComponent = harness.fixture.debugElement.query(By.directive(TestHostComponent)).componentInstance as TestHostComponent;
        anchorTreeItem = testHostComponent.treeItem.nativeElement;
        processUpdates();
        innerAnchor = anchorTreeItem!.shadowRoot!.querySelector('a')!;
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

    it('does not navigate when link is clicked if disabled', fakeAsync(() => {
        anchorTreeItem.disabled = true;
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
