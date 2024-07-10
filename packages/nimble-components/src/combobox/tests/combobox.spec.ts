import { html, repeat } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
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
                <nimble-combobox>
                    <nimble-list-option value="one">One</nimble-list-option>
                    <nimble-list-option value="two">Two</nimble-list-option>
                    <nimble-list-option value="three">Three</nimble-list-option>
                    <nimble-list-option value="four" disabled>Four</nimble-list-option>
                </nimble-combobox>
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
            await pageObject.waitForAnchoredRegionLoaded();
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

            expect(element.filteredOptions.length).toEqual(1);
            expect(element.filteredOptions[0]?.value).toEqual('three');

            element.value = 'Two';
            await waitForUpdatesAsync();

            expect(element.filteredOptions.length).toEqual(1);
            expect(element.filteredOptions[0]?.value).toEqual('two');
            expect(element.filteredOptions[0]?.classList).toContain('selected');
        });

        it('filters list after entering value and losing focus', async () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('Two');
            await pageObject.clickAway();

            expect(element.filteredOptions.length).toEqual(1);
            expect(element.filteredOptions[0]?.value).toEqual('two');
        });

        it('filters list after entering value and reselecting value from list', () => {
            element.autocomplete = ComboboxAutocomplete.both;
            pageObject.setInputText('Two');
            pageObject.pressArrowDownKey();
            pageObject.pressEnterKey();

            expect(element.filteredOptions.length).toEqual(1);
            expect(element.filteredOptions[0]?.value).toEqual('two');
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

        it('should not emit change event if entered text matches value prior to typing', () => {
            element.autocomplete = ComboboxAutocomplete.none;
            pageObject.commitValue('O');

            const changeEvent = jasmine.createSpy();
            element.addEventListener('change', changeEvent);
            pageObject.setInputText('');
            pageObject.commitValue('O');
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

        const filterOptionTestData = [
            {
                name: ComboboxAutocomplete.inline
            },
            {
                name: ComboboxAutocomplete.both
            }
        ] as const;
        parameterizeSpec(filterOptionTestData, (spec, name) => {
            spec(
                `disabled options will not be selected by keyboard input with autocomplete "${name}"`,
                async () => {
                    element.autocomplete = name;
                    pageObject.setInputText('F');
                    await pageObject.clickAway(); // attempt to commit typed value

                    expect(element.value).not.toEqual('Four');
                }
            );
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
                <nimble-combobox>
                    <nimble-list-option value="one">One</nimble-list-option>
                    <nimble-list-option value="two">Two</nimble-list-option>
                </nimble-combobox>
            `;
            return fixture<Combobox>(viewTemplate);
        }

        it('should respect value set before connect is completed', async () => {
            const { element, connect, disconnect } = await setup();

            element.value = 'two';
            await connect();

            expect(element.value).toBe('Two');

            await disconnect();
        });
    });

    describe('with template attributes', () => {
        async function setup(): Promise<Fixture<Combobox>> {
            // prettier-ignore
            const viewTemplate = html`
                <nimble-combobox
                    open
                    disabled
                    position="above"
                >
                    <nimble-list-option value="one">One</nimble-list-option>
                </nimble-combobox>
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
                <nimble-combobox
                    autocomplete="inline"
                >
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <nimble-list-option>${x => x}</nimble-list-option>
                    `)}
                    <nimble-list-option>1000</nimble-list-option>
                </nimble-combobox>
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
            // Necessary for scrolling to work properly
            await pageObject.waitForAnchoredRegionLoaded();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should scroll the selected option into view when opened', async () => {
            pageObject.commitValue('300');
            await pageObject.clickAndWaitForOpen();
            expect(element.listbox.scrollTop).toBeGreaterThan(9000);

            pageObject.commitValue('0');
            await pageObject.clickAndWaitForOpen();
            expect(element.listbox.scrollTop).toBeCloseTo(4);
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
                    <${comboboxTag}>
                        ${repeat(() => [...Array(5).keys()], html<number>`
                            <${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
                    </${comboboxTag}>
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
