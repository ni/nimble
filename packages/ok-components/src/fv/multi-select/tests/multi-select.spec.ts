import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitAnimationFrame, waitForEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import type { Checkbox } from '@ni/nimble-components/dist/esm/checkbox';
import { fixture } from '../../../utilities/tests/fixture';
import { FvMultiSelect, fvMultiSelectTag } from '..';

describe('FvMultiSelect', () => {
    let element: FvMultiSelect;
    let disconnect: () => Promise<void>;

    function query<T extends HTMLElement>(selector: string): T {
        const result = element.shadowRoot?.querySelector<T>(selector);
        if (!result) {
            throw new Error(`Missing multi-select element: ${selector}`);
        }
        return result;
    }

    async function open(): Promise<void> {
        const loaded = element.region.initialLayoutComplete
            ? Promise.resolve()
            : waitForEvent(element.region, 'loaded');
        query<HTMLButtonElement>('.control').click();
        await loaded;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.activeElement).toBe(
            element.filterable ? query('input') : query('.listbox')
        );
    }

    async function search(value: string): Promise<void> {
        const input = query<HTMLInputElement>('input');
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
    }

    async function key(value: string, target: HTMLElement = query('.listbox')): Promise<KeyboardEvent> {
        const event = new KeyboardEvent('keydown', {
            key: value, bubbles: true, composed: true, cancelable: true
        });
        target.dispatchEvent(event);
        await waitForUpdatesAsync();
        return event;
    }

    beforeEach(async () => {
        const testFixture = await fixture<FvMultiSelect>(html`
            <${fvMultiSelectTag} label="Status" placeholder="Select statuses" filterable></${fvMultiSelectTag}>
        `);
        element = testFixture.element;
        disconnect = testFixture.disconnect;
        element.options = [
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused', disabled: true },
            { value: 'cafe', label: 'Caf\u00e9' },
            { value: 'maintenance', label: 'Maintenance due' }
        ];
        await testFixture.connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('registers the custom element', () => {
        expect(document.createElement(fvMultiSelectTag)).toBeInstanceOf(FvMultiSelect);
    });

    it('delegates host focus to the trigger without opening the popup', async () => {
        element.clearable = true;
        element.selectedValues = ['active'];
        await waitForUpdatesAsync();
        element.focus();
        expect(element.shadowRoot?.activeElement).toBe(query('.control'));
        expect(element.open).toBeFalse();
    });

    it('focuses the trigger when an external label is activated', async () => {
        element.clearable = true;
        element.selectedValues = ['active'];
        await waitForUpdatesAsync();
        element.id = 'external-label-multi-select';
        const label = document.createElement('label');
        label.htmlFor = element.id;
        label.textContent = 'External status';
        element.before(label);
        try {
            label.click();
            expect(element.shadowRoot?.activeElement).toBe(query('.control'));
            expect(element.open).toBeFalse();
            query('.control').blur();
            element.disabled = true;
            await waitForUpdatesAsync();
            label.click();
            expect(element.shadowRoot?.activeElement).not.toBe(query('.control'));
        } finally {
            label.remove();
        }
    });

    it('does not delegate focus when explicitly disabled or in a disabled fieldset', async () => {
        element.disabled = true;
        await waitForUpdatesAsync();
        element.focus();
        expect(element.shadowRoot?.activeElement).toBeNull();
        element.disabled = false;
        const fieldset = document.createElement('fieldset');
        element.before(fieldset);
        fieldset.appendChild(element);
        fieldset.disabled = true;
        await waitForUpdatesAsync();
        element.focus();
        expect(element.shadowRoot?.activeElement).toBeNull();
        fieldset.disabled = false;
        await waitForUpdatesAsync();
        element.focus();
        expect(element.shadowRoot?.activeElement).toBe(query('.control'));
        fieldset.before(element);
        fieldset.remove();
    });

    it('toggles options once per click, emits events, and stays open', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        await open();
        query('.option').click();
        await waitForUpdatesAsync();
        expect(element.selectedValues).toEqual(['active']);
        expect(query('.option').getAttribute('aria-selected')).toBe('true');
        expect(query<Checkbox>('nimble-checkbox').checked).toBeTrue();
        expect(query('nimble-checkbox').hasAttribute('inert')).toBeTrue();
        expect(element.open).toBeTrue();
        query('.option').click();
        await waitForUpdatesAsync();
        expect(element.selectedValues).toEqual([]);
        expect(input).toHaveBeenCalledTimes(2);
        expect(change).toHaveBeenCalledTimes(2);
    });

    it('updates the displayed selection without emitting events for property changes', async () => {
        const change = jasmine.createSpy('change');
        element.addEventListener('change', change);
        element.selectedValues = ['active', 'cafe'];
        await waitForUpdatesAsync();
        expect(query('.selected-value').textContent?.trim()).toBe('Active, Caf\u00e9');
        expect(query('.selected-value').title).toBe('Active, Caf\u00e9');
        expect(query('.control').getAttribute('aria-labelledby')).toBe(
            `${query('.label').id} ${query('.selected-value').id}`
        );
        expect(change).not.toHaveBeenCalled();
    });

    it('uses the displayed value as its accessible name when no label is supplied', async () => {
        element.label = '';
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.label')).toBeNull();
        expect(query('.control').getAttribute('aria-labelledby')).toBe(query('.selected-value').id);
    });

    it('updates the search active descendant after navigation and filtering', async () => {
        await open();
        const input = query('input');
        expect(input.getAttribute('aria-activedescendant')).toBe(element.activeOptionId);
        await key('ArrowDown', input);
        expect(element.activeIndex).toBe(2);
        expect(input.getAttribute('aria-activedescendant')).toBe(element.activeOptionId);
        await search('maintenance');
        expect(element.activeIndex).toBe(0);
        expect(input.getAttribute('aria-activedescendant')).toBe(element.activeOptionId);
        await search('missing');
        expect(input.hasAttribute('aria-activedescendant')).toBeFalse();
    });

    it('restores the trigger binding after removing initial disabled inside a disabled fieldset', async () => {
        const fieldset = document.createElement('fieldset');
        fieldset.disabled = true;
        const initial = document.createElement(fvMultiSelectTag);
        initial.disabled = true;
        fieldset.appendChild(initial);
        document.body.appendChild(fieldset);
        try {
            await waitForUpdatesAsync();
            initial.disabled = false;
            await waitForUpdatesAsync();
            expect(initial.control.disabled).toBeTrue();
            fieldset.disabled = false;
            await waitForUpdatesAsync();
            expect(initial.effectiveDisabled).toBeFalse();
            expect(initial.control.disabled).toBeFalse();
        } finally {
            fieldset.remove();
        }
    });

    it('preserves keyboard activation state and clears it only for pointer activation', async () => {
        element.filterable = false;
        await waitForUpdatesAsync();
        await key('Enter', query('.control'));
        query('.control').click();
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        expect(element.keyboardNavigation).toBeTrue();
        expect(query('.popup').classList.contains('keyboard-navigation')).toBeTrue();
        await key('Escape');
        await key(' ', query('.control'));
        query('.control').click();
        await waitForUpdatesAsync();
        expect(element.keyboardNavigation).toBeTrue();
        await key('Escape');
        query('.control').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        query('.control').click();
        await waitForUpdatesAsync();
        expect(element.keyboardNavigation).toBeFalse();
    });

    it('supports values containing commas without parsing them', async () => {
        element.options = [{ value: 'a,b', label: 'A, B' }];
        await open();
        query('.option').click();
        expect(element.selectedValues).toEqual(['a,b']);
    });

    it('only shows the clear button when clearable, enabled, and nonempty', async () => {
        expect(element.clearable).toBeFalse();
        element.selectedValues = ['active'];
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.clear-button')).toBeNull();
        element.setAttribute('clearable', '');
        await waitForUpdatesAsync();
        expect(element.clearable).toBeTrue();
        expect(query('.clear-button').getAttribute('aria-label')).toBe('Clear selection');
        expect(query('.clear-button').getAttribute('tabindex')).toBe('-1');
        expect(query('.control').contains(query('.clear-button'))).toBeFalse();
        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.clear-button')).toBeNull();
        element.disabled = false;
        element.selectedValues = [];
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.clear-button')).toBeNull();
    });

    it('clears all values once, closes the popup, and restores trigger focus', async () => {
        element.clearable = true;
        element.selectedValues = ['active', 'paused', 'missing'];
        const events: string[] = [];
        element.addEventListener('input', event => {
            events.push(event.type);
            expect(event.bubbles).toBeTrue();
            expect(event.composed).toBeTrue();
            expect(element.selectedValues).toEqual([]);
        });
        element.addEventListener('change', event => events.push(event.type));
        await open();
        await search('cafe');
        query('.clear-button').click();
        await waitForUpdatesAsync();
        expect(element.selectedValues).toEqual([]);
        expect(element.open).toBeFalse();
        expect(element.filter).toBe('');
        expect(element.shadowRoot?.activeElement).toBe(query('.control'));
        expect(query('.selected-value').textContent?.trim()).toBe('Select statuses');
        expect(element.shadowRoot?.querySelector('.clear-button')).toBeNull();
        expect(events).toEqual(['input', 'change']);
        element.clearSelection();
        expect(events).toEqual(['input', 'change']);
    });

    it('does not open a closed popup when clearing', async () => {
        element.clearable = true;
        element.selectedValues = ['active'];
        await waitForUpdatesAsync();
        query('.clear-button').click();
        expect(element.selectedValues).toEqual([]);
        expect(element.open).toBeFalse();
    });

    it('clears on Escape only when closed, clearable, and enabled', async () => {
        element.selectedValues = ['active'];
        await key('Escape', query('.control'));
        expect(element.selectedValues).toEqual(['active']);
        element.clearable = true;
        await open();
        await key('Escape', query('input'));
        expect(element.selectedValues).toEqual(['active']);
        expect(element.open).toBeFalse();
        element.disabled = true;
        element.clearSelection();
        expect(element.selectedValues).toEqual(['active']);
        element.disabled = false;
        await key('Escape', query('.control'));
        expect(element.selectedValues).toEqual([]);
    });

    it('filters case- and diacritic-insensitively without losing selections or emitting selection events', async () => {
        element.selectedValues = ['active'];
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        await open();
        await search('CAFE');
        expect(element.visibleOptions.map(option => option.value)).toEqual(['cafe']);
        expect(element.selectedValues).toEqual(['active']);
        query('input').dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        expect(input).not.toHaveBeenCalled();
        expect(change).not.toHaveBeenCalled();
        query('.option').click();
        await search('');
        expect(element.selectedValues).toEqual(['active', 'cafe']);
        expect(element.shadowRoot?.querySelectorAll('[role="option"][aria-selected="true"]').length).toBe(2);
    });

    it('shows no-results feedback and handles navigation when no options match', async () => {
        await open();
        await search('missing');
        expect(query('[role="status"]').textContent?.trim()).toBe('No items found');
        expect(element.activeOptionId).toBeNull();
        await key('ArrowDown');
        await key('Enter');
        expect(element.selectedValues).toEqual([]);
    });

    it('skips disabled options and keeps active state separate from selection', async () => {
        await open();
        expect(element.keyboardNavigation).toBeFalse();
        await key('ArrowDown');
        expect(element.keyboardNavigation).toBeTrue();
        expect(element.activeIndex).toBe(2);
        expect(element.selectedValues).toEqual([]);
        await key('Enter');
        expect(element.selectedValues).toEqual(['cafe']);
        await key('Home');
        expect(element.activeIndex).toBe(0);
        await key('End');
        expect(element.activeIndex).toBe(3);
        await key('ArrowUp');
        expect(element.activeIndex).toBe(2);
    });

    it('clears keyboard navigation on pointer selection and restores it on arrow navigation', async () => {
        await open();
        await key('ArrowDown');
        query('.option').click();
        expect(element.keyboardNavigation).toBeFalse();
        expect(element.selectedValues).toEqual(['active']);
        await key('ArrowDown');
        expect(element.keyboardNavigation).toBeTrue();
        query('.popup').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(element.keyboardNavigation).toBeFalse();
    });
    it('does not toggle disabled options or move active focus to them on click', async () => {
        await open();
        const disabled = query('[aria-disabled="true"]');
        disabled.click();
        expect(element.selectedValues).toEqual([]);
        expect(element.activeIndex).toBe(0);
    });

    it('allows spaces and cursor navigation in search, but Enter toggles the active result', async () => {
        await open();
        const input = query<HTMLInputElement>('input');
        expect((await key(' ', input)).defaultPrevented).toBeFalse();
        expect((await key('Home', input)).defaultPrevented).toBeFalse();
        expect((await key('End', input)).defaultPrevented).toBeFalse();
        await search('due');
        await key('Enter', input);
        expect(element.selectedValues).toEqual(['maintenance']);
        expect(element.open).toBeTrue();
    });

    it('does not navigate, select, or close while composing search text', async () => {
        await open();
        const activeIndex = element.activeIndex;
        const input = query('input');
        for (const value of ['ArrowDown', 'Enter', 'Escape']) {
            const event = new KeyboardEvent('keydown', {
                key: value, isComposing: true, bubbles: true, cancelable: true
            });
            input.dispatchEvent(event);
            expect(event.defaultPrevented).toBeFalse();
        }
        expect(element.activeIndex).toBe(activeIndex);
        expect(element.selectedValues).toEqual([]);
        expect(element.open).toBeTrue();
    });

    it('closes on Escape, retains selections, resets search, and restores trigger focus', async () => {
        await open();
        await search('cafe');
        await key('Enter', query('input'));
        await key('Escape', query('input'));
        expect(element.open).toBeFalse();
        expect(element.filter).toBe('');
        expect(element.selectedValues).toEqual(['cafe']);
        expect(element.shadowRoot?.activeElement).toBe(query('.control'));
        await open();
        expect(query<HTMLInputElement>('input').value).toBe('');
        expect(element.visibleOptions.length).toBe(4);
    });

    it('does not trap Tab and closes the popup', async () => {
        await open();
        const event = new KeyboardEvent('keydown', {
            key: 'Tab', bubbles: true, cancelable: true
        });
        query('input').dispatchEvent(event);
        expect(element.region.hidden).toBeTrue();
        expect(event.defaultPrevented).toBeFalse();
        expect(element.open).toBeFalse();
    });

    it('closes on outside click and focus leaving the component', async () => {
        await open();
        document.body.click();
        expect(element.open).toBeFalse();
        await waitForUpdatesAsync();
        await open();
        query('input').dispatchEvent(new FocusEvent('focusout', {
            bubbles: true, composed: true, relatedTarget: document.body
        }));
        expect(element.open).toBeFalse();
    });

    it('reopens at the updated anchor position without a first-frame jump', async () => {
        element.region.verticalPositioningMode = 'locktodefault';
        await open();
        await key('Escape', query('input'));
        element.style.marginLeft = '100px';
        element.style.marginTop = '40px';
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        const loaded = waitForEvent(element.region, 'loaded');
        element.open = true;
        await waitAnimationFrame();
        if (element.region.style.opacity !== '0') {
            const anchorBounds = element.controlField.getBoundingClientRect();
            const regionBounds = element.region.getBoundingClientRect();
            expect(Math.abs(regionBounds.left - anchorBounds.left)).toBeLessThan(1);
            expect(Math.abs(regionBounds.top - anchorBounds.bottom)).toBeLessThan(1);
        }
        await loaded;
        const anchorBounds = element.controlField.getBoundingClientRect();
        const regionBounds = element.region.getBoundingClientRect();
        expect(Math.abs(regionBounds.left - anchorBounds.left)).toBeLessThan(1);
        expect(Math.abs(regionBounds.top - anchorBounds.bottom)).toBeLessThan(1);
    });

    it('prevents opening or toggling when disabled and closes if disabled while open', async () => {
        await open();
        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        query<HTMLButtonElement>('.control').click();
        element.toggleOption(element.options[0]!);
        element.open = true;
        expect(element.open).toBeFalse();
        expect(element.selectedValues).toEqual([]);
    });

    it('handles replacing options and selections while filtered', async () => {
        await open();
        await search('new');
        element.options = [{ value: 'new', label: 'New option' }];
        element.selectedValues = ['new'];
        await waitForUpdatesAsync();
        expect(element.activeIndex).toBe(0);
        expect(query('.option').getAttribute('aria-selected')).toBe('true');
        expect(query('.selected-value').textContent?.trim()).toBe('New option');
        element.options = [];
        await waitForUpdatesAsync();
        expect(element.activeOptionId).toBeNull();
        expect(element.selectedValues).toEqual(['new']);
    });

    it('supports opening, Space selection, and listbox focus without search', async () => {
        element.filterable = false;
        await waitForUpdatesAsync();
        const loaded = element.region.initialLayoutComplete
            ? Promise.resolve()
            : waitForEvent(element.region, 'loaded');
        await key('ArrowUp', query('.control'));
        await loaded;
        expect(element.activeIndex).toBe(3);
        expect(element.shadowRoot?.activeElement).toBe(query('.listbox'));
        await key(' ');
        expect(element.selectedValues).toEqual(['maintenance']);
        expect(query('.listbox').getAttribute('aria-multiselectable')).toBe('true');
        expect(query('.listbox').getAttribute('aria-activedescendant')).toBe(element.activeOptionId);
        expect(element.shadowRoot?.querySelector('input')).toBeNull();
    });

    it('moves focus correctly when search is toggled while open', async () => {
        await open();
        element.filterable = false;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.activeElement).toBe(query('.listbox'));
        element.filterable = true;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.activeElement).toBe(query('input'));
    });

    parameterizeSpec([
        { name: 'without search', filterable: false },
        { name: 'with search', filterable: true }
    ], (spec, name, { filterable }) => {
        spec(`keeps the active row visible after reopening and replacing options ${name}`, async () => {
            element.filterable = filterable;
            element.options = Array.from({ length: 30 }, (_, index) => ({
                value: `${index}`, label: `Option ${index}`
            }));
            await open();
            const listbox = query('.listbox');
            await key('ArrowUp', query('.control'));
            await waitAnimationFrame();
            expect(element.activeIndex).toBe(29);
            expect(listbox.scrollTop).toBeGreaterThan(0);
            await key('Escape', filterable ? query('input') : listbox);
            await key('ArrowDown', query('.control'));
            await waitAnimationFrame();
            expect(element.activeIndex).toBe(0);
            expect(listbox.scrollTop).toBe(0);
            const activeRow = query('.option.active').getBoundingClientRect();
            const listboxBounds = listbox.getBoundingClientRect();
            expect(activeRow.top).toBeGreaterThanOrEqual(listboxBounds.top);
            expect(activeRow.bottom).toBeLessThanOrEqual(listboxBounds.bottom);
            await key('ArrowUp', query('.control'));
            await waitAnimationFrame();
            element.options = [...element.options];
            await waitForUpdatesAsync();
            await waitAnimationFrame();
            expect(element.activeIndex).toBe(0);
            expect(listbox.scrollTop).toBe(0);
        });
    });

    it('handles an all-disabled option set without changing selection', async () => {
        element.options = [{ value: 'disabled', label: 'Disabled', disabled: true }];
        await open();
        await key('ArrowDown');
        await key('Enter');
        expect(element.activeOptionId).toBeNull();
        expect(element.selectedValues).toEqual([]);
    });

    describe('native forms', () => {
        let form: HTMLFormElement;

        beforeEach(() => {
            form = document.createElement('form');
            document.body.appendChild(form);
            form.appendChild(element);
            element.name = 'status';
        });

        afterEach(() => {
            form.remove();
        });

        it('submits each selected value under the same name without encoding delimiters', () => {
            element.selectedValues = ['active', 'a,b', 'missing', ''];
            expect(new FormData(form).getAll('status')).toEqual(['active', 'a,b', 'missing', '']);
            element.name = 'renamed';
            expect(new FormData(form).getAll('status')).toEqual([]);
            expect(new FormData(form).getAll('renamed')).toEqual(['active', 'a,b', 'missing', '']);
            element.name = '';
            expect(Array.from(new FormData(form).entries())).toEqual([]);
        });

        it('omits empty and disabled selections and follows disabled fieldsets', async () => {
            expect(new FormData(form).getAll('status')).toEqual([]);
            element.selectedValues = ['active'];
            element.disabled = true;
            expect(new FormData(form).getAll('status')).toEqual([]);
            element.disabled = false;
            const fieldset = document.createElement('fieldset');
            form.appendChild(fieldset);
            fieldset.appendChild(element);
            fieldset.disabled = true;
            await waitForUpdatesAsync();
            expect(element.effectiveDisabled).toBeTrue();
            expect(query<HTMLButtonElement>('.control').disabled).toBeTrue();
            element.open = true;
            element.toggleOption(element.options[0]!);
            expect(element.open).toBeFalse();
            expect(element.selectedValues).toEqual(['active']);
            expect(element.hasAttribute('disabled')).toBeFalse();
            expect(new FormData(form).getAll('status')).toEqual([]);
            fieldset.disabled = false;
            await waitForUpdatesAsync();
            expect(element.effectiveDisabled).toBeFalse();
            expect(new FormData(form).getAll('status')).toEqual(['active']);
        });

        it('updates submitted entries after selection and clearing without submitting search text', async () => {
            element.clearable = true;
            await open();
            await search('cafe');
            query('.option').click();
            expect(new FormData(form).getAll('status')).toEqual(['cafe']);
            element.clearSelection();
            expect(new FormData(form).getAll('status')).toEqual([]);
        });

        it('validates required selections and excludes disabled controls from validation', async () => {
            element.required = true;
            await waitForUpdatesAsync();
            expect(element.validity.valueMissing).toBeTrue();
            expect(form.checkValidity()).toBeFalse();
            expect(query('.listbox').getAttribute('aria-required')).toBe('true');
            element.selectedValues = [''];
            expect(form.checkValidity()).toBeTrue();
            element.selectedValues = ['active'];
            expect(element.validity.valueMissing).toBeFalse();
            expect(form.checkValidity()).toBeTrue();
            element.selectedValues = [];
            element.disabled = true;
            await waitForUpdatesAsync();
            expect(form.checkValidity()).toBeTrue();
            element.disabled = false;
            await waitForUpdatesAsync();
            expect(form.checkValidity()).toBeFalse();
            const fieldset = document.createElement('fieldset');
            fieldset.disabled = true;
            form.appendChild(fieldset);
            fieldset.appendChild(element);
            await waitForUpdatesAsync();
            expect(form.checkValidity()).toBeTrue();
            fieldset.disabled = false;
            await waitForUpdatesAsync();
            expect(form.checkValidity()).toBeFalse();
            element.required = false;
            expect(form.checkValidity()).toBeTrue();
        });

        it('does not implicitly submit the form when using Enter in the dropdown', async () => {
            const submit = document.createElement('button');
            submit.type = 'submit';
            const click = jasmine.createSpy('click').and.callFake((event: Event) => event.preventDefault());
            submit.addEventListener('click', click);
            form.appendChild(submit);
            query('.control').dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            await open();
            query('.filter-input').dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            expect(click).not.toHaveBeenCalled();
        });

        it('resets to values assigned before first connection without emitting events', async () => {
            const initial = document.createElement(fvMultiSelectTag);
            initial.name = 'initial';
            initial.selectedValues = ['a,b', 'active'];
            form.appendChild(initial);
            initial.selectedValues = ['changed'];
            initial.remove();
            form.appendChild(initial);
            const change = jasmine.createSpy('change');
            const input = jasmine.createSpy('input');
            initial.addEventListener('change', change);
            initial.addEventListener('input', input);
            initial.open = true;
            await waitForUpdatesAsync();
            form.reset();
            expect(initial.selectedValues).toEqual(['a,b', 'active']);
            expect(initial.open).toBeFalse();
            expect(new FormData(form).getAll('initial')).toEqual(['a,b', 'active']);
            expect(change).not.toHaveBeenCalled();
            expect(input).not.toHaveBeenCalled();
        });
    });
});
