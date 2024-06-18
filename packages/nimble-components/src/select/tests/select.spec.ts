import { html, repeat } from '@microsoft/fast-element';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Select, selectTag } from '..';
import { SelectPageObjectInternal as SelectPageObject } from './select.pageobject.internal';
import { ListOption, listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { checkFullyInViewport } from '../../utilities/tests/intersection-observer';
import { FilterMode, SelectFilterInputEventDetail } from '../types';
import {
    createEventListener,
    waitAnimationFrame
} from '../../utilities/tests/component';
import { filterSearchLabel } from '../../label-provider/core/label-tokens';
import { ListOptionGroup } from '../../list-option-group';
import type { Button } from '../../button';
import { isListOptionGroup } from '../template';

const disabledOption = 'disabled';
const disabledSelectedOption = 'disabled selected';
const placeholderSelectedOption = 'disabled selected hidden';

type OptionInitialState =
    | 'selected'
    | 'disabled'
    | 'disabled selected'
    | 'disabled hidden'
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
                <nimble-list-option value="edge">Edge</nimble-list-option>
            </nimble-list-option-group>
            <nimble-list-option-group label="Group Two">
                <nimble-list-option value="three">Three</nimble-list-option>
                <nimble-list-option value="four">Four</nimble-list-option>
            </nimble-list-option-group>
            <nimble-list-option-group label="Gróup Three">
                <nimble-list-option value="five">Five</nimble-list-option>
                <nimble-list-option value="six">Six</nimble-list-option>
                <nimble-list-option value="edge">Edge</nimble-list-option>
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

        element.insertBefore(
            new ListOption('zero', 'zero'),
            element.options[0]!
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

    it('pressing <Esc> after navigating to new option in dropdown maintains original selected option', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        await waitForUpdatesAsync();
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

        expect(pageObject.getDisplayText()).toBe('One');
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

    it('option that is not hidden but is visuallyHidden, if removed and then added back, will be visible', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const option = element.options[0]! as ListOption;
        option.visuallyHidden = true;
        element.removeChild(option);
        await waitForUpdatesAsync();
        element.appendChild(option);
        await waitForUpdatesAsync();

        expect(option.visuallyHidden).toBeFalse();

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

        const defaultOptionTestCases = [
            {
                name: 'first option selected, first is default',
                option1State: 'selected',
                option2State: undefined,
                expected: 'one'
            },
            {
                name: 'first option disabled, second is default',
                option1State: 'disabled',
                option2State: undefined,
                expected: 'two'
            },
            {
                name: 'first option hidden, second is default',
                option1State: 'hidden',
                option2State: undefined,
                expected: 'two'
            },
            {
                name: 'first option visually-hidden, second is default',
                option1State: 'visually-hidden',
                option2State: undefined,
                expected: 'two'
            },
            {
                name: 'first option hidden and disabled, first is default as placeholder',
                option1State: 'disabled hidden',
                option2State: undefined,
                expected: 'one'
            },
            {
                name: 'first option disabled, second is disabled hidden, second is default as placeholder',
                option1State: 'disabled',
                option2State: 'disabled hidden',
                expected: 'two'
            },
            {
                name: 'first option disabled, second is disabled, third is default',
                option1State: 'disabled',
                option2State: 'disabled',
                expected: 'three'
            },
            {
                name: 'second option selected, second is default',
                option1State: undefined,
                option2State: 'selected',
                expected: 'two'
            }
        ] as const;
        parameterizeSpec(defaultOptionTestCases, (spec, name, value) => {
            spec(name, async () => {
                const { element, connect, disconnect } = await setup(
                    undefined,
                    false,
                    value.option1State,
                    value.option2State
                );
                await connect();
                await waitForUpdatesAsync();
                expect(element.value).toBe(value.expected);

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
        expect(pageObject.getActiveOption()?.value).toBe('three');

        pageObject.pressArrowUpKey();
        expect(pageObject.getActiveOption()?.value).toBe('one');

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
        expect(pageObject.getDisplayText()).toBe('foo');

        await disconnect();
    });

    it('after forcing Select to be blank, user can arrow down to first available option in dropdown', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        element.selectedIndex = -1;
        await waitForUpdatesAsync();

        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        expect(pageObject.getActiveOption()?.value).toBe('one');

        await disconnect();
    });

    it('after forcing Select to be blank, pressing arrow down sets value to first available option', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        element.selectedIndex = -1;
        await waitForUpdatesAsync();

        pageObject.pressArrowDownKey();
        expect(pageObject.getSelectedOption()?.value).toBe('one');

        await disconnect();
    });

    it('selecting option via typing character while dropdown is closed changes value', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        pageObject.pressCharacterKey('t');
        await waitForUpdatesAsync();

        expect(element.value).toBe('two');

        await disconnect();
    });

    it('selecting option via typing character while dropdown is open with no filter does not change value', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        pageObject.clickSelect();
        pageObject.pressCharacterKey('t');
        await waitForUpdatesAsync();

        expect(element.value).toBe('one');
        expect(pageObject.getActiveOption()?.value).toBe('two');

        await disconnect();
    });

    it('while navigating dropdown, ariaActiveDescendant is set to active option', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        await waitForUpdatesAsync();
        pageObject.clickSelect();
        pageObject.pressArrowDownKey();
        expect(element.ariaActiveDescendant).toBe(
            pageObject.getActiveOption()!.id
        );

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

    it('programmatically setting selected of current selected option to false results in blank display', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const pageObject = new SelectPageObject(element);
        const selectedOption = pageObject.getSelectedOption();
        selectedOption!.selected = false;
        await waitForUpdatesAsync();

        expect(pageObject.getDisplayText()).toBe('');

        await disconnect();
    });

    it('navigating to different option in dropdown and then clicking away does not change value', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();
        const pageObject = new SelectPageObject(element);
        await clickAndWaitForOpen(element);

        pageObject.pressArrowDownKey();
        await pageObject.clickAway();

        expect(element.value).toBe('one');

        await disconnect();
    });

    it('navigating to different option in dropdown and then clicking select (not dropdown) does not change value or emit change event', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();
        const changeEvent = jasmine.createSpy();
        element.addEventListener('change', changeEvent);
        const pageObject = new SelectPageObject(element);
        await clickAndWaitForOpen(element);

        pageObject.pressArrowDownKey();
        pageObject.clickSelect();

        expect(element.value).toBe('one');
        expect(changeEvent.calls.count()).toBe(0);

        await disconnect();
    });

    it('setting loadingVisible to true shows loading visual', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();
        element.loadingVisible = true;
        await waitForUpdatesAsync();

        expect(pageObject.isLoadingVisualVisible()).toBeTrue();

        await disconnect();
    });

    describe('with all options disabled', () => {
        async function setupAllDisabled(): Promise<Fixture<Select>> {
            const viewTemplate = html`
                <nimble-select>
                    <nimble-list-option disabled value="one"
                        >One</nimble-list-option
                    >
                    <nimble-list-option disabled value="two"
                        >Two</nimble-list-option
                    >
                    <nimble-list-option disabled value="three"
                        >Three</nimble-list-option
                    >
                </nimble-select>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('when all options disabled, first option is selected', async () => {
            const { element, connect, disconnect } = await setupAllDisabled();
            await connect();
            await waitForUpdatesAsync();

            expect(element.value).toBe('one');

            await disconnect();
        });
    });

    describe('with all options hidden', () => {
        async function setupAllHidden(): Promise<Fixture<Select>> {
            const viewTemplate = html`
                <nimble-select>
                    <nimble-list-option hidden value="one"
                        >One</nimble-list-option
                    >
                    <nimble-list-option hidden value="two"
                        >Two</nimble-list-option
                    >
                    <nimble-list-option hidden value="three"
                        >Three</nimble-list-option
                    >
                </nimble-select>
            `;
            return fixture<Select>(viewTemplate);
        }

        it('when all options hidden, first option is selected', async () => {
            const { element, connect, disconnect } = await setupAllHidden();
            await connect();
            await waitForUpdatesAsync();

            expect(element.value).toBe('one');

            await disconnect();
        });
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

                it('after closing dropdown by committing a value with <Tab>, activeElement is not Select element', () => {
                    pageObject.clickSelect();
                    pageObject.pressArrowDownKey();
                    pageObject.pressTabKey();
                    expect(document.activeElement).not.toBe(element);
                });
            });
        });
    });

    describe('filtering', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;

        describe('with filterMode = standard', () => {
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
                currentSelection = pageObject.getActiveOption();
                expect(currentSelection?.text).toBe('Two');
                pageObject.pressEscapeKey();

                pageObject.clickSelect();
                currentSelection = pageObject.getActiveOption();
                expect(currentSelection?.text).toBe('One');
            });

            it('opening popup shows correct selected element after filtering and committing but not changing selected option', async () => {
                let currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.text).toBe('One');
                expect(element.value).toBe('one');

                await pageObject.openAndSetFilterText('One'); // Matches 'One'
                pageObject.pressEnterKey();

                pageObject.clickSelect();
                currentSelection = pageObject.getActiveOption();
                expect(currentSelection?.selected).toBeTrue();
            });

            it('filtering out current selected item and then pressing <Enter> changes value, emits change event, and closes popup', async () => {
                const currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.text).toBe('One');
                expect(element.value).toBe('one');

                const changeEvent = jasmine.createSpy();
                element.addEventListener('change', changeEvent);
                await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
                pageObject.pressEnterKey();
                await waitForUpdatesAsync();
                expect(element.value).toBe('two'); // 'Two' is first option in list so it should be selected now
                expect(pageObject.getDisplayText()).toBe('Two');
                expect(changeEvent.calls.count()).toBe(1);
                expect(element.open).toBeFalse();
            });

            it('filtering out current selected item and then pressing <Tab> does not change value and closes popup', async () => {
                const currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.text).toBe('One');
                expect(element.value).toBe('one');

                await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
                pageObject.pressTabKey();
                expect(element.value).toBe('one');
                expect(element.open).toBeFalse();
            });

            it('filtering out current selected item and then clicking active option changes value, emits change event, and closes popup', async () => {
                const currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.text).toBe('One');
                expect(element.value).toBe('one');

                const changeEvent = jasmine.createSpy();
                element.addEventListener('change', changeEvent);
                await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
                pageObject.clickActiveItem();
                await waitForUpdatesAsync();
                expect(element.value).toBe('two'); // 'Two' is first option in list so it should be selected now
                expect(pageObject.getDisplayText()).toBe('Two');
                expect(changeEvent.calls.count()).toBe(1);
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

            it('filtering out current selected item and then losing focus does not change value and closes popup', async () => {
                const currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.text).toBe('One');
                expect(element.value).toBe('one');

                await pageObject.openAndSetFilterText('T'); // Matches 'Two' and 'Three'
                await pageObject.clickAway();
                expect(element.value).toBe('one'); // 'Two' is first option in list so it should be selected now
                expect(element.open).toBeFalse();
            });

            it('allows <Space> to be used as part of filter text', async () => {
                await pageObject.openAndSetFilterText(' '); // Matches 'Has Space'
                const currentSelection = pageObject.getActiveOption();
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
                expect(pageObject.getActiveOption()?.text).toBe('Two');
            });

            it('filtering to only disabled item, then pressing <Enter> does not close popup or change value', async () => {
                await pageObject.openAndSetFilterText('Disabled');
                pageObject.pressEnterKey();
                expect(element.open).toBeTrue();
                expect(element.value).toBe('one');
            });

            it('filtering to only disabled item, then pressing <Esc> closes popup and does not change value or selectedIndex', async () => {
                await pageObject.openAndSetFilterText('Disabled');
                pageObject.pressEscapeKey();
                expect(element.open).toBeFalse();
                expect(element.value).toBe('one');
                expect(element.selectedIndex).toBe(0);
            });

            it('filtering to only disabled item, then pressing <Tab> closes popup and does not change value or selectedIndex', async () => {
                await pageObject.openAndSetFilterText('Disabled');
                pageObject.pressTabKey();
                expect(element.open).toBeFalse();
                expect(element.value).toBe('one');
                expect(element.selectedIndex).toBe(0);
            });

            it('filtering to no available options, then pressing <Enter> does not close popup or change value', async () => {
                await pageObject.openAndSetFilterText('abc');
                pageObject.pressEnterKey();
                expect(element.open).toBeTrue();
                expect(element.value).toBe('one');
            });

            // Fails on Webkit. Tracked by https://github.com/ni/nimble/issues/2170
            it('filtering to no available options sets ariaActiveDescendent to empty string #SkipWebkit', async () => {
                await pageObject.openAndSetFilterText('abc');
                expect(element.ariaActiveDescendant).toBe('');
            });

            it('filtering to only disabled item, then clicking away does not change value', async () => {
                await pageObject.openAndSetFilterText('Disabled');
                await pageObject.clickAway();
                const currentSelection = pageObject.getSelectedOption();
                expect(currentSelection?.value).toBe('one');
            });

            it('filtering to only disabled item does not select item', async () => {
                await pageObject.openAndSetFilterText('Disabled');
                expect(pageObject.getActiveOption()).toBeNull();
            });

            it('updating slottedOptions while open applies filter to new options', async () => {
                const newOptions = [
                    new ListOption('Ten', 'ten'),
                    new ListOption('Twenty', 'twenty')
                ];
                await pageObject.openAndSetFilterText('tw');
                expect(pageObject.getFilteredOptions()[0]?.value).toBe('two');
                await pageObject.setOptions(newOptions);
                expect(pageObject.getFilteredOptions()[0]?.value).toBe(
                    'twenty'
                );
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
                let currentSelection = pageObject.getActiveOption();
                expect(currentSelection?.value).toBe('twenty');

                pageObject.pressArrowUpKey();
                currentSelection = pageObject.getActiveOption();
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

            it('can not select option that has been filtered out pressing arrowDown', async () => {
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

            it('after hiding all elements, dropdown shows no results label', async () => {
                element.options.forEach(o => {
                    o.hidden = true;
                });
                await waitForUpdatesAsync();
                expect(pageObject.isNoResultsLabelVisible()).toBeTrue();
            });

            it('when dropdown is closed, entering text executes typeahead and sets value', () => {
                pageObject.pressCharacterKey('t');
                expect(element.value).toBe('two');
            });

            it('opening dropdown after pressing <Esc> during filter text entry, maintains original display text', async () => {
                await clickAndWaitForOpen(element);
                pageObject.pressCharacterKey('t');
                pageObject.pressEscapeKey();
                pageObject.clickSelect();
                await waitForUpdatesAsync();

                expect(pageObject.getDisplayText()).toBe('One');
            });

            it('filtering options does not change selected option in dropdown', async () => {
                element.value = 'three';
                await pageObject.openAndSetFilterText('t'); // filters to 'Two' and 'Three'

                expect(pageObject.getActiveOption()?.value).toBe('three');
            });

            it('filtering options does not change selected option in dropdown after navigating with arrow keys', async () => {
                await clickAndWaitForOpen(element);
                pageObject.pressArrowDownKey();
                pageObject.pressArrowDownKey(); // option 'Three' should be active
                pageObject.pressCharacterKey('t'); // filters to 'Two' and 'Three'

                expect(pageObject.getActiveOption()?.value).toBe('three');
            });

            it('dismissing dropdown with <Tab> after navigation and then filtering to no options, does not update value', async () => {
                await clickAndWaitForOpen(element);
                pageObject.pressArrowDownKey();
                pageObject.pressCharacterKey('?');
                pageObject.pressTabKey();

                expect(pageObject.getSelectedOption()?.value).toBe('one');
            });

            it('dismissing dropdown by clicking away after navigation and then filtering to no options, does not update value', async () => {
                await clickAndWaitForOpen(element);
                pageObject.pressArrowDownKey();
                pageObject.pressCharacterKey('?');
                await pageObject.clickAway();

                expect(pageObject.getSelectedOption()?.value).toBe('one');
            });

            it('option that is not hidden but visuallyHidden, if removed from DOM, and then re-added to DOM while dropdown open, is not displayed in dropdown', async () => {
                const option = element.options[1] as ListOption;
                await pageObject.openAndSetFilterText('Three');
                expect(option.visuallyHidden).toBeTrue();

                element.removeChild(option);
                await waitForUpdatesAsync();
                element.appendChild(option);
                await waitForUpdatesAsync();

                expect(option.visuallyHidden).toBeTrue();
            });

            it('option that is not hidden but visuallyHidden, if removed from DOM, and then re-added to DOM while dropdown closed, is visible in dropdown when opened', async () => {
                const option = element.options[1] as ListOption;
                await pageObject.openAndSetFilterText('Three');
                expect(option.visuallyHidden).toBeTrue();

                element.removeChild(option);
                await waitForUpdatesAsync();
                await pageObject.clickAway(); // clears filter
                element.appendChild(option);
                await waitForUpdatesAsync();
                pageObject.clickSelect();

                expect(option.visuallyHidden).toBeFalse();
            });

            it('option that is not hidden but is visuallyHidden, if removed and then added back, will be visible', async () => {
                const option = element.options[0]! as ListOption;
                option.visuallyHidden = true;
                element.removeChild(option);
                await waitForUpdatesAsync();
                element.appendChild(option);
                await waitForUpdatesAsync();

                expect(option.visuallyHidden).toBeFalse();
            });
        });

        describe('with filterMode = manual', () => {
            beforeEach(async () => {
                ({ element, connect, disconnect } = await setup());
                element.style.width = '200px';
                element.filterMode = FilterMode.manual;
                await connect();
                pageObject = new SelectPageObject(element);
            });

            afterEach(async () => {
                await disconnect();
            });

            it('does not automatically filter options when filterMode is manual', async () => {
                await pageObject.openAndSetFilterText('o');
                const filteredOptions = pageObject.getFilteredOptions();
                expect(filteredOptions.length).toBe(6);
            });

            it('emits filter-input event when filter text is entered', async () => {
                type SelectFilterInputEventHandler = (
                    evt: CustomEvent<SelectFilterInputEventDetail>
                ) => void;
                const filterInputEvent = jasmine.createSpy<SelectFilterInputEventHandler>();
                element.addEventListener(
                    'filter-input',
                    filterInputEvent as unknown as EventListener
                );
                await pageObject.openAndSetFilterText('o');
                expect(filterInputEvent).toHaveBeenCalledTimes(1);
                expect(
                    filterInputEvent.calls.argsFor(0)[0].detail.filterText
                ).toBe('o');
            });

            it('emits filter-input event with empty filterText when dropdown is closed', async () => {
                const filterInputEvent = jasmine.createSpy();
                element.addEventListener('filter-input', filterInputEvent);
                await pageObject.openAndSetFilterText('o');
                await pageObject.closeDropdown();
                expect(filterInputEvent).toHaveBeenCalledTimes(2);
                expect(
                    (
                        (filterInputEvent.calls.argsFor(1)[0] as CustomEvent)
                            .detail as SelectFilterInputEventDetail
                    ).filterText
                ).toBe('');
            });
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
                placeholderSelectedOption
            ));
            element.style.width = '200px';
            element.filterMode = FilterMode.standard;
            await connect();
            await waitForUpdatesAsync();
            pageObject = new SelectPageObject(element);
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('placeholder option is not present in dropdown', async () => {
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeFalse();
        });

        it('selecting option will replace placeholder text with selected option text', async () => {
            expect(pageObject.getDisplayText()).toBe('One');
            await clickAndWaitForOpen(element);
            pageObject.clickOption(1);
            await waitForUpdatesAsync();

            expect(pageObject.getDisplayText()).toBe('Two');
        });

        it('placeholder can be changed to another option programmatically', async () => {
            await waitForUpdatesAsync();
            element.options[0]!.hidden = false;
            element.options[1]!.hidden = true;
            element.options[1]!.disabled = true;
            element.options[1]!.selected = true;
            await waitForUpdatesAsync();

            expect(pageObject.getDisplayText()).toBe('Two');
            expect(element.value).toBe('two');
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeTrue();
            expect(pageObject.isOptionVisible(1)).toBeFalse();
        });

        it('selecting option via typing will not select placeholder', async () => {
            const newOptions = element.options.map(o => o as ListOption);
            newOptions.push(new ListOption('One one', 'one one'));
            await pageObject.setOptions(newOptions);
            expect(pageObject.getDisplayText()).toBe('One');
            pageObject.pressCharacterKey('o');
            await waitForUpdatesAsync();
            expect(pageObject.getDisplayText()).toBe('One one');
        });

        it('programmatically setting selected of current selected option to false results in placeholder being displayed', async () => {
            await clickAndWaitForOpen(element);
            pageObject.clickOption(1);
            const selectedOption = pageObject.getSelectedOption();
            selectedOption!.selected = false;
            await waitForUpdatesAsync();

            expect(pageObject.getDisplayText()).toBe('One');
        });

        it('pressing ESC does not clear placeholder text', async () => {
            pageObject.pressEscapeKey();
            await waitForUpdatesAsync();
            expect(pageObject.getDisplayText()).toBe('One');
        });

        it('clear button is not visible when placeholder is selected', () => {
            expect(pageObject.isClearButtonVisible()).toBeFalse();
        });
    });

    describe('clearable', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            element.style.width = '200px';
            element.clearable = true;
            await connect();
            await waitForUpdatesAsync();
            pageObject = new SelectPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('clear button is visible by default', () => {
            expect(pageObject.isClearButtonVisible()).toBeTrue();
        });

        it('when select is disabled, clear button is not visible', async () => {
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(pageObject.isClearButtonVisible()).toBeFalse();
        });

        it('can not Tab to clear button', () => {
            const clearButton = element.shadowRoot?.querySelector<Button>('.clear-button');
            expect(clearButton?.getAttribute('tabindex')).toBe('-1');
        });

        it('clear button is visible after selecting an option', async () => {
            pageObject.clickClearButton();
            await waitForUpdatesAsync();
            expect(pageObject.isClearButtonVisible()).toBeFalse();
            await clickAndWaitForOpen(element);
            pageObject.clickOption(1);
            await waitForUpdatesAsync();

            expect(pageObject.isClearButtonVisible()).toBeTrue();
        });

        it('clicking clear button does not open dropdown', async () => {
            pageObject.clickClearButton();
            await waitForUpdatesAsync();
            expect(element.open).toBeFalse();
        });

        it('clicking clear button fires change event', () => {
            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            pageObject.clickClearButton();
            expect(changeEvent).toHaveBeenCalledTimes(1);
        });

        it('if dropdown open clicking clear button closes dropdown and fires change event', async () => {
            pageObject.clickSelect();
            await waitForUpdatesAsync();
            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            pageObject.clickClearButton();
            expect(changeEvent).toHaveBeenCalledTimes(1);
        });

        it('if dropdown open pressing <Esc> closes dropdown and does not clear value', async () => {
            pageObject.clickSelect();
            await waitForUpdatesAsync();
            pageObject.pressEscapeKey();
            expect(element.open).toBeFalse();
            expect(element.value).toBe('one');
        });

        it('if dropdown is closed, pressing <Esc> clears value', async () => {
            pageObject.pressEscapeKey();
            await waitForUpdatesAsync();
            expect(element.value).toBe('');
        });

        describe('without placeholder', () => {
            it('after clicking clear button, display text is empty and clear button is hidden', async () => {
                pageObject.clickClearButton();
                await waitForUpdatesAsync();

                expect(pageObject.getDisplayText()).toBe('');
                expect(pageObject.isClearButtonVisible()).toBeFalse();
            });

            it('after clicking clear button and then selecting an option, clear button is visible again', async () => {
                pageObject.clickClearButton();
                await clickAndWaitForOpen(element);
                pageObject.clickOption(1);
                await waitForUpdatesAsync();
                expect(pageObject.isClearButtonVisible()).toBeTrue();
            });
        });

        describe('with placeholder', () => {
            beforeEach(async () => {
                const firstOption = element.options[0]!;
                firstOption.disabled = true;
                firstOption.hidden = true;
                await waitForUpdatesAsync();
            });

            it('clear button is not visible by default', () => {
                expect(pageObject.isClearButtonVisible()).toBeFalse();
            });

            it('after clicking clear button, placeholder is visible', async () => {
                await clickAndWaitForOpen(element);
                pageObject.clickOption(1);
                await waitForUpdatesAsync();
                pageObject.clickClearButton();
                await waitForUpdatesAsync();

                expect(pageObject.getDisplayText()).toBe('One');
            });

            const removePlaceholderData = [
                {
                    name: 'remove hidden from placeholder, clear button becomes visible and clicking it results in empty display text',
                    updatePlaceholder: (option: ListOption) => {
                        option.hidden = false;
                    }
                },
                {
                    name: 'remove disabled from placeholder, clear button becomes visible and clicking it results in empty display text',
                    updatePlaceholder: (option: ListOption) => {
                        option.disabled = false;
                    }
                }
            ] as const;
            parameterizeSpec(removePlaceholderData, (spec, name, value) => {
                spec(name, async () => {
                    value.updatePlaceholder(element.options[0]! as ListOption);
                    await waitForUpdatesAsync();
                    expect(pageObject.isClearButtonVisible()).toBeTrue();
                    pageObject.clickClearButton();
                    await waitForUpdatesAsync();

                    expect(pageObject.getDisplayText()).toBe('');
                });
            });
        });
    });

    describe('groups', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;
        const totalSlottedElements = 11;

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
            pageObject.clickGroup(0);
            expect(element.open).toBeTrue();
        });

        it('updating content with no groups updates options', async () => {
            const newOptions = [
                new ListOption('Ten', 'ten'),
                new ListOption('Twenty', 'twenty')
            ];
            await pageObject.setOptions(newOptions);
            await clickAndWaitForOpen(element);
            expect(element.options.length).toBe(2);
            expect(element.options[0]!.textContent).toBe('Ten');
            expect(element.options[1]!.textContent).toBe('Twenty');
        });

        it('can not select option in hidden group via arrow keys', () => {
            const group = pageObject.getGroup(0);
            group.hidden = true;
            pageObject.pressArrowDownKey();
            expect(element.value).toBe('three');
        });

        it('when group becomes unhidden, can select option in group via arrow keys', () => {
            const group = pageObject.getGroup(0);
            group.hidden = true;
            group.hidden = false;
            pageObject.pressArrowDownKey();
            expect(element.value).toBe('two');
        });

        it('all groups except last show bottom separator', async () => {
            await clickAndWaitForOpen(element);
            const groups = pageObject.getAllGroups();
            expect(groups[0]!.bottomSeparatorVisible).toBeTrue();
            expect(groups[1]!.bottomSeparatorVisible).toBeTrue();
            expect(groups[2]!.bottomSeparatorVisible).toBeFalse();
        });

        it('list option before group causes group to show top separator', async () => {
            const listOption = new ListOption('Before Group', 'before-group');
            const group = pageObject.getGroup(0);
            group.before(listOption);
            await waitForUpdatesAsync();
            expect(group.topSeparatorVisible).toBeTrue();
        });

        it('list option after last group causes group to show bottom separator', async () => {
            const listOption = new ListOption(
                'After Last Group',
                'after-last-group'
            );
            const groups = pageObject.getAllGroups();
            const lastGroup = groups[groups.length - 1]!;
            lastGroup.after(listOption);
            await waitForUpdatesAsync();
            expect(lastGroup.bottomSeparatorVisible).toBeTrue();
        });

        it('group that is hidden when slotted results in hidden options', async () => {
            const group = new ListOptionGroup();
            group.hidden = true;
            const option = new ListOption('Hidden Option', 'hidden-option');
            group.appendChild(option);
            element.appendChild(group);
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            const hiddenOptionIndex = element.options.findIndex(
                o => o.text === 'Hidden Option'
            );
            expect(pageObject.isOptionVisible(hiddenOptionIndex)).toBeFalse();
        });

        it('changing group to be hidden results in hidden options', async () => {
            const group = pageObject.getGroup(0);
            group.hidden = true;
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            // first two options should now be hidden
            expect(pageObject.isOptionVisible(0)).toBeFalse();
            expect(pageObject.isOptionVisible(1)).toBeFalse();
        });

        it('changing hidden group to be visible results in visible options', async () => {
            const group = pageObject.getGroup(0);
            group.hidden = true;
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeFalse();
            group.hidden = false;
            await waitForUpdatesAsync();
            // first two options should now be visible
            expect(pageObject.isOptionVisible(0)).toBeTrue();
            expect(pageObject.isOptionVisible(1)).toBeTrue();
        });

        it('inserting option between groups results in top separator of group after option', async () => {
            const newOption = new ListOption(
                'Between Groups',
                'between-groups'
            );
            const group = pageObject.getGroup(0);
            group.after(newOption);
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            const groupAfterInsertedOption = pageObject.getGroup(1);
            expect(groupAfterInsertedOption.topSeparatorVisible).toBeTrue();
        });

        it('hiding option between groups results in top separator being hidden of group after option', async () => {
            const newOption = new ListOption('Between', 'between-groups');
            const group = pageObject.getGroup(0);
            group.after(newOption);
            await waitForUpdatesAsync();
            newOption.hidden = true;
            await clickAndWaitForOpen(element);
            const groupAfterInsertedOption = pageObject.getGroup(1);
            expect(groupAfterInsertedOption.topSeparatorVisible).toBeFalse();
        });

        it('hiding option after all groups results in bottom separator being hidden for last group', async () => {
            const newOption = new ListOption('Between', 'between-groups');
            const group = pageObject.getGroup(2);
            group.after(newOption);
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            expect(group.bottomSeparatorVisible).toBeTrue();
            await waitForUpdatesAsync();
            newOption.hidden = true;
            pageObject.clickSelect();
            await waitForUpdatesAsync();
            expect(group.bottomSeparatorVisible).toBeFalse();
        });

        it('after removing group hidden from options and then changing option to be visible, adding group back results in visible group', async () => {
            const group = pageObject.getGroup(0);
            const groupOptions = group.listOptions;
            groupOptions.forEach(o => {
                o.hidden = true;
            });
            await waitForUpdatesAsync();
            expect(group.visuallyHidden).toBeTrue();
            element.removeChild(group);

            groupOptions.forEach(o => {
                o.hidden = false;
            });
            element.appendChild(group);
            await waitForUpdatesAsync();
            expect(group.visuallyHidden).toBeFalse();
        });

        it('after adding option to a group, it can be selected', async () => {
            const group = pageObject.getGroup(0);
            const newOption = new ListOption('New Option', 'new option');
            group.appendChild(newOption);
            await waitForUpdatesAsync();
            await clickAndWaitForOpen(element);
            pageObject.clickOptionWithDisplayText('New Option');
            expect(element.value).toBe('new option');
        });

        it('removing option from group removes option from options of select', async () => {
            const group = pageObject.getGroup(0);
            const option = group.listOptions[0];
            group.removeChild(option as Node);
            await waitForUpdatesAsync();
            expect(element.options).not.toContain(option!);
        });

        it('placeholder can be defined in a group', async () => {
            const group = pageObject.getGroup(0);
            const placeholder = new ListOption('Placeholder', 'placeholder');
            placeholder.hidden = true;
            placeholder.disabled = true;
            placeholder.selected = true;
            element.selectedIndex = -1;
            group.insertAdjacentElement('afterbegin', placeholder);
            await waitForUpdatesAsync();
            expect(pageObject.getDisplayText()).toBe('Placeholder');
            await clickAndWaitForOpen(element);
            expect(pageObject.isOptionVisible(0)).toBeFalse();
        });

        describe('filtering', () => {
            beforeEach(async () => {
                element.filterMode = FilterMode.standard;
                await waitForUpdatesAsync();
            });

            const groupFilterTestData = [
                {
                    name: 'filter matches first group label and only first group options',
                    filter: 'One',
                    visibleGroupLabels: ['Group One'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter only matches Option Four in second group',
                    filter: 'Four',
                    visibleGroupLabels: ['Group Two'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter only matches Option Six in third group',
                    filter: 'Six',
                    visibleGroupLabels: ['Gróup Three'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter matches Option Two in first group and second group label',
                    filter: 'Two',
                    visibleGroupLabels: ['Group One', 'Group Two'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: true
                        },
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter matches Option Three in second group and third group label',
                    filter: 'Three',
                    visibleGroupLabels: ['Group Two', 'Gróup Three'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: true
                        },
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter matches options in first and third groups',
                    filter: 'Edge',
                    visibleGroupLabels: ['Group One', 'Gróup Three'],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: true
                        },
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                },
                {
                    name: 'filter matches all groups',
                    filter: 'Group',
                    visibleGroupLabels: [
                        'Group One',
                        'Group Two',
                        'Gróup Three'
                    ],
                    separatorStates: [
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: true
                        },
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: true
                        },
                        {
                            topSeparatorVisible: false,
                            bottomSeparatorVisible: false
                        }
                    ]
                }
            ];
            parameterizeSpec(groupFilterTestData, (spec, name, value) => {
                spec(name, async () => {
                    await connect();
                    await waitForUpdatesAsync();
                    await pageObject.openAndSetFilterText(value.filter);
                    const visibleGroups = pageObject
                        .getDropdownVisibleElements()
                        .filter(isListOptionGroup);
                    expect(visibleGroups.map(g => g.labelContent)).toEqual(
                        value.visibleGroupLabels
                    );
                    expect(
                        visibleGroups.map(g => {
                            return {
                                topSeparatorVisible: g.topSeparatorVisible,
                                bottomSeparatorVisible: g.bottomSeparatorVisible
                            };
                        })
                    ).toEqual(value.separatorStates);

                    await disconnect();
                });
            });

            it('filter match on group label shows all options in matched group, as well as options in other groups that match filter', async () => {
                await pageObject.openAndSetFilterText('Two');
                const visibleElements = pageObject.getDropdownVisibleElements();
                expect(visibleElements?.length).toBe(5);
                expect(isListOptionGroup(visibleElements[0])).toBeTrue();
                expect(
                    (visibleElements[0] as ListOptionGroup).labelContent
                ).toBe('Group One');
                expect(visibleElements[1]!.textContent?.trim()).toBe('Two');
                expect(isListOptionGroup(visibleElements[2])).toBeTrue();
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
                const visibleElements = pageObject.getDropdownVisibleElements();
                expect(visibleElements?.length).toBe(totalSlottedElements);
            });

            it('filter matches diacritic characters in group label', async () => {
                await pageObject.openAndSetFilterText('ó');
                const visibleElements = pageObject.getDropdownVisibleElements();
                expect(visibleElements?.length).toBe(totalSlottedElements); // 'o' is matched in all group labels
            });

            it('filtering will not match options inside hidden group', async () => {
                const group = pageObject.getGroup(0);
                group.hidden = true; // Hides 'Group One' which has 'Two' option
                await pageObject.openAndSetFilterText('Two'); // Matches 'Group Two'
                const filteredOptions = pageObject
                    .getFilteredOptions()
                    .map(option => option.text);
                expect(filteredOptions).not.toContain('Two');
            });

            it('filtering out option between groups results in top separator of group after option', async () => {
                const newOption = new ListOption('Between', 'between-groups');
                const group = pageObject.getGroup(0);
                group.after(newOption);
                await waitForUpdatesAsync();
                await pageObject.openAndSetFilterText('Group');
                const groupAfterInsertedOption = pageObject.getGroup(1);
                expect(groupAfterInsertedOption.topSeparatorVisible).toBeTrue();
            });

            it('after hiding all groups, dropdown shows no results label', async () => {
                const groups = pageObject.getAllGroups();
                groups.forEach(g => {
                    g.hidden = true;
                });
                await waitForUpdatesAsync();
                expect(pageObject.isNoResultsLabelVisible()).toBeTrue();
            });

            it('if all results are hidden, and loadingVisible is true, no results label is not shown', async () => {
                element.loadingVisible = true;
                await waitForUpdatesAsync();
                await pageObject.openAndSetFilterText('abc');
                expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
            });

            it('does not automatically filter options when filterMode is manual', async () => {
                element.filterMode = FilterMode.manual;
                await pageObject.openAndSetFilterText('one');
                const filteredOptions = pageObject.getFilteredOptions();
                expect(filteredOptions.length).toBe(8);
            });
        });
    });

    describe('PageObject', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: SelectPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithGroups());
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

        it('exercise getGroupLabels', async () => {
            await clickAndWaitForOpen(element);
            const groupLabels = pageObject.getGroupLabels();
            expect(groupLabels).toEqual([
                'Group One',
                'Group Two',
                'Gróup Three'
            ]);
        });

        it('exercise getGroupOptionLabelsByIndex', async () => {
            await clickAndWaitForOpen(element);
            const optionLabels = pageObject.getGroupOptionLabelsByIndex(0);
            expect(optionLabels).toEqual(['One', 'Two', 'Edge']);
        });

        it('exercise getGroupOptionLabelsByLabel', async () => {
            await clickAndWaitForOpen(element);
            const optionLabels = pageObject.getGroupOptionLabelsByLabel('Group Two');
            expect(optionLabels).toEqual(['Three', 'Four']);
        });
    });
});
