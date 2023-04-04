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
import { AnchorTabs } from '..';
import '../../anchor-tab';
import type { AnchorTab } from '../../anchor-tab';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

async function setup(): Promise<Fixture<AnchorTabs>> {
    return fixture<AnchorTabs>(
        html`<nimble-anchor-tabs activeid="tab-two">
            <nimble-anchor-tab></nimble-anchor-tab>
            <nimble-anchor-tab id="tab-two"></nimble-anchor-tab>
            <nimble-anchor-tab id="tab-three"></nimble-anchor-tab>
        </nimble-anchor-tabs>`
    );
}

describe('AnchorTabs', () => {
    let element: AnchorTabs;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    function tab(index: number): AnchorTab {
        return element.children[index] as AnchorTab;
    }

    function anchor(index: number): HTMLAnchorElement {
        return tab(index).shadowRoot!.querySelector('a')!;
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
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

    // ariaSelected property is not supported on Firefox:
    // see https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaSelected#browser_compatibility
    it('#failsFirefox should set aria-selected on active tab', () => {
        expect(element.activetab?.ariaSelected).toBe('true');
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

    const navigationTests: {
        name: string,
        disabledIndex?: number,
        initialFocusIndex: number,
        keyName: string,
        expectedFinalFocusIndex: number
    }[] = [
        {
            name: 'should focus next tab when right arrow key pressed',
            initialFocusIndex: 0,
            keyName: keyArrowRight,
            expectedFinalFocusIndex: 1
        },
        {
            name: 'should focus previous tab when left arrow key pressed',
            initialFocusIndex: 1,
            keyName: keyArrowLeft,
            expectedFinalFocusIndex: 0
        },
        {
            name: 'should wrap to first tab when arrowing right on last tab',
            initialFocusIndex: 2,
            keyName: keyArrowRight,
            expectedFinalFocusIndex: 0
        },
        {
            name: 'should wrap to last tab when arrowing left on first tab',
            initialFocusIndex: 0,
            keyName: keyArrowLeft,
            expectedFinalFocusIndex: 2
        },
        {
            name: 'should focus first tab when Home key pressed',
            initialFocusIndex: 1,
            keyName: keyHome,
            expectedFinalFocusIndex: 0
        },
        {
            name: 'should focus last tab when End key pressed',
            initialFocusIndex: 1,
            keyName: keyEnd,
            expectedFinalFocusIndex: 2
        },
        {
            name: 'should skip disabled tab when arrowing right',
            disabledIndex: 1,
            initialFocusIndex: 0,
            keyName: keyArrowRight,
            expectedFinalFocusIndex: 2
        },
        {
            name: 'should skip disabled tab when arrowing left',
            disabledIndex: 1,
            initialFocusIndex: 2,
            keyName: keyArrowLeft,
            expectedFinalFocusIndex: 0
        },
        {
            name: 'should skip disabled when arrowing right on last tab',
            disabledIndex: 0,
            initialFocusIndex: 2,
            keyName: keyArrowRight,
            expectedFinalFocusIndex: 1
        },
        {
            name: 'should skip disabled when arrowing left on first tab',
            disabledIndex: 2,
            initialFocusIndex: 0,
            keyName: keyArrowLeft,
            expectedFinalFocusIndex: 1
        },
        {
            name: 'should focus first enabled tab when Home key pressed',
            disabledIndex: 0,
            initialFocusIndex: 2,
            keyName: keyHome,
            expectedFinalFocusIndex: 1
        },
        {
            name: 'should focus last enabled tab when End key pressed',
            disabledIndex: 2,
            initialFocusIndex: 0,
            keyName: keyEnd,
            expectedFinalFocusIndex: 1
        }
    ];
    describe('navigation', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const test of navigationTests) {
            const specType = getSpecTypeByNamedList(test, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(test.name, async () => {
                await connect();
                if (test.disabledIndex !== undefined) {
                    tab(test.disabledIndex).disabled = true;
                    await waitForUpdatesAsync();
                }
                tab(test.initialFocusIndex).focus();
                tab(test.initialFocusIndex).dispatchEvent(
                    new KeyboardEvent('keydown', { key: test.keyName })
                );
                await waitForUpdatesAsync();
                expect(document.activeElement).toBe(
                    tab(test.expectedFinalFocusIndex)
                );
            });
        }
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

    it('should update tabindex values on tab click', async () => {
        expect(tab(0).tabIndex).toBe(-1);
        expect(tab(1).tabIndex).toBe(0);
        expect(tab(2).tabIndex).toBe(-1);
        tab(0).dispatchEvent(new Event('click'));
        await waitForUpdatesAsync();
        expect(tab(0).tabIndex).toBe(0);
        expect(tab(1).tabIndex).toBe(-1);
        expect(tab(2).tabIndex).toBe(-1);
    });

    it('should turn tab Space key press into click on inner anchor element', async () => {
        let timesClicked = 0;
        anchor(0).addEventListener('click', () => {
            timesClicked += 1;
        });
        tab(0).dispatchEvent(new KeyboardEvent('keydown', { key: keySpace }));
        await waitForUpdatesAsync();
        expect(timesClicked).toBe(1);
    });

    it('should turn tab Enter key press into click on inner anchor element', async () => {
        let timesClicked = 0;
        anchor(0).addEventListener('click', () => {
            timesClicked += 1;
        });
        tab(0).dispatchEvent(new KeyboardEvent('keydown', { key: keyEnter }));
        await waitForUpdatesAsync();
        expect(timesClicked).toBe(1);
    });
});
