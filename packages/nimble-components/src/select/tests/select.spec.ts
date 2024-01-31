import { html, repeat } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Select, selectTag } from '..';
import { listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { checkFullyInViewport } from '../../utilities/tests/intersection-observer';
import { FilterMode } from '../types';
import { SelectPageObject } from '../testing/select.pageobject';
import { createEventListener } from '../../utilities/tests/component';

async function setup(
    position?: string,
    open?: boolean
): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
            <nimble-list-option value="three">Three</nimble-list-option>
            <nimble-list-option disabled value="t-disabled"
                >T Disabled</nimble-list-option
            >
            <nimble-list-option value="zürich">Zürich</nimble-list-option>
            <nimble-list-option value="has space">Has Space</nimble-list-option>
        </nimble-select>
    `;
    return fixture<Select>(viewTemplate);
}

async function clickAndWaitForOpen(select: Select): Promise<void> {
    const regionLoadedListener = createEventListener(select, 'loaded');
    select.click();
    await regionLoadedListener.promise;
}

describe('Select', () => {
    it('should set classes based on collapsible, open, disabled, and position', async () => {
        const { element, connect, disconnect } = await setup('above', true);

        element.disabled = true;
        element.position = 'above';
        await connect();
        await waitForUpdatesAsync();

        expect(element.classList.contains('collapsible')).toBeTrue();
        expect(element.classList.contains('above')).toBeTrue();
        expect(element.classList.contains('disabled')).toBeTrue();
        expect(element.classList.contains('open')).toBeTrue();

        await disconnect();
    });

    const ariaTestData: {
        attrName: string,
        propSetter: (x: Select, value: string) => void
    }[] = [
        {
            attrName: 'aria-controls',
            propSetter: (x, v) => {
                x.ariaControls = v;
            }
        },
        {
            attrName: 'aria-disabled',
            propSetter: (x, v) => {
                x.ariaDisabled = v;
            }
        },
        {
            attrName: 'aria-expanded',
            propSetter: (x, v) => {
                x.ariaExpanded = v;
            }
        },
        {
            attrName: 'aria-multiselectable',
            propSetter: (x, v) => {
                x.ariaMultiSelectable = v;
            }
        }
    ];
    ariaTestData.forEach(testData => {
        it(`should set ${testData.attrName} from property`, async () => {
            const { element, connect, disconnect } = await setup('above', true);
            await connect();

            testData.propSetter(element, 'foo');
            await waitForUpdatesAsync();
            expect(element.getAttribute(testData.attrName)).toEqual('foo');

            await disconnect();
        });
    });

    it('should respect value set before connect is completed', async () => {
        const { element, connect, disconnect } = await setup();

        const connectTask = connect();
        element.value = 'two';
        await connectTask;

        expect(element.value).toBe('two');

        await disconnect();
    });

    it('should respect "open" and "position" attributes when both set', async () => {
        const position = 'above';
        const { element, connect, disconnect } = await setup(position, true);

        await connect();
        await waitForUpdatesAsync();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should keep selected value when options change', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.value = 'two';
        await waitForUpdatesAsync();
        expect(element.value).toBe('two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await waitForUpdatesAsync();

        expect(element.value).toBe('two');

        await disconnect();
    });

    it('filter input is not visible with default filterMode', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        await pageObject.clickSelect();
        expect(pageObject.isDropdownVisible()).toBeTrue();
        expect(pageObject.isFilterInputVisible()).toBeFalse();

        await disconnect();
    });

    it('pressing Esc after navigating to new option in dropdown reverts to original selected option', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        await pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        await waitForUpdatesAsync();
        expect(element.selectedIndex).toBe(1);

        pageObject.pressEscapeKey();
        await waitForUpdatesAsync();

        expect(element.value).toBe('one');
        await disconnect();
    });

    describe('with 500 options', () => {
        async function setup500Options(): Promise<Fixture<Select>> {
            // prettier-ignore
            const viewTemplate = html`
                <${selectTag}>
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <nimble-list-option value="${x => x}">${x => x}</nimble-list-option>`)}
                </${selectTag}>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('should limit dropdown height to viewport', async () => {
            const { element, connect, disconnect } = await setup500Options();
            await connect();
            await clickAndWaitForOpen(element);
            const fullyVisible = await checkFullyInViewport(element.listbox);

            expect(element.scrollableElement.scrollHeight).toBeGreaterThan(
                window.innerHeight
            );
            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });

    describe('within a div', () => {
        async function setupInDiv(): Promise<Fixture<Select>> {
            // prettier-ignore
            const viewTemplate = html`
                <div style="overflow: auto;">
                    <${selectTag}>
                        ${repeat(() => [...Array(5).keys()], html<number>`
                            <${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
                    </${selectTag}>
                </div>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('should not confine dropdown to div with "overflow: auto"', async () => {
            const { element, connect, disconnect } = await setupInDiv();
            const select: Select = element.querySelector(selectTag)!;
            await connect();
            await clickAndWaitForOpen(select);
            const fullyVisible = await checkFullyInViewport(select.listbox);

            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });

    it('should export its tag', () => {
        expect(selectTag).toBe('nimble-select');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-select')).toBeInstanceOf(Select);
    });

    describe('title overflow', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        function dispatchEventToSelectedValue(
            event: Event
        ): boolean | undefined {
            return element
                .shadowRoot!.querySelector('.selected-value')!
                .dispatchEvent(event);
        }

        function getSelectedValueTitle(): string {
            return (
                element
                    .shadowRoot!.querySelector('.selected-value')!
                    .getAttribute('title') ?? ''
            );
        }

        function setSelectedValueContent(value: string): void {
            element.options[1]!.textContent = value;
            element.value = 'two';
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.style.width = '200px';
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('sets title when option text is ellipsized', async () => {
            const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            setSelectedValueContent(optionContent);
            await waitForUpdatesAsync();
            dispatchEventToSelectedValue(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getSelectedValueTitle()).toBe(optionContent);
        });

        it('does not set title when option text is fully visible', async () => {
            const optionContent = 'short value';
            setSelectedValueContent(optionContent);
            dispatchEventToSelectedValue(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getSelectedValueTitle()).toBe('');
        });

        it('removes title on mouseout of option', async () => {
            const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            setSelectedValueContent(optionContent);
            dispatchEventToSelectedValue(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            dispatchEventToSelectedValue(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(getSelectedValueTitle()).toBe('');
        });
    });

    describe('filtering', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.style.width = '200px';
            element.filterMode = FilterMode.standard;
            await connect();
            pageObject = new SelectPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('matches any character in option strings', async () => {
            await pageObject.openAndSetFilterText('o'); // Matches 'One' and 'Two'
            const filteredOptions = pageObject
                .getFilteredOptions()
                .map(option => option.text);
            await pageObject.closeDropdown();
            expect(filteredOptions).toContain('One');
            expect(filteredOptions).toContain('Two');
            expect(filteredOptions.length).toBe(2);
        });

        it('matches diacritic characters in option strings', async () => {
            await pageObject.openAndSetFilterText('u'); // Matches 'Zürich'
            const filteredOptions = pageObject
                .getFilteredOptions()
                .map(option => option.text);
            await pageObject.closeDropdown();
            expect(filteredOptions).toContain('Zürich');
            expect(filteredOptions.length).toBe(1);
        });

        it('filtering out current selected item changes selected item but not value', async () => {
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('Two');
            expect(element.value).toBe('one');
        });

        it('filtering out current selected item and then pressing <Esc> does not change value, reverts selected item and closes popup', async () => {
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            pageObject.pressEscapeKey();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');
            expect(element.open).toBeFalse();
        });

        it('opening popup shows correct selected element after cancelling previous selection', async () => {
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            pageObject.pressEscapeKey();

            await pageObject.clickSelect();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.selected).toBeTrue();
        });

        it('opening popup shows correct selected element after filtering and committing but not changing selected option', async () => {
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('One'); // Matches 'One'
            pageObject.pressEnterKey();

            await pageObject.clickSelect();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.selected).toBeTrue();
        });

        it('filtering out current selected item and then pressing <Enter> changes value and closes popup', async () => {
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            pageObject.pressEnterKey();
            expect(element.value).toBe('two'); // 'Two' is first option in list so it should be selected now
            expect(element.open).toBeFalse();
        });

        it('filtering out current selected item and then clicking selected option changes value and closes popup', async () => {
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            pageObject.clickSelectedItem();
            expect(element.value).toBe('two'); // 'Two' is first option in list so it should be selected now
            expect(element.open).toBeFalse();
        });

        it('filtering out current selected item and then clicking non-selected option changes value and closes popup', async () => {
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            pageObject.clickOption(1); // index 1 matches option with 'Three' text
            expect(element.value).toBe('three');
            expect(element.open).toBeFalse();
        });

        it('filtering out current selected item and then losing focus changes value and closes popup', async () => {
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            await pageObject.clickAway();
            expect(element.value).toBe('two'); // 'Two' is first option in list so it should be selected now
            expect(element.open).toBeFalse();
        });

        it('allows <Space> to be used as part of filter text', async () => {
            await pageObject.openAndSetFilterText(' '); // Matches 'Has Space'
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('Has Space');
            expect(element.open).toBeTrue();
        });

        it('opening dropdown after applying filter previously starts with empty filter', async () => {
            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            await pageObject.closeDropdown();
            await pageObject.clickSelect();

            expect(pageObject.getFilterInputText()).toBe('');
            expect(pageObject.getFilteredOptions().length).toBe(6);
        });

        it('entering filter text with no match results in "no items found" element', async () => {
            await pageObject.openAndSetFilterText('abc'); // Matches nothing
            expect(pageObject.isNoResultsLabelVisible()).toBeTrue();
        });

        it('entering filter text with matches does not display "not items found" element', async () => {
            await pageObject.openAndSetFilterText('T');
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('opening dropdown with no filter does not display "not items found" element', async () => {
            await pageObject.clickSelect();
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('clicking disabled option does not cause select to change state', async () => {
            await pageObject.openAndSetFilterText('T');
            const currentFilteredOptions = pageObject.getFilteredOptions();
            pageObject.clickOption(2); // click disabled option

            expect(pageObject.getFilteredOptions()).toEqual(
                currentFilteredOptions
            );
            expect(element.open).toBeTrue();
            expect(pageObject.getSelectedOption()?.text).toBe('Two');
        });

        it('filtering to only disabled item, then pressing <Enter> does not close popup or change value', async () => {
            await pageObject.openAndSetFilterText('Disabled');
            pageObject.pressEnterKey();
            expect(element.open).toBeTrue();
            expect(element.value).toBe('one');
        });

        it('filtering to no available options, then pressing <Enter> does not close popup or change value', async () => {
            await pageObject.openAndSetFilterText('abc');
            pageObject.pressEnterKey();
            expect(element.open).toBeTrue();
            expect(element.value).toBe('one');
        });

        it('after pressing <Esc> to close dropdown, <Enter> will re-open dropdown', async () => {
            await pageObject.clickSelect();
            pageObject.pressEscapeKey();
            pageObject.pressEnterKey();
            expect(element.open).toBeTrue();
        });

        it('filtering to only disabled item, then clicking away does not change value', async () => {
            await pageObject.openAndSetFilterText('Disabled');
            await pageObject.clickAway();
            const currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('one');
        });

        it('filtering to only disabled item does not select item', async () => {
            await pageObject.openAndSetFilterText('Disabled');
            expect(pageObject.getSelectedOption()).toBeNull();
        });
    });
});
