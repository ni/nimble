import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { waitTask } from '../../../async-test-utilities';
import { NimbleAnchorTabsModule } from '../nimble-anchor-tabs.module';
import { processUpdates } from '../../../testing/async-helpers';
import type { AnchorTabs } from '../nimble-anchor-tabs.directive';
import type { AnchorTab } from '../../anchor-tab/nimble-anchor-tab.directive';

describe('Nimble anchor tabs', () => {
    @Component({
        template: `
        <nimble-anchor-tabs #tabs [(activeid)]="activeTabId">
            <nimble-anchor-tab id="1" #tab>Tab One</nimble-anchor-tab>
            <nimble-anchor-tab id="2" #tab>Tab Two</nimble-anchor-tab>
            <nimble-anchor-tab id="3" #tab>Tab Three</nimble-anchor-tab>
        </nimble-anchor-tabs>
         `
    })
    class TestHostComponent {
        @ViewChild('tabs', { static: true }) public tabs: ElementRef<AnchorTabs>;
        @ViewChildren('tab') public tabElements: QueryList<ElementRef<AnchorTab>>;

        public readonly initialActiveTabId = '2';
        public activeTabId = this.initialActiveTabId;
    }

    let tabs: AnchorTabs;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleAnchorTabsModule]
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        tabs = testHostComponent.tabs.nativeElement;
        fixture.detectChanges();
        // wait for tabs's 'tabs' property to be updated from slotted content
        await waitTask();
    });

    afterEach(() => {
        processUpdates();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-anchor-tabs')).not.toBeUndefined();
    });

    it('sets correct initial activeid', () => {
        expect(tabs.activeid).toBe(testHostComponent.initialActiveTabId);
        expect(tabs.activetab?.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    });

    it('updates activeid when bound property is changed', fakeAsync(() => {
        const newActiveTabId = '2';
        testHostComponent.activeTabId = newActiveTabId;
        fixture.detectChanges();
        tick();

        expect(tabs.activeid).toBe(newActiveTabId);
        expect(tabs.activetab?.getAttribute('id')).toBe(testHostComponent.initialActiveTabId);
    }));

    it('updates bound property when active tab is changed', () => {
        const tabTwo = testHostComponent.tabElements.toArray()[1];
        tabTwo.nativeElement.click();
        fixture.detectChanges();

        expect(testHostComponent.activeTabId).toBe(tabTwo.nativeElement.id);
    });
});
