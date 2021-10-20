import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { MenuItem } from '@ni/nimble-components/dist/esm/menu-item';
import { NimbleMenuModule } from '../../menu';
import { NimbleMenuItemModule } from '..';

describe('Nimble menu item', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleMenuItemModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-menu-item')).not.toBeUndefined();
    });
});

describe('Nimble menu item directive (using 2-way binding)', () => {
    @Component({
        template: `
            <nimble-menu>
                <nimble-menu-item #item1 [(disabled)]="item1Disabled">
                    Item 1
                </nimble-menu-item>
                <nimble-menu-item #item2 [(disabled)]="item2Disabled">
                    Item 2
                </nimble-menu-item>
            </nimble-menu>
         `
    })
    class TestHostComponent {
        @ViewChild('item1', { static: true }) public item1: ElementRef<MenuItem>;
        @ViewChild('item2', { static: true }) public item2: ElementRef<MenuItem>;
        public item1Disabled = true;
        public item2Disabled = false;
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;
    let item1Element: MenuItem;
    let item2Element: MenuItem;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleMenuModule, NimbleMenuItemModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        item1Element = testHostComponent.item1.nativeElement;
        item2Element = testHostComponent.item2.nativeElement;
        fixture.detectChanges();
    });

    it('the TreeItem DOM element reflects correct initial state set via NimbleMenuItemDirective', () => {
        expect(item1Element.disabled).toBe(true);
        expect(item2Element.disabled).toBe(false);
    });

    describe('when directive properties change, the menu item DOM element is updated', () => {
        it('for disabled', () => {
            testHostComponent.item1Disabled = false;
            testHostComponent.item2Disabled = true;
            fixture.detectChanges();

            expect(item1Element.disabled).toBe(false);
            expect(item2Element.disabled).toBe(true);
        });
    });
});
