import { html } from '@microsoft/fast-element';
import {
    keyArrowLeft,
    keyArrowRight,
    keyEnd,
    keyEnter,
    keyHome,
    keySpace,
    keyTab
} from '@microsoft/fast-web-utilities';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { AnchorTabs } from '..';
import '../../anchor-tab';
import type { AnchorTab } from '../../anchor-tab';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { AnchorTabsPageObject } from '../testing/anchor-tabs.pageobject';

describe('AnchorTabs', () => {
    let element: AnchorTabs;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: AnchorTabsPageObject;

    function tab(index: number): AnchorTab {
        return element.children[index] as AnchorTab;
    }

    function anchor(index: number): HTMLAnchorElement {
        return tab(index).shadowRoot!.querySelector('a')!;
    }

    describe('without hrefs', () => {
        async function setup(): Promise<Fixture<AnchorTabs>> {
            return await fixture<AnchorTabs>(
                html`<nimble-anchor-tabs activeid="tab-two">
                    <nimble-anchor-tab></nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-two"></nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-three"></nimble-anchor-tab>
                </nimble-anchor-tabs>`
            );
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            pageObject = new AnchorTabsPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can construct an element instance', () => {
            expect(document.createElement('nimble-anchor-tabs')).toBeInstanceOf(
                AnchorTabs
            );
        });

        it('should set the "tablist" class on the internal div', () => {
            expect(element.tablist.classList.contains('tablist')).toBeTrue();
        });

        it('should set the `part` attribute to "tablist" on the internal div', () => {
            expect(element.tablist.part.contains('tablist')).toBeTrue();
        });

        it('should set the `role` attribute to "tablist" on the internal div', () => {
            expect(element.tablist.getAttribute('role')).toBe('tablist');
        });

        it('should have a slots named "start", "anchortab", and "end", in that order', () => {
            const slots = element.shadowRoot?.querySelectorAll('slot');
            expect(slots![0]?.getAttribute('name')).toBe('start');
            expect(slots![1]?.getAttribute('name')).toBe('anchortab');
            expect(slots![2]?.getAttribute('name')).toBe('end');
        });

        it('should assign tab id when unspecified', () => {
            expect(tab(0).id).toBeDefined();
        });

        it('should set activeid property from attribute value', () => {
            expect(element.activeid).toBe('tab-two');
        });

        it('should populate tabs array with anchor tabs', () => {
            expect(element.tabs.length).toBe(3);
            expect(element.tabs[0]?.nodeName.toLowerCase()).toBe(
                'nimble-anchor-tab'
            );
            expect(element.tabs[1]?.nodeName.toLowerCase()).toBe(
                'nimble-anchor-tab'
            );
            expect(element.tabs[2]?.nodeName.toLowerCase()).toBe(
                'nimble-anchor-tab'
            );
        });

        it('should set activetab property based on activeid', () => {
            expect(element.activetab).toBeDefined();
            expect(element.activetab).toBe(tab(1));
        });

        it('should set aria-current on active tab', () => {
            expect(element.activetab?.ariaCurrent).toBe('page');
        });

        it('should update activetab when activeid is changed', () => {
            element.activeid = 'tab-three';
            expect(element.activetab).toBe(tab(2));
        });

        it('should clear activetab when active tab is removed', async () => {
            tab(1).remove();
            await waitForUpdatesAsync();
            expect(element.activetab).toBeUndefined();
        });

        it('should keep activetab when active tab is disabled', async () => {
            tab(1).disabled = true;
            await waitForUpdatesAsync();
            expect(element.activetab).toBe(tab(1));
        });

        it('should update tabindex values on tab click', async () => {
            expect(tab(0).tabIndex).toBe(-1);
            expect(tab(1).tabIndex).toBe(0);
            expect(tab(2).tabIndex).toBe(-1);
            await pageObject.clickTab(0);
            expect(tab(0).tabIndex).toBe(0);
            expect(tab(1).tabIndex).toBe(-1);
            expect(tab(2).tabIndex).toBe(-1);
        });

        it('should turn tab Space key press into click on inner anchor element', async () => {
            let timesClicked = 0;
            anchor(0).addEventListener('click', () => {
                timesClicked += 1;
            });
            await pageObject.pressKeyOnTab(0, keySpace);
            await waitForUpdatesAsync();
            expect(timesClicked).toBe(1);
        });

        it('should turn tab Enter key press into click on inner anchor element', async () => {
            let timesClicked = 0;
            anchor(0).addEventListener('click', () => {
                timesClicked += 1;
            });
            await pageObject.pressKeyOnTab(0, keyEnter);
            await waitForUpdatesAsync();
            expect(timesClicked).toBe(1);
        });
    });

    describe('with hrefs', () => {
        async function setupWithHrefs(): Promise<Fixture<AnchorTabs>> {
            return await fixture<AnchorTabs>(
                html`<nimble-anchor-tabs activeid="tab-two">
                    <nimble-anchor-tab href="foo"></nimble-anchor-tab>
                    <nimble-anchor-tab
                        href="foo"
                        id="tab-two"
                    ></nimble-anchor-tab>
                    <nimble-anchor-tab
                        href="foo"
                        id="tab-three"
                    ></nimble-anchor-tab>
                </nimble-anchor-tabs>`
            );
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithHrefs());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        const navigationTests = [
            {
                name: 'should focus next tab when right arrow key pressed',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 0,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should focus previous tab when left arrow key pressed',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 1,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 0
            },
            {
                name: 'should wrap to first tab when arrowing right on last tab',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 2,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 0
            },
            {
                name: 'should wrap to last tab when arrowing left on first tab',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 0,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 2
            },
            {
                name: 'should focus first tab when Home key pressed',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 1,
                keyName: keyHome,
                expectedFinalFocusIndex: 0
            },
            {
                name: 'should focus last tab when End key pressed',
                disabledIndex: undefined,
                hiddenIndex: undefined,
                initialFocusIndex: 1,
                keyName: keyEnd,
                expectedFinalFocusIndex: 2
            },
            {
                name: 'should skip disabled tab when arrowing right',
                disabledIndex: 1,
                hiddenIndex: undefined,
                initialFocusIndex: 0,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 2
            },
            {
                name: 'should skip disabled tab when arrowing left',
                disabledIndex: 1,
                hiddenIndex: undefined,
                initialFocusIndex: 2,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 0
            },
            {
                name: 'should skip disabled when arrowing right on last tab',
                disabledIndex: 0,
                hiddenIndex: undefined,
                initialFocusIndex: 2,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should skip disabled when arrowing left on first tab',
                disabledIndex: 2,
                hiddenIndex: undefined,
                initialFocusIndex: 0,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should focus first enabled tab when Home key pressed',
                disabledIndex: 0,
                hiddenIndex: undefined,
                initialFocusIndex: 2,
                keyName: keyHome,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should focus last enabled tab when End key pressed',
                disabledIndex: 2,
                hiddenIndex: undefined,
                initialFocusIndex: 0,
                keyName: keyEnd,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should skip hidden tab when arrowing right',
                disabledIndex: undefined,
                hiddenIndex: 1,
                initialFocusIndex: 0,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 2
            },
            {
                name: 'should skip hidden tab when arrowing left',
                disabledIndex: undefined,
                hiddenIndex: 1,
                initialFocusIndex: 2,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 0
            },
            {
                name: 'should skip hidden when arrowing right on last tab',
                disabledIndex: undefined,
                hiddenIndex: 0,
                initialFocusIndex: 2,
                keyName: keyArrowRight,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should skip hidden when arrowing left on first tab',
                disabledIndex: undefined,
                hiddenIndex: 2,
                initialFocusIndex: 0,
                keyName: keyArrowLeft,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should focus first visible tab when Home key pressed',
                disabledIndex: undefined,
                hiddenIndex: 0,
                initialFocusIndex: 2,
                keyName: keyHome,
                expectedFinalFocusIndex: 1
            },
            {
                name: 'should focus last visible tab when End key pressed',
                disabledIndex: undefined,
                hiddenIndex: 2,
                initialFocusIndex: 0,
                keyName: keyEnd,
                expectedFinalFocusIndex: 1
            }
        ] as const;
        describe('navigation', () => {
            parameterizeSpec(navigationTests, (spec, name, value) => {
                spec(name, async () => {
                    await connect();
                    if (value.disabledIndex !== undefined) {
                        tab(value.disabledIndex).disabled = true;
                        await waitForUpdatesAsync();
                    }
                    if (value.hiddenIndex !== undefined) {
                        tab(value.hiddenIndex).hidden = true;
                        await waitForUpdatesAsync();
                    }
                    tab(value.initialFocusIndex).focus();
                    tab(value.initialFocusIndex).dispatchEvent(
                        new KeyboardEvent('keydown', { key: value.keyName })
                    );
                    await waitForUpdatesAsync();
                    expect(document.activeElement).toBe(
                        tab(value.expectedFinalFocusIndex)
                    );
                    expect(
                        tab(value.expectedFinalFocusIndex).ariaSelected
                    ).toBe('true');
                });
            });
        });

        it('should skip past other tabs when pressing tab key after click', async () => {
            tab(1).focus();
            tab(1).dispatchEvent(new Event('click'));
            await waitForUpdatesAsync();
            document.activeElement!.dispatchEvent(
                new KeyboardEvent('keydown', { key: keyTab })
            );
            await waitForUpdatesAsync();
            expect(document.activeElement).toBe(tab(1));
        });

        it('should skip past other tabs when pressing tab key after arrow key', async () => {
            tab(1).focus();
            await waitForUpdatesAsync();
            document.activeElement!.dispatchEvent(
                new KeyboardEvent('keydown', { key: keyArrowLeft })
            );
            await waitForUpdatesAsync();
            document.activeElement!.dispatchEvent(
                new KeyboardEvent('keydown', { key: keyTab })
            );
            await waitForUpdatesAsync();
            expect(document.activeElement).toBe(tab(0));
        });
    });

    describe('scroll buttons', () => {
        async function setup(): Promise<Fixture<AnchorTabs>> {
            return await fixture<AnchorTabs>(
                html`<nimble-anchor-tabs activeid="tab-two">
                    <nimble-anchor-tab>Tab 1</nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-two">Tab 2</nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-three">Tab 3</nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-four">Tab 4</nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-five">Tab 5</nimble-anchor-tab>
                    <nimble-anchor-tab id="tab-six">Tab 6</nimble-anchor-tab>
                </nimble-anchor-tabs>`
            );
        }

        let tabsPageObject: AnchorTabsPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            tabsPageObject = new AnchorTabsPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should not show scroll buttons when the tabs fit within the container', () => {
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when the tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when the tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.setTabsWidth(1000);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should scroll left when the left scroll button is clicked', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            element.activeid = 'tab-six'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeLessThan(
                currentScrollOffset
            );
        });

        it('should not scroll left when the left scroll button is clicked and the first tab is active', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(0);
        });

        it('should scroll right when the right scroll button is clicked', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeGreaterThan(0);
        });

        it('should not scroll right when the right scroll button is clicked and the last tab is active', async () => {
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            element.activeid = 'tab-six'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(
                currentScrollOffset
            );
        });

        it('should show scroll buttons when new tab is added and tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(450);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab is removed and tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(500);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.removeTab(6);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when tab label is updated and tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(450);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.updateTabLabel(
                0,
                'New Tab With Extremely Long Name'
            );
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab label is updated and tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(550);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.updateTabLabel(6, 'Tab 6');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });
    });
});
