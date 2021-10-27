import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerState, DrawerLocation, Drawer } from '../nimble-drawer.directive';
import { NimbleDrawerModule } from '..';

describe('Nimble drawer directive', () => {
    @Component({
        template: `
            <nimble-drawer #drawerConfigured [location]="drawerLocation" [(state)]="drawerState" [modal]="isDrawerModal">
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
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;
    let drawerConfigured: Drawer;
    let drawerUnconfigured: Drawer;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleDrawerModule]
        }).compileComponents();
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
    });

    it('when "location" property changes on drawer DOM element, directive state updates correctly', async () => {
        drawerConfigured.state = DrawerState.Closing;
        await waitForDrawerState(drawerConfigured, DrawerState.Closed);
        fixture.detectChanges();

        expect(testHostComponent.drawerState).toEqual(DrawerState.Closed);
    });
});
