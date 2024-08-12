import { html, repeat } from '@microsoft/fast-element';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Combobox, comboboxTag } from '..';
import { ComboboxAutocomplete } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { checkFullyInViewport } from '../../utilities/tests/intersection-observer';
import { listOptionTag } from '../../list-option';
import { ComboboxPageObject } from '../testing/combobox.pageobject';

describe('Combobox', () => {
    it('should export its tag', () => {
        expect(comboboxTag).toBe('nimble-combobox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-combobox')).toBeInstanceOf(
            Combobox
        );
    });

    describe('with common setup', () => {
        async function setup(): Promise<Fixture<Combobox>> {
            // prettier-ignore
            const viewTemplate = html`
                <${comboboxTag}>
                    <${listOptionTag}>One</${listOptionTag}>
                    <${listOptionTag}>Two</${listOptionTag}>
                    <${listOptionTag}>Three</${listOptionTag}>
                    <${listOptionTag} disabled>Four</${listOptionTag}>
                </${comboboxTag}>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        let element: Combobox;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: ComboboxPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            pageObject = new ComboboxPageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should set aria-disabled attribute when property is set', async () => {
            element.ariaDisabled = 'true';
            await waitForUpdatesAsync();
            expect(element.getAttribute('aria-disabled')).toBe('true');
        });

        it('should set autocomplete attribute when property is set', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            await waitForUpdatesAsync();
            expect(element.getAttribute('autocomplete')).toBe(
                ComboboxAutocomplete.both
            );
        });

        it('should set tabindex based on disabled state', async () => {
            expect(element.getAttribute('tabindex')).toBe('0');
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(element.getAttribute('tabindex')).toBeNull();
        });

        const ariaTestData = [
            {
                name: 'aria-activedescendant',
                propName: 'ariaActiveDescendant'
            },
            {
                name: 'aria-autocomplete',
                propName: 'ariaAutoComplete'
            },
            {
                name: 'aria-controls',
                propName: 'ariaControls'
            },
            {
                name: 'aria-disabled',
                propName: 'ariaDisabled'
            },
            {
                name: 'aria-expanded',
                propName: 'ariaExpanded'
            }
        ] as const;
        parameterizeSpec(ariaTestData, (spec, name, value) => {
            spec(`should forward ${name} to inner control`, async () => {
                element.open = true;
                element[value.propName] = 'foo';
                await waitForUpdatesAsync();
                expect(element.control.getAttribute(name)).toEqual('foo');
            });
        });

        it('should forward placeholder to inner control', async () => {
            element.placeholder = 'foo';
            await waitForUpdatesAsync();
            expect(element.control.getAttribute('placeholder')).toEqual('foo');
        });

        it('should forward disabled to inner control', async () => {
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(element.control.getAttribute('disabled')).not.toBeNull();
        });

        it('should forward value property to inner control', async () => {
            element.value = 'foo';
            await waitForUpdatesAsync();
            expect(element.control.value).toBe('foo');
        });

        it('should keep selected value when options change', async () => {
            element.value = 'Two';
            await waitForUpdatesAsync();
            expect(element.value).toBe('Two');

            await pageObject.prependOption('zero', 'Zero');
            expect(element.value).toBe('Two');
        });

        it('should disable the button when disabled is `true`', async () => {
            element.disabled = true;
            await waitForUpdatesAsync();

            expect(pageObject.isDropdownButtonDisabled()).toBeTrue();
        });

        it('clicking dropdown should set button to checked', () => {
            pageObject.clickDropdownButton();
            expect(pageObject.isDropdownButtonChecked()).toBeTrue();
        });

        it('clicking dropdown button should open menu', async () => {
            await pageObject.clickDropdownButtonAndWaitForOpen();
            expect(element.open).toBeTrue();
        });

        it('clicking dropdown button when popup is open should close menu', async () => {
            await pageObject.clickAndWaitForOpen();

            pageObject.clickDropdownButton();
            expect(element.open).toBeFalse();
        });

        it('clicking dropdown button when popup is open should cause button to be unchecked', async () => {
            await pageObject.clickAndWaitForOpen();

            pageObject.clickDropdownButton();
            expect(pageObject.isDropdownButtonChecked()).toBeFalse();
        });

        it('setting open programmatically should update checked state of button', async () => {
            element.open = true;
            await waitForUpdatesAsync();

            expect(pageObject.isDropdownButtonChecked()).toBeTrue();
        });

        it('clicking dropdown after dropdown closed with button should cause button to be checked', async () => {
            await pageObject.clickAndWaitForOpen();

            pageObject.clickDropdownButton(); // open should be false
            await waitForUpdatesAsync();
            pageObject.clickInput(); // open should be true
            await waitForUpdatesAsync();

            expect(pageObject.isDropdownButtonChecked()).toBeTrue();
        });

        it('input element gets aria-label from combobox', async () => {
            const expectedLabel = 'new label';
            element.ariaLabel = expectedLabel;
            await waitForUpdatesAsync();

            expect(pageObject.getInputAriaLabel()).toEqual(expectedLabel);
        });

        it('input element removes aria-label when removed from combobox', async () => {
            const expectedLabel = 'new label';
            element.ariaLabel = expectedLabel;
            await waitForUpdatesAsync();

            element.ariaLabel = null;
            await waitForUpdatesAsync();

            expect(pageObject.getInputAriaLabel()).toEqual(null);
        });

        it('value updates on input', () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('O'); // should autocomplete to 'One'
            expect(element.value).toEqual('One');

            // Simulate deleting the selected text left by autocomplete (i.e. "ne")
            pageObject.setInputText('O', true);
            expect(element.value).toEqual('O');
        });

        it('updates filter when value set programmatically', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('Th');
            await pageObject.clickAway();

            expect(pageObject.getFilteredOptions()).toEqual(
                jasmine.arrayWithExactContents(['Three'])
            );

            element.value = 'Two';
            await waitForUpdatesAsync();

            expect(pageObject.getFilteredOptions()).toEqual(
                jasmine.arrayWithExactContents(['Two'])
            );
            expect(element.filteredOptions[0]?.classList).toContain('selected');
        });

        it('filters list after entering value and losing focus', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('Two');
            await pageObject.clickAway();

            expect(pageObject.getFilteredOptions()).toEqual(
                jasmine.arrayWithExactContents(['Two'])
            );
        });

        it('filters list after entering value and reselecting value from list', () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('Two');
            pageObject.pressArrowDownKey();
            pageObject.pressEnterKey();

            expect(pageObject.getFilteredOptions()).toEqual(
                jasmine.arrayWithExactContents(['Two'])
            );
        });

        it('shows "no items found" in dropdown when typed text matches nothing', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('zzz');
            await waitForUpdatesAsync();
            expect(pageObject.isNoResultsLabelVisible()).toBeTrue();
        });

        it('does not show "no items found" in dropdown when typed text matches nothing but autocomplete mode is none', async () => {
            pageObject.setInputText('zzz');
            await waitForUpdatesAsync();
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('does not show "no items found" in dropdown when typed text matches enabled option', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('o'); // matches "One"
            await waitForUpdatesAsync();
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('does not show "no items found" in dropdown when typed text matches disabled option', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('fo'); // matches "Four"
            await waitForUpdatesAsync();
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('does not show "no items found" in dropdown when input is empty', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            await pageObject.clickAndWaitForOpen();
            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('shows "no items found" in dropdown after hiding all options', async () => {
            pageObject.hideAllOptions();
            await pageObject.clickAndWaitForOpen();
            expect(pageObject.isNoResultsLabelVisible()).toBeTrue();
        });

        it('removes "no items found" from dropdown when a matching option is added', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('zzz'); // matches "One"
            await waitForUpdatesAsync();

            const matchingOption = document.createElement(listOptionTag);
            matchingOption.value = 'zzzzzz';
            matchingOption.innerHTML = 'Zzzzzz';
            element.appendChild(matchingOption);
            await waitForUpdatesAsync();

            expect(pageObject.isNoResultsLabelVisible()).toBeFalse();
        });

        it('emits one change event after changing value through text entry', async () => {
            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            element.autocomplete = ComboboxAutocomplete.none;
            pageObject.setInputText('O');
            expect(changeEvent).toHaveBeenCalledTimes(0);
            await waitForUpdatesAsync();

            pageObject.setInputText('On');
            await waitForUpdatesAsync();
            expect(changeEvent).toHaveBeenCalledTimes(0);

            pageObject.pressEnterKey(); // commit value
            expect(changeEvent).toHaveBeenCalledTimes(1);

            await pageObject.clickAway(); // focusout should not also emit a change event
            expect(changeEvent).toHaveBeenCalledTimes(1);
        });

        it('emits one change event on focusout when popup is closed and text was updated', async () => {
            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            element.autocomplete = ComboboxAutocomplete.none;
            pageObject.setInputText('O');
            expect(changeEvent).toHaveBeenCalledTimes(0);
            await waitForUpdatesAsync();

            pageObject.setInputText('On');
            await waitForUpdatesAsync();
            expect(changeEvent).toHaveBeenCalledTimes(0);

            await pageObject.clickAway(); // commit value
            expect(changeEvent).toHaveBeenCalledTimes(1);
        });

        it('should not emit change event if entered text matches value prior to typing', async () => {
            element.autocomplete = ComboboxAutocomplete.none;
            await pageObject.commitValue('O');

            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            pageObject.setInputText('');
            await pageObject.commitValue('O');
            expect(changeEvent).toHaveBeenCalledTimes(0);
        });

        it('after text entry if user browses popup and selects option pressing <Enter>, emit only one change event', async () => {
            element.autocomplete = ComboboxAutocomplete.none;
            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            pageObject.setInputText('O');
            pageObject.pressArrowDownKey(); // open dropdown
            pageObject.pressArrowDownKey(); // browse to 'One'
            pageObject.pressEnterKey(); // commit value ('One')
            await waitForUpdatesAsync();

            expect(changeEvent).toHaveBeenCalledTimes(1);
        });

        it('skips disabled option when navigating dropdown with down arrow key', async () => {
            element.autocomplete = ComboboxAutocomplete.none;
            element.options[2]!.disabled = true;
            element.options[3]!.disabled = false;
            // now option 'Three' is disabled and 'Four' is enabled

            pageObject.pressArrowDownKey(); // open dropdown
            pageObject.pressArrowDownKey(); // browse to 'One'
            pageObject.pressArrowDownKey(); // browse to 'Two'
            pageObject.pressArrowDownKey(); // skip disabled 'Three', browse to 'Four'
            await waitForUpdatesAsync();

            expect(element.options[3]!.ariaSelected).toEqual('true');
        });

        it('skips disabled option when navigating dropdown with up arrow key', async () => {
            element.autocomplete = ComboboxAutocomplete.none;
            element.options[2]!.disabled = true;
            element.options[3]!.disabled = false;
            // now option 'Three' is disabled and 'Four' is enabled

            await pageObject.commitValue('Four');
            pageObject.pressArrowDownKey(); // open dropdown
            pageObject.pressArrowUpKey(); // skip disabled 'Three', browse to 'Two'
            await waitForUpdatesAsync();

            expect(element.options[1]!.ariaSelected).toEqual('true');
        });

        const filterOptionSuiteData = [
            {
                name: ComboboxAutocomplete.inline
            },
            {
                name: ComboboxAutocomplete.list
            },
            {
                name: ComboboxAutocomplete.both
            },
            {
                name: ComboboxAutocomplete.none
            }
        ] as const;
        const filterOptionTestData = [
            {
                name: 'will not autocomplete disabled option',
                text: 'F'
            },
            {
                name: 'allows committing disabled option from input (exact case)',
                text: 'Four'
            },
            {
                name: 'allows committing disabled option from input (with case difference)',
                text: 'four'
            }
        ] as const;
        parameterizeSuite(filterOptionSuiteData, (suite, name) => {
            suite(`with autocomplete "${name}"`, () => {
                parameterizeSpec(
                    filterOptionTestData,
                    (spec, testName, value) => {
                        spec(testName, async () => {
                            element.autocomplete = name;
                            pageObject.setInputText(value.text);
                            await pageObject.clickAway(); // attempt to commit typed value
                            expect(element.value).toEqual(value.text);
                        });
                    }
                );
            });
        });

        describe('title overflow', () => {
            beforeEach(() => {
                element.style.width = '200px';
            });

            it('sets title when option text is ellipsized', async () => {
                const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
                pageObject.setInputText(optionContent);
                await pageObject.mouseoverInput();
                expect(pageObject.getInputTitle()).toBe(optionContent);
            });

            it('does not set title when option text is fully visible', async () => {
                const optionContent = 'short value';
                pageObject.setInputText(optionContent);
                await pageObject.mouseoverInput();
                expect(pageObject.getInputTitle()).toBeNull();
            });

            it('removes title on mouseout of option', async () => {
                const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
                pageObject.setInputText(optionContent);
                await pageObject.mouseoverInput();
                await pageObject.mouseoutInput();
                expect(pageObject.getInputTitle()).toBeNull();
            });
        });
    });

    describe('configured before connecting', () => {
        async function setup(): Promise<Fixture<Combobox>> {
            const viewTemplate = html`
                <${comboboxTag}>
                    <${listOptionTag}>One</${listOptionTag}>
                    <${listOptionTag}>Two</${listOptionTag}>
                </${comboboxTag}>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        it('should respect value set before connect is completed', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'two';
            await connect();

            expect(element.value).toBe('two');

            await disconnect();
        });
    });

    describe('with template attributes', () => {
        async function setup(): Promise<Fixture<Combobox>> {
            // prettier-ignore
            const viewTemplate = html`
                <${comboboxTag}
                    open
                    disabled
                    position="above"
                >
                    <${listOptionTag}>One</${listOptionTag}>
                </${comboboxTag}>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        it('should set classes based on open, disabled, and position', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            await waitForUpdatesAsync();

            expect(element.classList.contains('open')).toBeTrue();
            expect(element.classList.contains('disabled')).toBeTrue();
            expect(element.classList.contains('above')).toBeTrue();

            await disconnect();
        });

        it('should respect "open" and "position" attributes when both set', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            await waitForUpdatesAsync();

            expect(element.getAttribute('open')).not.toBeNull();
            expect(element.getAttribute('position')).toBe('above');

            await disconnect();
        });
    });

    describe('with many options', () => {
        async function setupWithManyOptions(): Promise<Fixture<Combobox>> {
            // prettier-ignore
            const viewTemplate = html`
                <${comboboxTag}
                    autocomplete="inline"
                >
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <${listOptionTag}>${x => x}</${listOptionTag}>
                    `)}
                    <${listOptionTag}>1000</${listOptionTag}>
                </${comboboxTag}>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        let element: Combobox;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageObject: ComboboxPageObject;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupWithManyOptions());
            pageObject = new ComboboxPageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        // Intermittent, see: https://github.com/ni/nimble/issues/2274
        it('should scroll the selected option into view when opened #SkipWebkit', async () => {
            await pageObject.commitValue('300');
            await pageObject.clickAndWaitForOpen();
            expect(element.scrollableRegion.scrollTop).toBeGreaterThan(9000);

            await pageObject.commitValue('0');
            await pageObject.clickAndWaitForOpen();
            expect(element.scrollableRegion.scrollTop).toBeCloseTo(0);
        });

        it('when typing in value with inline autocomplete, option at bottom of list scrolls into view', async () => {
            const lastOption = element.options[element.options.length - 1]!;
            await pageObject.clickAndWaitForOpen();
            let optionIsVisible = await checkFullyInViewport(lastOption);
            expect(optionIsVisible).toBeFalse();

            pageObject.setInputText('1000'); // last option in set
            await waitForUpdatesAsync();
            optionIsVisible = await checkFullyInViewport(lastOption);
            expect(optionIsVisible).toBeTrue();
        });
    });

    describe('within a div', () => {
        async function setupInDiv(): Promise<Fixture<Combobox>> {
            // prettier-ignore
            const viewTemplate = html`
                <div style="overflow: auto;">
                    <<${comboboxTag}>>
                        ${repeat(() => [...Array(5).keys()], html<number>`
                            <${listOptionTag}>${x => x}</${listOptionTag}>`)}
                    </<${comboboxTag}>>
                </div>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        it('should not confine dropdown to div with "overflow: auto"', async () => {
            const { element, connect, disconnect } = await setupInDiv();
            const combo: Combobox = element.querySelector(comboboxTag)!;
            await connect();
            const pageObject = new ComboboxPageObject(combo);
            await pageObject.clickAndWaitForOpen();
            const fullyVisible = await checkFullyInViewport(combo.listbox);

            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });
});
