import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import type { Anchor } from '../../anchor/nimble-anchor.directive';
import { NimbleAnchorButtonModule } from '../../anchor-button/nimble-anchor-button.module';
import { anchorButtonTag } from '../../anchor-button/nimble-anchor-button.directive';
import { NimbleAnchorMenuItemModule } from '../../anchor-menu-item/nimble-anchor-menu-item.module';
import { anchorMenuItemTag } from '../../anchor-menu-item/nimble-anchor-menu-item.directive';
import { NimbleAnchorStepModule } from '../../../../anchor-step/nimble-anchor-step.module';
import { anchorStepTag } from '../../../../anchor-step/nimble-anchor-step.directive';
import { NimbleAnchorTabModule } from '../../anchor-tab/nimble-anchor-tab.module';
import { anchorTabTag } from '../../anchor-tab/nimble-anchor-tab.directive';
import { NimbleAnchorTreeItemModule } from '../../anchor-tree-item/nimble-anchor-tree-item.module';
import { anchorTreeItemTag } from '../../anchor-tree-item/nimble-anchor-tree-item.directive';
import { NimbleAnchorModule } from '../../anchor/nimble-anchor.module';

describe('routerLink', () => {
    class TestHostBase {
        @ViewChild('anchor', { read: ElementRef }) public elementRef: ElementRef<Anchor>;
        public routerLink = '/destination';
        public disabled = false;
        public target: string | undefined;
    }
    let fixture: ComponentFixture<TestHostBase>;
    let nativeElement: Anchor;
    let router: Router;
    let navigateSpy: jasmine.Spy;

    function setup(testHostComponent: typeof TestHostBase, moduleToImport: unknown): void {
        TestBed.configureTestingModule({
            declarations: [testHostComponent],
            imports: [moduleToImport, RouterModule.forRoot([])]
        });
        fixture = TestBed.createComponent(testHostComponent);
        fixture.detectChanges();
        nativeElement = fixture.componentInstance.elementRef.nativeElement;
        router = TestBed.inject(Router);
        navigateSpy = spyOn(router, 'navigateByUrl');
    }

    function clickAndVerifyNavigateByUrlCalled(): void {
        nativeElement.click();

        expect(navigateSpy).toHaveBeenCalledOnceWith(
            router.createUrlTree([fixture.componentInstance.routerLink]),
            { skipLocationChange: false, replaceUrl: false, state: undefined, info: undefined }
        );
    }

    const disableableElementCases = [
        { name: 'AnchorButton', tag: anchorButtonTag, module: NimbleAnchorButtonModule },
        { name: 'AnchorMenuItem', tag: anchorMenuItemTag, module: NimbleAnchorMenuItemModule },
        { name: 'AnchorStep', tag: anchorStepTag, module: NimbleAnchorStepModule },
        { name: 'AnchorTab', tag: anchorTabTag, module: NimbleAnchorTabModule },
        { name: 'AnchorTreeItem', tag: anchorTreeItemTag, module: NimbleAnchorTreeItemModule },
    ] as const;
    parameterizeSuite(disableableElementCases, (suite, name, value) => {
        suite(`on ${name}`, () => {
            const template = `<${value.tag} #anchor [routerLink]="routerLink" [disabled]="disabled"></${value.tag}>`;
            @Component({ template, standalone: false })
            class TestHostComponent extends TestHostBase {}

            beforeEach(() => {
                setup(TestHostComponent, value.module);
            });

            it('invokes the router with the bound url when clicked', () => {
                clickAndVerifyNavigateByUrlCalled();
            });

            it('does not invoke the router when clicked while disabled', () => {
                fixture.componentInstance.disabled = true;
                fixture.detectChanges();

                nativeElement.click();
                expect(navigateSpy).not.toHaveBeenCalled();
            });

            it('invokes the router when clicked after re-enabling', () => {
                fixture.componentInstance.disabled = true;
                fixture.detectChanges();
                fixture.componentInstance.disabled = false;
                fixture.detectChanges();

                clickAndVerifyNavigateByUrlCalled();
            });
        });
    });

    it('is aliased by nimbleRouterLink', () => {
        @Component({ template: '<nimble-anchor #anchor [nimbleRouterLink]="routerLink"></nimble-anchor>', standalone: false })
        class TestHostComponent extends TestHostBase {}
        setup(TestHostComponent, NimbleAnchorModule);

        clickAndVerifyNavigateByUrlCalled();
    });

    describe('with target attribute', () => {
        @Component({
            template: `
                <nimble-anchor-button #anchor
                    [routerLink]="routerLink"
                    [disabled]="disabled"
                    [target]="target"
                ></nimble-anchor-button>`,
            standalone: false
        })
        class TestHostComponent extends TestHostBase {}

        beforeEach(() => {
            setup(TestHostComponent, NimbleAnchorButtonModule);
        });

        it('invokes the router when clicked and target is "_self"', () => {
            fixture.componentInstance.target = '_self';
            fixture.detectChanges();

            clickAndVerifyNavigateByUrlCalled();
        });

        it('does not invoke the router when clicked and target is "_blank"', () => {
            fixture.componentInstance.target = '_blank';
            fixture.detectChanges();

            nativeElement.click();
            expect(navigateSpy).not.toHaveBeenCalled();
        });

        it('does not invoke the router when clicked while disabled and target is "_self"', () => {
            fixture.componentInstance.target = '_self';
            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            nativeElement.click();
            expect(navigateSpy).not.toHaveBeenCalled();
        });

        const testCases = [
            { name: '"_self"', target: '_self' },
            { name: 'undefined', target: undefined },
            { name: '"_blank"', target: '_blank' },
        ] as const;
        parameterizeSpec(testCases, (spec, name, value) => {
            spec(`does not invoke the router when clicked while disabled and target was set to ${name} while disabled`, () => {
                fixture.componentInstance.disabled = true;
                fixture.detectChanges();
                fixture.componentInstance.target = value.target;
                fixture.detectChanges();

                nativeElement.click();
                expect(navigateSpy).not.toHaveBeenCalled();
            });
        });
    });
});
