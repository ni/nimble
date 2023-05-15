import { html, repeat } from '@microsoft/fast-element';
import { keyArrowDown, keyEnter } from '@microsoft/fast-web-utilities';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Combobox, comboboxTag } from '..';
import { listOptionTag } from '../../list-option';
import { ComboboxAutocomplete } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';

async function setup(
    position?: string,
    open?: boolean
): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <nimble-combobox
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
            <nimble-list-option value="three">Three</nimble-list-option>
            <nimble-list-option value="four" disabled>Four</nimble-list-option>
        </nimble-combobox>
    `;
    return fixture<Combobox>(viewTemplate);
}

function updateComboboxWithText(combobox: Combobox, text: string): void {
    combobox.control.value = text;
    const inputEvent = new InputEvent('input', {
        data: text,
        inputType: 'insertText'
    });
    combobox.inputHandler(inputEvent);
    combobox.dispatchEvent(inputEvent);
}

async function clickAndWaitForOpen(combo: Combobox): Promise<void> {
    const regionLoadedListener = createEventListener(combo, 'loaded');
    combo.click();
    await regionLoadedListener.promise;
}

async function checkFullyInViewport(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        const intersectionObserver = new IntersectionObserver(
            entries => {
                intersectionObserver.disconnect();
                if (
                    entries[0]?.isIntersecting
                    && entries[0].intersectionRatio === 1.0
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            // As of now, passing a document as root is not supported on Safari:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#browser_compatibility
            // If we begin running these tests on Safari, we may need to skip those that use this function.
            // This issue tracks expanding testing to Safari: https://github.com/ni/nimble/issues/990
            { threshold: 1.0, root: document }
        );
        intersectionObserver.observe(element);
    });
}

describe('Combobox', () => {
    it('should set aria-disabled attribute when property is set', async () => {
        const { element, connect, disconnect } = await setup();

        element.ariaDisabled = 'true';
        await connect();

        expect(element.getAttribute('aria-disabled')).toBe('true');

        await disconnect();
    });

    it('should set autocomplete attribute when property is set', async () => {
        const { element, connect, disconnect } = await setup();

        element.autocomplete = ComboboxAutocomplete.both;
        await connect();

        expect(element.getAttribute('autocomplete')).toBe(
            ComboboxAutocomplete.both
        );

        await disconnect();
    });

    it('should set classes based on open, disabled, and position', async () => {
        const { element, connect, disconnect } = await setup('above', true);

        element.disabled = true;
        await connect();
        await waitForUpdatesAsync();

        expect(element.classList.contains('above')).toBeTrue();
        expect(element.classList.contains('disabled')).toBeTrue();
        expect(element.classList.contains('open')).toBeTrue();

        await disconnect();
    });

    it('should set tabindex based on disabled state', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('tabindex')).toBe('0');
        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.getAttribute('tabindex')).toBeNull();

        await disconnect();
    });

    it('should forward  based on disabled state', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('tabindex')).toBe('0');
        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.getAttribute('tabindex')).toBeNull();

        await disconnect();
    });

    const ariaTestData: {
        attrName: string,
        propSetter: (x: Combobox, value: string) => void
    }[] = [
        {
            attrName: 'aria-activedescendant',
            propSetter: (x, v) => {
                x.ariaActiveDescendant = v;
            }
        },
        {
            attrName: 'aria-autocomplete',
            propSetter: (x, v) => {
                x.ariaAutoComplete = v;
            }
        },
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
        }
    ];
    ariaTestData.forEach(testData => {
        it(`should forward ${testData.attrName} to inner control`, async () => {
            const { element, connect, disconnect } = await setup('above', true);
            await connect();

            testData.propSetter(element, 'foo');
            await waitForUpdatesAsync();
            expect(element.control.getAttribute(testData.attrName)).toEqual(
                'foo'
            );

            await disconnect();
        });
    });

    it('should forward placeholder to inner control', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.placeholder = 'foo';
        await waitForUpdatesAsync();
        expect(element.control.getAttribute('placeholder')).toEqual('foo');

        await disconnect();
    });

    it('should forward disabled to inner control', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.control.getAttribute('disabled')).not.toBeNull();

        await disconnect();
    });

    it('should forward value property to inner control', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.value = 'foo';
        await waitForUpdatesAsync();
        expect(element.control.value).toBe('foo');

        await disconnect();
    });

    it('should respect value set before connect is completed', async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 'two';
        await connect();

        expect(element.value).toBe('Two');

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
        expect(element.value).toBe('Two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await waitForUpdatesAsync();

        expect(element.value).toBe('Two');

        await disconnect();
    });

    it('should export its tag', () => {
        expect(comboboxTag).toBe('nimble-combobox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-combobox')).toBeInstanceOf(
            Combobox
        );
    });

    it('should disable the button when disabled is `true`', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.disabled = true;
        await waitForUpdatesAsync();

        expect(element.dropdownButton!.disabled).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown should set button to checked', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.control.click();
        await waitForUpdatesAsync();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button should open menu', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.dropdownButton?.control.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button when popup is open should close menu', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('clicking dropdown button when popup is open should cause button to be unchecked', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click();
        await waitForUpdatesAsync();

        expect(element.dropdownButton?.checked).toBeFalse();

        await disconnect();
    });

    it('setting open programmatically should update checked state of button', async () => {
        const { element, connect, disconnect } = await setup(undefined, false);
        await connect();

        element.open = true;
        await waitForUpdatesAsync();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown after dropdown closed with button should cause button to be checked', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click(); // open should be false
        await waitForUpdatesAsync();
        element.control.click(); // open should be true
        await waitForUpdatesAsync();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('input element gets aria-label from combobox', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedLabel = 'new label';
        element.ariaLabel = expectedLabel;
        await waitForUpdatesAsync();

        const inputElement = element.shadowRoot?.querySelector('.selected-value');
        expect(inputElement?.getAttribute('aria-label')).toEqual(expectedLabel);

        await disconnect();
    });

    it('input element removes aria-label when removed from combobox', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedLabel = 'new label';
        element.ariaLabel = expectedLabel;
        await waitForUpdatesAsync();

        element.ariaLabel = null;
        await waitForUpdatesAsync();

        const inputElement = element.shadowRoot?.querySelector('.selected-value');
        expect(inputElement?.getAttribute('aria-label')).toEqual(null);

        await disconnect();
    });

    it('value updates on input', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        element.autocomplete = ComboboxAutocomplete.both;
        updateComboboxWithText(element, 'O');
        await waitForUpdatesAsync();
        expect(element.value).toEqual('One'); // value set to input text which should autocomplete to 'One'

        element.control.value = 'O';
        const inputEvent = new InputEvent('input', {
            inputType: 'deleteContentForward'
        }); // delete autocompleted portion
        element.inputHandler(inputEvent);
        element.dispatchEvent(inputEvent);
        await waitForUpdatesAsync();
        expect(element.value).toEqual('O');

        await disconnect();
    });

    it('emits one change event after changing value through text entry', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        const changeEvent = jasmine.createSpy();
        element.addEventListener('change', changeEvent);
        element.autocomplete = ComboboxAutocomplete.none;
        updateComboboxWithText(element, 'O');
        expect(changeEvent).toHaveBeenCalledTimes(0);
        await waitForUpdatesAsync();

        updateComboboxWithText(element, 'On');
        await waitForUpdatesAsync();
        expect(changeEvent).toHaveBeenCalledTimes(0);

        const enterEvent = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        element.dispatchEvent(enterEvent); // commit value
        expect(changeEvent).toHaveBeenCalledTimes(1);

        const focusoutEvent = new FocusEvent('focusout', {
            relatedTarget: element
        });
        element.dispatchEvent(focusoutEvent); // focusout should not also emit a change event
        expect(changeEvent).toHaveBeenCalledTimes(1);

        await disconnect();
    });

    it('should not emit change event if entered text matches value prior to typing', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        element.autocomplete = ComboboxAutocomplete.none;
        updateComboboxWithText(element, 'O');
        const enterEvent = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        element.dispatchEvent(enterEvent); // commit value ('O')

        const changeEvent = jasmine.createSpy();
        element.addEventListener('change', changeEvent);
        element.control.value = '';
        element.control.dispatchEvent(
            new InputEvent('input', { inputType: 'deleteContentBackward' })
        );
        updateComboboxWithText(element, 'O');
        element.dispatchEvent(enterEvent); // commit value ('O')
        expect(changeEvent).toHaveBeenCalledTimes(0);

        await disconnect();
    });

    it('after text entry if user browses popup and selects option pressing <Enter>, emit only one change event', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        element.autocomplete = ComboboxAutocomplete.none;
        const changeEvent = jasmine.createSpy();
        element.addEventListener('change', changeEvent);
        updateComboboxWithText(element, 'O');
        const keydownEvent = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        element.dispatchEvent(keydownEvent); // open dropdown
        element.dispatchEvent(keydownEvent); // browse to 'One'
        const enterEvent = new KeyboardEvent('keydown', {
            key: keyEnter
        } as KeyboardEventInit);
        element.dispatchEvent(enterEvent); // commit value ('One')
        await waitForUpdatesAsync();

        expect(changeEvent).toHaveBeenCalledTimes(1);

        await disconnect();
    });

    const filterOptionTestData: { autocomplete: ComboboxAutocomplete }[] = [
        { autocomplete: ComboboxAutocomplete.inline },
        { autocomplete: ComboboxAutocomplete.both }
    ];
    filterOptionTestData.forEach(testData => {
        it('disabled options will not be selected by keyboard input', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.autocomplete = testData.autocomplete;
            updateComboboxWithText(element, 'F');
            element.focusoutHandler(new FocusEvent('')); // attempt to commit typed value

            expect(element.value).not.toEqual('Four');

            await disconnect();
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
            await clickAndWaitForOpen(combo);
            const fullyVisible = await checkFullyInViewport(combo.listbox);

            expect(fullyVisible).toBe(true);

            await disconnect();
        });
    });
});
