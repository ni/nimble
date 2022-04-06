import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { DrawerState, DrawerLocation, Drawer, NimbleDrawerDirective } from '../nimble-drawer.directive';
import { NimbleDrawerModule } from '../nimble-drawer.module';

describe('Nimble drawer directive', () => {
    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-drawer #drawerConfigured [location]="drawerLocation" [(state)]="drawerState" [modal]="isDrawerModal" [preventDismiss]="drawerPreventDismiss" (cancel)="canceled()">
                    Drawer Content
                </nimble-drawer>
                <nimble-drawer #drawerUnconfigured>
                    Drawer Content
                </nimble-drawer>
             `
        })
        class TestHostComponent {
            @ViewChild('drawerConfigured', { static: true }) public drawerConfigured: ElementRef<Drawer>;
            @ViewChild('drawerUnconfigured', { static: true }) public drawerUnconfigured: ElementRef<Drawer>;
            public drawerLocation = DrawerLocation.Right;
            public drawerState = DrawerState.Opened;
            public isDrawerModal = false;
            public drawerPreventDismiss = false;
            public canceled(): void {}
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;
        let drawerConfigured: Drawer;
        let drawerUnconfigured: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            drawerConfigured = testHostComponent.drawerConfigured.nativeElement;
            drawerUnconfigured = testHostComponent.drawerUnconfigured.nativeElement;
            fixture.detectChanges();
        });

        async function waitForDrawerState(drawer: Drawer, state: DrawerState): Promise<void> {
            return new Promise(resolve => {
                drawer.addEventListener('state-change', function handler() {
                    if (drawer.state === state) {
                        drawer.removeEventListener('state-change', handler);
                        resolve();
                    }
                });
            });
        }

        it('custom element is defined', () => {
            expect(customElements.get('nimble-drawer')).not.toBeUndefined();
        });

        it('the Drawer DOM element has expected default property values when no directive properties are set', () => {
            expect(drawerUnconfigured.location).toBe(DrawerLocation.Left);
            expect(drawerUnconfigured.state).toBe(DrawerState.Closed);
            expect(drawerUnconfigured.modal).toBe(true);
        });

        it('the Drawer DOM element reflects correct initial state set via NimbleDrawerDirective', () => {
            expect(drawerConfigured.location).toBe(DrawerLocation.Right);
            expect(drawerConfigured.state).toBe(DrawerState.Opened);
            expect(drawerConfigured.modal).toBe(false);
        });

        describe('when directive properties change, the drawer DOM element is updated', () => {
            it('for location', () => {
                testHostComponent.drawerLocation = DrawerLocation.Left;
                fixture.detectChanges();

                expect(drawerConfigured.location).toBe(DrawerLocation.Left);
            });

            it('for state', () => {
                testHostComponent.drawerState = DrawerState.Closed;
                fixture.detectChanges();

                expect(drawerConfigured.state).toBe(DrawerState.Closed);
            });

            it('for modal', () => {
                testHostComponent.isDrawerModal = true;
                fixture.detectChanges();

                expect(drawerConfigured.modal).toBe(true);
            });

            it('for preventDismiss', () => {
                testHostComponent.drawerPreventDismiss = true;
                fixture.detectChanges();

                expect(drawerConfigured.preventDismiss).toBe(true);
            });
        });

        it('when "location" property changes on drawer DOM element, directive state updates correctly', async () => {
            drawerConfigured.state = DrawerState.Closing;
            await waitForDrawerState(drawerConfigured, DrawerState.Closed);
            fixture.detectChanges();

            expect(testHostComponent.drawerState).toEqual(DrawerState.Closed);
        });

        it('when drawer overlay is clicked, cancel output/event is triggered', async () => {
            const canceledSpy = spyOn(testHostComponent, 'canceled');
            const drawerOverlay = drawerConfigured.shadowRoot!.querySelector('.overlay')!;
            (drawerOverlay as HTMLElement).click();

            expect(canceledSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
            <nimble-drawer #drawerConfigured [attr.prevent-dismiss]="drawerPreventDismiss">
                Drawer Content
            </nimble-drawer>
            `
        })
        class TestHostComponent {
            @ViewChild('drawerConfigured', { read: NimbleDrawerDirective }) public directive: NimbleDrawerDirective;
            @ViewChild('drawerConfigured', { read: ElementRef }) public elementRef: ElementRef<Drawer>;
            public drawerPreventDismiss: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDrawerDirective;
        let nativeElement: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.drawerPreventDismiss = '';
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });
    });
});