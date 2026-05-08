import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvChipSelector, fvChipSelectorTag } from '..';

async function setup(): Promise<Fixture<FvChipSelector>> {
    return await fixture<FvChipSelector>(html`
        <${fvChipSelectorTag}
            label="Status"
            options="Active,Paused,Error,Maintenance due"
        ></${fvChipSelectorTag}>
    `);
}

describe('FvChipSelector', () => {
    let element: FvChipSelector;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    function getShadowRoot(): ShadowRoot {
        if (!element.shadowRoot) {
            throw new Error('Expected chip selector shadow root to exist');
        }

        return element.shadowRoot;
    }

    function getRequiredElement<T extends Element>(selector: string): T {
        const foundElement = getShadowRoot().querySelector<T>(selector);

        if (!foundElement) {
            throw new Error(`Expected element matching selector ${selector}`);
        }

        return foundElement;
    }

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvChipSelectorTag)).toBeInstanceOf(FvChipSelector);
    });

    it('adds a value when an option is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        const option = getRequiredElement<HTMLElement>('[data-option-value="Active"]');
        option.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Active');
        expect(element.shadowRoot?.querySelectorAll(chipTag).length).toBe(1);
    });

    it('removes the selected value when a chip remove event is raised', async () => {
        ({ element, connect, disconnect } = await setup());
        element.selectedValues = 'Active,Paused';
        await connect();
        await waitForUpdatesAsync();

        const chip = getRequiredElement<HTMLElement>(`${chipTag}[data-chip-value="Paused"]`);
        chip.dispatchEvent(new Event('remove', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Active');
    });

    it('filters the option list based on the inline text input', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'main';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const visibleOptions = Array.from(
            element.shadowRoot?.querySelectorAll<HTMLElement>(`.chip-selector-option`) ?? []
        ).map(option => option.textContent?.trim());

        expect(visibleOptions).toEqual(['Maintenance due']);
    });

    it('filters the option list with case-insensitive diacritic-insensitive matching', async () => {
        ({ element, connect, disconnect } = await fixture<FvChipSelector>(html`
            <${fvChipSelectorTag}
                label="Status"
                options="Café,Resume,naive"
            ></${fvChipSelectorTag}>
        `));
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'CAFE';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const visibleOptions = Array.from(
            element.shadowRoot?.querySelectorAll<HTMLElement>(`.chip-selector-option`) ?? []
        ).map(option => option.textContent?.trim());

        expect(visibleOptions).toEqual(['Café']);
    });

    it('renders an explicit custom-value action when custom values are enabled and there is no exact match', async () => {
        ({ element, connect, disconnect } = await setup());
        element.allowCustomValues = true;
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'Paused later';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const createOption = element.shadowRoot?.querySelector<HTMLButtonElement>('.chip-selector-create-option');

        expect(createOption?.textContent?.trim()).toBe("Add 'Paused later'");
    });

    it('does not render a custom-value action when the search term exactly matches an option', async () => {
        ({ element, connect, disconnect } = await setup());
        element.allowCustomValues = true;
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'Active';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.chip-selector-create-option')).toBeNull();
    });

    it('adds a custom value when the explicit custom-value action is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        element.allowCustomValues = true;
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'Paused later';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const createOption = getRequiredElement<HTMLElement>('.chip-selector-create-option');
        createOption.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Paused later');
    });

    it('adds a custom value with Enter when the create option has focus', async () => {
        ({ element, connect, disconnect } = await setup());
        element.allowCustomValues = true;
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'Paused later';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const createOption = getRequiredElement<HTMLElement>('.chip-selector-create-option');
        createOption.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Paused later');
    });

    it('renders a standard label for the control', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.shadowRoot?.querySelector('.label')?.textContent?.trim()).toBe('Status');
    });

    it('adds a value by clicking an option in the menu', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.value = 'a';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        const option = getRequiredElement<HTMLElement>('[data-option-value="Paused"]');
        option.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Paused');
    });

    it('allows printable keydowns to use the browser default text entry behavior', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const event = new KeyboardEvent('keydown', {
            key: 'a',
            cancelable: true
        });

        const result = element.handleInputKeydown(event);

        expect(result).toBeTrue();
        expect(event.defaultPrevented).toBeFalse();
    });

    it('does not open or change selection when disabled', async () => {
        ({ element, connect, disconnect } = await setup());
        element.disabled = true;
        await connect();

        const menuButton = getRequiredElement<HTMLElement>('.chip-selector-menu-button');
        menuButton.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(element.selectedValues).toBe('');
    });

    it('opens the list when the menu button is clicked and keeps the button checked', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const menuButton = getRequiredElement<HTMLElement & { checked?: boolean }>('.chip-selector-menu-button');
        menuButton.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
        expect(menuButton.checked).toBeTrue();
    });

    it('toggles open state and checked state on successive menu button clicks', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const menuButton = getRequiredElement<HTMLElement & { checked?: boolean }>('.chip-selector-menu-button');

        menuButton.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
        expect(menuButton.checked).toBeTrue();

        menuButton.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(menuButton.checked).toBeFalse();
    });

    it('checks the menu button when opening from field click', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const field = getRequiredElement<HTMLElement>('.chip-selector-field');
        const menuButton = getRequiredElement<HTMLElement & { checked?: boolean }>('.chip-selector-menu-button');

        field.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
        expect(menuButton.checked).toBeTrue();
    });

    it('turns the menu button back off when the menu closes from an outside click', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const menuButton = getRequiredElement<HTMLElement & { checked?: boolean }>('.chip-selector-menu-button');
        menuButton.click();
        await waitForUpdatesAsync();

        document.body.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(menuButton.checked).toBeFalse();
    });

    it('turns the menu button back off when escape closes the menu', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        const menuButton = getRequiredElement<HTMLElement & { checked?: boolean }>('.chip-selector-menu-button');

        menuButton.click();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(menuButton.checked).toBeFalse();
    });

    it('defaults to a 300px host width', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(getComputedStyle(element).width).toBe('300px');
    });

    it('keeps the same host width after chips are selected', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const initialWidth = getComputedStyle(element).width;

        element.selectedValues = 'Active,Paused,Error,Maintenance due';
        await waitForUpdatesAsync();

        expect(getComputedStyle(element).width).toBe(initialWidth);
    });

    it('keeps the inline input on the current line until chips need to wrap', async () => {
        ({ element, connect, disconnect } = await setup());
        element.style.width = '180px';
        element.selectedValues = 'Maintenance due';
        await connect();
        await waitForUpdatesAsync();

        const chip = getRequiredElement<HTMLElement>(`${chipTag}[data-chip-value="Maintenance due"]`);
        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');

        expect(input.offsetTop).toBeLessThan(chip.offsetTop + chip.offsetHeight);
        expect(chip.offsetTop).toBeLessThan(input.offsetTop + input.offsetHeight);
    });

    it('constrains a selected chip to the chip-selector width when the control is narrow', async () => {
        ({ element, connect, disconnect } = await fixture<FvChipSelector>(html`
            <${fvChipSelectorTag}
                label="Status"
                options="A very long chip value that should truncate to fit the chip selector width"
                selected-values="A very long chip value that should truncate to fit the chip selector width"
            ></${fvChipSelectorTag}>
        `));
        element.style.width = '180px';
        await connect();
        await waitForUpdatesAsync();

        const selectionArea = getRequiredElement<HTMLElement>('.chip-selector-selection-area');
        const chip = getRequiredElement<HTMLElement>(chipTag);

        expect(chip.offsetWidth).toBeLessThanOrEqual(selectionArea.clientWidth);
    });

    it('keeps the menu button top aligned when the selected chips wrap', async () => {
        ({ element, connect, disconnect } = await setup());
        element.style.width = '180px';
        element.selectedValues = 'Active,Paused,Error';
        await connect();
        await waitForUpdatesAsync();

        const firstChip = getRequiredElement<HTMLElement>(`${chipTag}[data-chip-value="Active"]`);
        const menuButton = getRequiredElement<HTMLElement>('.chip-selector-menu-button');

        expect(menuButton.offsetTop).toBe(firstChip.offsetTop);
    });

    it('emits a change event with the updated selection when a value is added', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const changeSpy = jasmine.createSpy('change');
        let selectedValuesDetail: string[] | undefined;
        element.addEventListener('change', event => {
            selectedValuesDetail = (event as CustomEvent<{ selectedValues: string[] }>).detail.selectedValues;
            changeSpy();
        });

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        const option = getRequiredElement<HTMLElement>('[data-option-value="Active"]');
        option.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(selectedValuesDetail).toEqual(['Active']);
    });

    it('emits a change event with the updated selection when a value is removed', async () => {
        ({ element, connect, disconnect } = await setup());
        element.selectedValues = 'Active,Paused';
        await connect();
        await waitForUpdatesAsync();

        const changeSpy = jasmine.createSpy('change');
        let selectedValuesDetail: string[] | undefined;
        element.addEventListener('change', event => {
            selectedValuesDetail = (event as CustomEvent<{ selectedValues: string[] }>).detail.selectedValues;
            changeSpy();
        });

        const chip = getRequiredElement<HTMLElement>(`${chipTag}[data-chip-value="Paused"]`);
        chip.dispatchEvent(new Event('remove', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(selectedValuesDetail).toEqual(['Active']);
    });

    it('removes the last chip when Backspace is pressed with an empty filter', async () => {
        ({ element, connect, disconnect } = await setup());
        element.selectedValues = 'Active,Paused';
        await connect();
        await waitForUpdatesAsync();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Active');
    });

    it('shows the placeholder when no values are selected', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        expect(input.placeholder).toBe('Select values');
    });

    it('hides the placeholder when values are selected', async () => {
        ({ element, connect, disconnect } = await setup());
        element.selectedValues = 'Active';
        await connect();
        await waitForUpdatesAsync();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        expect(input.placeholder).toBe('');
    });

    it('sets activeOptionIndex to 0 on first ArrowDown when dropdown is open', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(0);
        const activeOption = element.shadowRoot?.querySelector<HTMLElement>(`[aria-selected='true']`);
        expect(activeOption?.getAttribute('data-option-value')).toBe('Active');
    });

    it('advances activeOptionIndex on successive ArrowDown presses', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(1);
        const activeOption = element.shadowRoot?.querySelector<HTMLElement>(`[aria-selected='true']`);
        expect(activeOption?.getAttribute('data-option-value')).toBe('Paused');
    });

    it('does not go below index 0 on ArrowUp', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(0);
    });

    it('selects the active option when Enter is pressed', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.selectedValues).toBe('Active');
    });

    it('resets activeOptionIndex when the filter text changes', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(0);

        input.value = 'a';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(-1);
    });

    it('resets activeOptionIndex when the dropdown closes', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.activeOptionIndex).toBe(-1);
    });

    it('updates aria-activedescendant as keyboard active option changes', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.chip-selector-input');
        input.focus();
        await waitForUpdatesAsync();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await waitForUpdatesAsync();

        expect(input.getAttribute('aria-activedescendant')).toBe(`${element.menuId}-option-0`);

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitForUpdatesAsync();

        expect(input.getAttribute('aria-activedescendant')).toBeNull();
    });
});