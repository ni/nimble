import {
    DesignSystem,
    Combobox as FoundationCombobox
} from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Combobox } from '..';
import '../../list-option';
import { ComboboxAutocomplete } from '../types';

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

describe('Combobox', () => {
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
        await DOM.nextUpdate();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should keep selected value when options change', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.value = 'two';
        await DOM.nextUpdate();
        expect(element.value).toBe('Two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await DOM.nextUpdate();

        expect(element.value).toBe('Two');

        await disconnect();
    });

    it('should have its tag returned by tagFor(FoundationCombobox)', () => {
        expect(DesignSystem.tagFor(FoundationCombobox)).toBe('nimble-combobox');
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
        await DOM.nextUpdate();

        expect(element.dropdownButton!.disabled).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown should set button to checked', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.control.click();
        await DOM.nextUpdate();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button should open menu', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.dropdownButton?.control.click();
        await DOM.nextUpdate();

        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button when popup is open should close menu', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click();
        await DOM.nextUpdate();

        expect(element.open).toBeFalse();

        await disconnect();
    });

    it('clicking dropdown button when popup is open should cause button to be unchecked', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click();
        await DOM.nextUpdate();

        expect(element.dropdownButton?.checked).toBeFalse();

        await disconnect();
    });

    it('setting open programmatically should update checked state of button', async () => {
        const { element, connect, disconnect } = await setup(undefined, false);
        await connect();

        element.open = true;
        await DOM.nextUpdate();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown after dropdown closed with button should cause button to be checked', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click(); // open should be false
        await DOM.nextUpdate();
        element.control.click(); // open should be true
        await DOM.nextUpdate();

        expect(element.dropdownButton?.checked).toBeTrue();

        await disconnect();
    });

    it('input element gets aria-label from combobox', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedLabel = 'new label';
        element.ariaLabel = expectedLabel;
        await DOM.nextUpdate();

        const inputElement = element.shadowRoot?.querySelector('.selected-value');
        expect(inputElement?.getAttribute('aria-label')).toEqual(expectedLabel);

        await disconnect();
    });

    it('input element removes aria-label when removed from combobox', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const expectedLabel = 'new label';
        element.ariaLabel = expectedLabel;
        await DOM.nextUpdate();

        element.ariaLabel = null;
        await DOM.nextUpdate();

        const inputElement = element.shadowRoot?.querySelector('.selected-value');
        expect(inputElement?.getAttribute('aria-label')).toEqual(null);

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
            element.control.value = 'F';
            const inputEvent = new InputEvent('F'); // fake user typing 'F' to match 'Four'
            element.inputHandler(inputEvent);
            element.focusoutHandler(new FocusEvent('')); // attempt to commit typed value

            expect(element.value).not.toEqual('Four');

            await disconnect();
        });
    });
});
