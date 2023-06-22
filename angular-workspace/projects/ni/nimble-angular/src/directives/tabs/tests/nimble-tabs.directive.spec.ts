import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NimbleTabsModule } from '../nimble-tabs.module';
import { processUpdates, waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { Tabs } from '../nimble-tabs.directive';
import type { Tab } from '../../tab/nimble-tab.directive';

describe('Nimble tabs', () => {
    @Component({
        template: `
        <nimble-tabs #tabs [(activeid)]="activeTabId">
            <nimble-tab id="1" #tab>Tab One</nimble-tab>
            <nimble-tab id="2" #tab>Tab Two</nimble-tab>
            <nimble-tab id="3" #tab>Tab Three</nimble-tab>
            <nimble-tab-panel>Tab Content One</nimble-tab-panel>
            <nimble-tab-panel>Tab Content Two</nimble-tab-panel>
            <nimble-tab-panel>Tab Content Three</nimble-tab-panel>
        </nimble-tabs>
         `
    })
    class TestHostComponent {
        @ViewChild('tabs', { static: true }) public tabs: ElementRef<Tabs>;
        @ViewChildren('tab') public tabElements: QueryList<ElementRef<Tab>>;

        public readonly initialActiveTabId = '2';
        public activeTabId = this.initialActiveTabId;
    }

    let tabs: Tabs;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTabsModule]
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        tabs = testHostComponent.tabs.nativeElement;
        fixture.detectChanges();
        // wait for tabs's 'tabs' and 'tabpanels' properties to be updated from slotted content
        await waitForUpdatesAsync();
    });

    afterEach(() => {
        processUpdates();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tabs')).not.toBeUndefined();
    });

    it('sets correct initial activeid', () => {
        expect(tabs.activeid).toBe(testHostComponent.initialActiveTabId);
        expect(tabs.activetab.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    });

    it('updates activeid when bound property is changed', fakeAsync(() => {
        const newActiveTabId = '2';
        testHostComponent.activeTabId = newActiveTabId;
        fixture.detectChanges();
        tick();

        expect(tabs.activeid).toBe(newActiveTabId);
        expect(tabs.activetab.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    }));

    it('updates bound property when active tab is changed', () => {
        const tabTwo = testHostComponent.tabElements.toArray()[1];
        tabTwo.nativeElement.click();
        fixture.detectChanges();

        expect(testHostComponent.activeTabId).toBe(tabTwo.nativeElement.id);
    });
});
