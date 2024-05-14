import { html, repeat } from '@microsoft/fast-element';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Select, selectTag } from '..';
import { ListOption, listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { checkFullyInViewport } from '../../utilities/tests/intersection-observer';
import { FilterMode } from '../types';
import { SelectPageObject } from '../testing/select.pageobject';
import {
    createEventListener,
    waitAnimationFrame
} from '../../utilities/tests/component';
import { filterSearchLabel } from '../../label-provider/core/label-tokens';
import { ListOptionGroup } from '../../list-option-group';

const disabledOption = 'disabled';
const disabledSelectedOption = 'disabled selected';
const placeholderOption = 'disabled selected hidden';

type OptionInitialState =
    | 'disabled'
    | 'disabled selected'
    | 'disabled selected hidden'
    | 'hidden'
    | 'visually-hidden';

async function setup(
    position?: string,
    open?: boolean,
    firstOptionState?: OptionInitialState,
    secondOptionState?: OptionInitialState
): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-list-option
                value="one"
                ${firstOptionState !== undefined ? firstOptionState : ''}
                >One</nimble-list-option
            >
            <nimble-list-option
                value="two"
                ${secondOptionState !== undefined ? secondOptionState : ''}
                >Two</nimble-list-option
            >
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

async function setupWithGroups(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select>
            <nimble-list-option-group label="Group One">
                <nimble-list-option value="one">One</nimble-list-option>
                <nimble-list-option value="two">Two</nimble-list-option>
            </nimble-list-option-group>
            <nimble-list-option-group label="Group Two">
                <nimble-list-option value="three">Three</nimble-list-option>
                <nimble-list-option value="four">Four</nimble-list-option>
            </nimble-list-option-group>
            <nimble-list-option-group
                label="Gróup Three with diacritic and a really long label"
            >
                <nimble-list-option value="five">Five</nimble-list-option>
                <nimble-list-option value="six">Six</nimble-list-option>
            </nimble-list-option-group>
        </nimble-select>
    `;
    return fixture<Select>(viewTemplate);
}

async function clickAndWaitForOpen(select: Select): Promise<void> {
    const regionLoadedListener = createEventListener(select, 'loaded');
    select.click();
    await regionLoadedListener.promise;
}

const isListOptionGroup = (el: Element): el is ListOptionGroup => {
    return el instanceof ListOptionGroup;
};

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
        await clickAndWaitForOpen(element);
        expect(pageObject.isDropdownVisible()).toBeTrue();
        expect(pageObject.isFilterInputVisible()).toBeFalse();

        await disconnect();
    });

    it('pressing Esc after navigating to new option in dropdown maintains original selected option', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        await waitForUpdatesAsync();
        expect(element.selectedIndex).toBe(1);

        pageObject.pressEscapeKey();
        await waitForUpdatesAsync();

        expect(element.value).toBe('one');
        await disconnect();
    });

    it('navigating between options in dropdown does not update display value', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        await waitForUpdatesAsync();

        expect(element.displayValue).toBe('One');
        await disconnect();
    });

    it('pressing <Space> will select a new value and close dropdown', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        await pageObject.pressSpaceKey();
        expect(element.value).toBe('two');
        expect(element.open).toBeFalse();

        await disconnect();
    });

    describe('Default selected option', () => {
        it('disabled option that is marked as selected initially will be used as value', async () => {
            // mark second option as selected to be different than default
            const { element, connect, disconnect } = await setup(
                undefined,
                false,
                undefined,
                disabledSelectedOption
            );
            await connect();
            await waitForUpdatesAsync();
            expect(element.value).toBe('two');

            await disconnect();
        });

        const defaultOptionTestCases: {
            name: string,
            value: OptionInitialState
        }[] = [
            {
                name: 'first option disabled, second is default',
                value: 'disabled'
            },
            {
                name: 'first option hidden, second is default',
                value: 'hidden'
            },
            {
                name: 'first option visually-hidden, second is default',
                value: 'visually-hidden'
            }
        ];
        parameterizeSpec(defaultOptionTestCases, (spec, name, value) => {
            spec(name, async () => {
                const { element, connect, disconnect } = await setup(
                    undefined,
                    false,
                    value.value,
                    undefined
                );
                await connect();
                await waitForUpdatesAsync();
                expect(element.value).toBe('two');

                await disconnect();
            });
        });
    });

    it('can set value to a disabled option', async () => {
        const { element, connect, disconnect } = await setup(
            undefined,
            false,
            undefined,
            disabledOption
        );
        await connect();
        await waitForUpdatesAsync();
        element.value = 'two';
        expect(element.value).toEqual('two');
        expect(element.selectedIndex).toEqual(1);

        await disconnect();
    });

    it('updating hidden attribute sets/removes visually-hidden attribute', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();
        const option = element.options[0]! as ListOption;
        option.hidden = true;
        expect(option.visuallyHidden).toBeTrue();

        option.hidden = false;
        expect(option.visuallyHidden).toBeFalse();

        await disconnect();
    });

    it('can not select a disabled option via the arrow keys', async () => {
        const { element, connect, disconnect } = await setup(
            undefined,
            false,
            undefined,
            disabledOption
        );
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        await clickAndWaitForOpen(element);
        pageObject.pressArrowDownKey();
        expect(pageObject.getSelectedOption()?.value).toBe('three');

        pageObject.pressArrowUpKey();
        expect(pageObject.getSelectedOption()?.value).toBe('one');

        await disconnect();
    });

    it('changing textContent of selected option updates display of select', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        const selectedOption = pageObject.getSelectedOption();
        selectedOption!.textContent = 'foo';
        await waitForUpdatesAsync();
        expect(element.displayValue).toBe('foo');

        await disconnect();
    });

    it('option added directly to DOM synchronously registers with Select', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();
        const newOption = new ListOption('foo', 'foo');
        const registerOptionSpy = spyOn(
            element,
            'registerOption'
        ).and.callThrough();
        registerOptionSpy.calls.reset();
        element.insertBefore(newOption, element.options[0]!);

        expect(registerOptionSpy.calls.count()).toBe(1);
        expect(element.options).toContain(newOption);

        // While the option is registered synchronously as shown above,
        // properties like selectedIndex will only be correct asynchronously
        // See https://github.com/ni/nimble/issues/1915
        expect(element.selectedIndex).toBe(0);
        await waitForUpdatesAsync();
        expect(element.value).toBe('one');
        // This assertion shows that after 'slottedOptionsChanged' runs, the
        // 'selectedIndex' state has been corrected to expected DOM order.
        expect(element.selectedIndex).toBe(1);
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

            expect(element.scrollableRegion.scrollHeight).toBeGreaterThan(
                window.innerHeight
            );
            expect(fullyVisible).toBe(true);

            await disconnect();
        });

        it('should scroll the selected option into view when opened', async () => {
            const { element, connect, disconnect } = await setup500Options();
            element.value = '300';
            await connect();
            element.focus();
            await clickAndWaitForOpen(element);
            await waitForUpdatesAsync();
            await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame

            expect(element.scrollableRegion.scrollTop).toBeGreaterThan(8000);

            element.value = '0';
            await waitForUpdatesAsync();
            await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame

            expect(element.scrollableRegion.scrollTop).toBeCloseTo(4);

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

    describe('opening and closing dropdown', () => {
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

        const filterModeTestData = [
            {
                filter: FilterMode.none,
                name: 'none'
            },
            {
                filter: FilterMode.standard,
                name: 'standard'
            }
        ] as const;
        parameterizeSuite(filterModeTestData, (suite, name, value) => {
            suite(`with filterMode = ${name}`, () => {
                beforeEach(() => {
                    element.filterMode = value.filter;
                });

                it('pressing <Enter> opens dropdown', () => {
                    pageObject.pressEnterKey();
                    expect(element.open).toBeTrue();
                });

                it('pressing <Space> opens dropdown', async () => {
                    await pageObject.pressSpaceKey();
                    expect(element.open).toBeTrue();
                });

                it('after pressing <Esc> to close dropdown, <Enter> will re-open dropdown', () => {
                    pageObject.clickSelect();
                    pageObject.pressEscapeKey();
                    expect(element.open).toBeFalse();
                    pageObject.pressEnterKey();
                    expect(element.open).toBeTrue();
                });

                it('after closing dropdown by pressing <Esc>, activeElement is Select element', () => {
                    pageObject.clickSelect();
                    pageObject.pressEscapeKey();
                    expect(document.activeElement).toBe(element);
                });

                it('after closing dropdown by committing a value with <Enter>, activeElement is Select element', () => {
                    pageObject.clickSelect();
                    pageObject.pressArrowDownKey();
                    pageObject.pressEnterKey();
                    expect(document.activeElement).toBe(element);
                });
            });
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
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('Two');
            pageObject.pressEscapeKey();

            pageObject.clickSelect();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
        });

        it('opening popup shows correct selected element after filtering and committing but not changing selected option', async () => {
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.text).toBe('One');
            expect(element.value).toBe('one');

            await pageObject.openAndSetFilterText('One'); // Matches 'One'
            pageObject.pressEnterKey();

            pageObject.clickSelect();
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
            pageObject.clickOption(2); // index 2 matches option with 'Three' text
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

        it('pressing <Space> after dropdown is open will enter " " as filter text and keep dropdown open', async () => {
            pageObject.clickSelect();
            await pageObject.pressSpaceKey();
            expect(element.open).toBeTrue();
            expect(pageObject.getFilterInputText()).toBe(' ');
        });

        it('opening dropdown after applying filter previously starts with empty filter', async () => {
            await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
            await pageObject.closeDropdown();
            pageObject.clickSelect();

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
            await clickAndWaitForOpen(element);
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('clicking disabled option does not cause select to change state', async () => {
            await pageObject.openAndSetFilterText('T');
            const currentFilteredOptions = pageObject.getFilteredOptions();
            pageObject.clickOption(3); // click disabled option

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

        it('updating slottedOptions while open applies filter to new options', async () => {
            const newOptions = [
                new ListOption('Ten', 'ten'),
                new ListOption('Twenty', 'twenty')
            ];
            await pageObject.openAndSetFilterText('tw');
            expect(pageObject.getFilteredOptions()[0]?.value).toBe('two');
            await pageObject.setOptions(newOptions);
            expect(pageObject.getFilteredOptions()[0]?.value).toBe('twenty');
        });

        it('clicking in filter input after dropdown is open, does not close dropdown', async () => {
            await clickAndWaitForOpen(element);
            await pageObject.clickFilterInput();
            expect(element.open).toBeTrue();
        });

        it('filter input placeholder gets text from design token', async () => {
            filterSearchLabel.setValueFor(element, 'foo');
            await waitForUpdatesAsync();
            const filterInput = element.shadowRoot?.querySelector('.filter-input');
            expect(filterInput?.getAttribute('placeholder')).toBe('foo');
        });

        it('filter input "aria-controls" and "aria-activedescendant" attributes are set to element state', async () => {
            await clickAndWaitForOpen(element);
            const filterInput = element.shadowRoot?.querySelector('.filter-input');
            expect(filterInput?.getAttribute('aria-controls')).toBe(
                element.ariaControls
            );
            expect(filterInput?.getAttribute('aria-activedescendant')).toBe(
                element.ariaActiveDescendant
            );
        });

        it('pressing arrow keys selects next visible item when option between current and next is filtered out', async () => {
            const newOptions = element.options.map(o => o as ListOption);
            newOptions.push(new ListOption('Twenty', 'twenty'));
            await pageObject.setOptions(newOptions);
            await pageObject.openAndSetFilterText('tw');
            pageObject.pressArrowDownKey();
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('twenty');

            pageObject.pressArrowUpKey();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('two');
        });

        it('can not select option that has been filtered out pressing arrowUp', async () => {
            await pageObject.openAndSetFilterText('tw');
            pageObject.pressArrowUpKey();
            pageObject.pressEnterKey();
            await waitForUpdatesAsync();
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('two');

            // make sure we can select other options after clearing filter
            pageObject.clickSelect();
            pageObject.pressArrowUpKey();
            pageObject.pressEnterKey();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('one');
        });

        it('cant not select option that has been filtered out pressing arrowDown', async () => {
            await pageObject.openAndSetFilterText('tw');
            pageObject.pressArrowDownKey();
            pageObject.pressEnterKey();
            let currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('two');

            // make sure we can select other options after clearing filter
            pageObject.clickSelect();
            pageObject.pressArrowDownKey();
            pageObject.pressEnterKey();
            currentSelection = pageObject.getSelectedOption();
            expect(currentSelection?.value).toBe('three');
        });
    });

    describe('placeholder', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup(
                undefined,
                false,
                placeholderOption
            ));
            element.style.width = '200px';
            element.filterMode = FilterMode.standard;
            await connect();
            pageObject = new SelectPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('placeholder option is not present in dropdown', async () => {
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeFalse();
        });

        it('selecting option will replace placeholder text with selected option text', async () => {
            expect(element.displayValue).toBe('One');
            await clickAndWaitForOpen(element);
            pageObject.clickOption(1);
            await waitForUpdatesAsync();

            expect(element.displayValue).toBe('Two');
        });

        it('placeholder can be changed to another option programmatically', async () => {
            await waitForUpdatesAsync();
            element.options[0]!.hidden = false;
            element.options[1]!.hidden = true;
            element.options[1]!.disabled = true;
            element.options[1]!.selected = true;
            await waitForUpdatesAsync();

            expect(element.displayValue).toBe('Two');
            expect(element.value).toBe('two');
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeTrue();
            expect(pageObject.isOptionVisible(1)).toBeFalse();
        });
    });

    describe('groups', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;
        const totalSlottedElements = 9;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithGroups());
            element.style.width = '200px';
            await connect();
            pageObject = new SelectPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can select an option within a group', async () => {
            await clickAndWaitForOpen(element);
            pageObject.clickOption(1);
            expect(element.value).toBe('two');
            expect(element.selectedIndex).toBe(1);
        });

        it('clicking a group does not close the dropdown', async () => {
            await clickAndWaitForOpen(element);
            const group = element.querySelector('[role="group"]');
            group?.dispatchEvent(new MouseEvent('click'));
            expect(element.open).toBeTrue();
        });

        describe('filtering', () => {
            beforeEach(async () => {
                element.filterMode = FilterMode.standard;
                await waitForUpdatesAsync();
            });

            it('filter match on group label shows all options in matched group, as well as options in other groups that match filter', async () => {
                await pageObject.openAndSetFilterText('Two');
                const visibleElements = Array.from(
                    element.querySelectorAll(':not([visually-hidden])') ?? []
                );
                expect(visibleElements?.length).toBe(5);
                expect(isListOptionGroup(visibleElements[0]!)).toBeTrue();
                expect(
                    (visibleElements[0] as ListOptionGroup).labelContent
                ).toBe('Group One');
                expect(visibleElements[1]!.textContent?.trim()).toBe('Two');
                expect(isListOptionGroup(visibleElements[2]!)).toBeTrue();
                expect(
                    (visibleElements[2] as ListOptionGroup).labelContent
                ).toBe('Group Two');
                expect(visibleElements[3]!.textContent?.trim()).toBe('Three');
                expect(visibleElements[4]!.textContent?.trim()).toBe('Four');

                await disconnect();
            });

            it('clearing filter shows all options and groups', async () => {
                await pageObject.openAndSetFilterText('Two');
                pageObject.clearFilter();
                await waitForUpdatesAsync();
                const visibleElements = Array.from(
                    element.querySelectorAll(':not([visually-hidden])') ?? []
                );
                expect(visibleElements?.length).toBe(totalSlottedElements);
            });

            it('filter matches diacritic characters in group label', async () => {
                await pageObject.openAndSetFilterText('ó');
                const visibleElements = Array.from(
                    element.querySelectorAll(':not([visually-hidden])') ?? []
                );
                expect(visibleElements?.length).toBe(totalSlottedElements); // 'o' is matched in all group labels
            });
        });
    });

    describe('PageObject', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup(
                undefined,
                false,
                placeholderOption
            ));
            element.style.width = '200px';
            element.filterMode = FilterMode.standard;
            await connect();
            pageObject = new SelectPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('exercise clickOptionWithDisplayText', () => {
            pageObject.clickSelect();
            pageObject.clickOptionWithDisplayText('Two');
            expect(element.value).toBe('two');
            expect(element.selectedIndex).toBe(1);
        });
    });
});
