import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Tab, Tabs } from '@ni/nimble-components/dist/esm/tabs';
import { waitTask } from '../../../async-test-utilities';
import { NimbleTabsModule } from '../nimble-tabs.module';

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
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tabs')).not.toBeUndefined();
    });

    it('sets correct initial activeid', async () => {
        expect(tabs.activeid).toBe(testHostComponent.initialActiveTabId);
        await waitTask();
        expect(tabs.activetab.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    });

    it('updates activeid when bound property is changed', async () => {
        const newActiveTabId = '2';
        testHostComponent.activeTabId = newActiveTabId;
        fixture.detectChanges();

        expect(tabs.activeid).toBe(newActiveTabId);
        await waitTask();
        expect(tabs.activetab.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    });

    it('updates bound property when active tab is changed', () => {
        const tabTwo = testHostComponent.tabElements.toArray()[1];
        tabTwo.nativeElement.click();
        fixture.detectChanges();

        expect(testHostComponent.activeTabId).toBe(tabTwo.nativeElement.getAttribute('id'));
    });
});
