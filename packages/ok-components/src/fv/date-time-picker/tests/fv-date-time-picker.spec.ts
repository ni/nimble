import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Direction, direction, lang, themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { fixture } from '../../../utilities/tests/fixture';
import { FvDateTimePicker, fvDateTimePickerTag } from '..';
import { FvDateTimePickerAppearance } from '../types';
import { fvDateTimePickerLabelProviderTag } from '../label-provider';
import { today as calendarToday } from '../models/date-time';

describe('FvDateTimePicker', () => {
    let element: FvDateTimePicker;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        const view = await fixture<FvDateTimePicker>(html`
            <${fvDateTimePickerTag} name="scheduled" value="2024-11-13T14:25">Scheduled time</${fvDateTimePickerTag}>
        `);
        element = view.element;
        lang.setValueFor(element, 'en-US');
        disconnect = view.disconnect;
        await view.connect();
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        lang.deleteValueFor(element);
        direction.deleteValueFor(element);
        await disconnect();
    });

    it('constructs a labeled, form-associated field', () => {
        expect(element).toBeInstanceOf(FvDateTimePicker);
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:25 PM');
        expect(element.control.labels?.[0]?.getAttribute('for')).toBe('control');
        expect(element.checkValidity()).toBeTrue();
    });

    it('opens the selected month with a six-week grid and selected day', async () => {
        element.trigger.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        expect(element.visibleDate.getUTCMonth()).toBe(10);
        expect(element.shadowRoot!.querySelector(selectTag)!.value).toBe('10');
        expect(element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.year')!.value).toBe('2024');
        expect(element.shadowRoot!.querySelectorAll(`.calendar-header ${buttonTag}`).length).toBe(2);
        expect(element.shadowRoot!.querySelectorAll('[role="gridcell"]').length).toBe(42);
        expect(element.shadowRoot!.querySelector('[aria-selected="true"] button')?.textContent?.trim()).toBe('13');
        expect(element.shadowRoot!.querySelector('[data-date="2024-11-13"]')?.getAttribute('tabindex')).toBe('0');
    });

    it('commits date selection, preserving time and emitting one event pair', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        element.open = true;
        await waitForUpdatesAsync();
        element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-21"]')!.click();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-21T14:25');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/21/2024 02:25 PM');
        expect(input).toHaveBeenCalledTimes(1);
        expect(change).toHaveBeenCalledTimes(1);
    });

    it('marks today independently of selection', async () => {
        const today = calendarToday();
        element.value = `${element.dateKey(today)}T14:25`;
        element.open = true;
        await waitForUpdatesAsync();
        const current = element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-current="date"]')!;
        expect(current.dataset.date).toBe(element.dateKey(today));
        expect(current.closest('[role="gridcell"]')!.getAttribute('aria-selected')).toBe('true');
        const next = new Date(today);
        next.setUTCDate(today.getUTCDate() === 1 ? 2 : today.getUTCDate() - 1);
        element.selectDay(next);
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('[aria-selected="true"] button')!.getAttribute('data-date')).toBe(element.dateKey(next));
        expect(element.shadowRoot!.querySelector('[aria-current="date"]')!.getAttribute('data-date')).toBe(element.dateKey(today));
    });

    it('selects an adjacent-month day and updates the displayed month', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const day = element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-10-31"]')!;
        expect(day.hasAttribute('data-outside-month')).toBeTrue();
        expect(day.disabled).toBeFalse();
        day.click();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-10-31T14:25');
        expect(element.visibleDate.getUTCMonth()).toBe(9);
        expect(element.shadowRoot!.querySelector('[aria-selected="true"] button')!.hasAttribute('data-outside-month')).toBeFalse();
    });

    it('commits time changes without leaking the inner change event', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        const time = element.timeField!;
        time.value = '09:07 AM';
        time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        time.dispatchEvent(new Event('change', { bubbles: true }));
        expect(element.value).toBe('2024-11-13T09:07');
        expect(input).toHaveBeenCalledTimes(1);
        expect(change).toHaveBeenCalledTimes(1);
    });

    it('keeps direct input, form value, and validity in sync', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        await waitForUpdatesAsync();
        element.control.value = '02/29/2024 11:59 PM';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-02-29T23:59');
        expect(element.checkValidity()).toBeTrue();
        expect(new FormData(form).get('scheduled')).toBe(element.value);
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T14:25');
    });

    it('masks pasted date/time text and synchronizes the resulting value', async () => {
        element.value = '';
        await waitForUpdatesAsync();
        element.control.setSelectionRange(0, 0);
        const paste = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        Object.defineProperty(paste, 'clipboardData', {
            value: { getData: () => '02/29/2024 11:59 PM' }
        });
        expect(element.control.dispatchEvent(paste)).toBeFalse();
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('02/29/2024 11:59 PM');
        expect(element.value).toBe('2024-02-29T23:59');
        expect(element.checkValidity()).toBeTrue();
    });

    parameterizeSpec([
        { name: 'canonical date/time', text: '2024-02-29T23:59', value: '2024-02-29T23:59', locale: 'en-US', dateOnly: false },
        { name: 'space separator and whitespace', text: ' \n2024-02-29 23:59\t', value: '2024-02-29T23:59', locale: 'de-DE', dateOnly: false },
        { name: 'date defaulting to midnight', text: '2024-02-29', value: '2024-02-29T00:00', locale: 'en-US', dateOnly: false },
        { name: 'seconds', text: '2024-02-29T23:59:37', value: '2024-02-29T23:59:37', locale: 'en-US', dateOnly: false },
        { name: 'fractional seconds', text: '2024-02-29T23:59:37.125', value: '2024-02-29T23:59:37.125', locale: 'de-DE', dateOnly: false },
        { name: 'single fractional digit', text: '2024-02-29T23:59:00.1', value: '2024-02-29T23:59:00.1', locale: 'en-US', dateOnly: false },
        { name: 'minimum year', text: '0001-01-01T00:00', value: '0001-01-01T00:00', locale: 'en-GB', dateOnly: false },
        { name: 'maximum year', text: '9999-12-31T23:59', value: '9999-12-31T23:59', locale: 'ar-EG', dateOnly: false },
        { name: 'date mode', text: '2024-02-29', value: '2024-02-29', locale: 'ja-JP', dateOnly: true },
        { name: 'date/time in date mode', text: '2024-02-29T23:59:37.125', value: '2024-02-29', locale: 'en-US', dateOnly: true },
        { name: 'DST gap without an offset', text: '2024-03-10T02:30', value: '2024-03-10T02:30', locale: 'en-US', dateOnly: false }
    ], (spec, name, { text, value, locale, dateOnly }) => {
        spec(`pastes ISO ${name} over an existing value`, async () => {
            lang.setValueFor(element, locale);
            if (dateOnly) {
                element.type = 'date';
                element.value = '2024-11-13';
            }
            await waitForUpdatesAsync();
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            element.control.select();
            const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(paste, 'clipboardData', { value: { getData: () => text } });
            expect(element.control.dispatchEvent(paste)).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(element.control.value).toBe(element.displayValue);
            expect(element.validity.badInput).toBeFalse();
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).not.toHaveBeenCalled();
            element.control.dispatchEvent(new Event('change', { bubbles: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    parameterizeSpec([
        { name: 'UTC', text: '2024-01-01T00:15:37.125Z', dateOnly: false },
        { name: 'positive offset', text: '2024-01-01T00:15+14:00', dateOnly: false },
        { name: 'negative offset', text: '2024-12-31T23:45-12:00', dateOnly: false },
        { name: 'UTC in date mode', text: '2024-01-01T00:15Z', dateOnly: true }
    ], (spec, name, { text, dateOnly }) => {
        spec(`converts pasted ISO ${name} to browser-local time`, async () => {
            if (dateOnly) {
                element.type = 'date';
            }
            element.value = '';
            await waitForUpdatesAsync();
            const instant = new Date(text);
            const local = new Date(instant.getTime() - instant.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
            const expected = dateOnly ? local.slice(0, 10) : local.replace(/\.?0+$/, '').replace(/:00$/, '');
            const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(paste, 'clipboardData', { value: { getData: () => text } });
            expect(element.control.dispatchEvent(paste)).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(element.control.value).toBe(element.displayValue);
            expect(element.validity.badInput).toBeFalse();
        });
    });

    parameterizeSpec([
        { name: 'impossible day', text: '2024-02-30T12:00Z' },
        { name: 'non-leap year', text: '2023-02-29' },
        { name: 'invalid hour', text: '2024-02-29T24:00' },
        { name: 'invalid offset', text: '2024-02-29T12:00+24:00' },
        { name: 'invalid offset minutes', text: '2024-02-29T12:00+01:60' },
        { name: 'unsupported precision', text: '2024-02-29T12:00:00.1234' },
        { name: 'out-of-range year', text: '0000-02-29T12:00' },
        { name: 'trailing text', text: '2024-02-29T12:00 extra' }
    ], (spec, name, { text }) => {
        spec(`preserves invalid ISO ${name} for correction`, async () => {
            element.control.select();
            const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(paste, 'clipboardData', { value: { getData: () => text } });
            expect(element.control.dispatchEvent(paste)).toBeFalse();
            element.control.dispatchEvent(new Event('change', { bubbles: true }));
            await waitForUpdatesAsync();
            expect(element.control.value).toBe(text);
            expect(element.value).toBe('');
            expect(element.validity.badInput).toBeTrue();
            expect(element.entryError).not.toBe('');
            element.control.select();
            const correction = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(correction, 'clipboardData', { value: { getData: () => '02/29/2024 11:59 PM' } });
            expect(element.control.dispatchEvent(correction)).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe('2024-02-29T23:59');
            expect(element.checkValidity()).toBeTrue();
            expect(element.entryError).toBe('');
        });
    });

    it('validates pasted ISO values against form constraints without changing them', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.min = '2024-03-01T00:00';
        element.step = '900';
        await waitForUpdatesAsync();
        element.control.select();
        const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
        Object.defineProperty(paste, 'clipboardData', { value: { getData: () => '2024-02-29T23:59' } });
        expect(element.control.dispatchEvent(paste)).toBeFalse();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-02-29T23:59');
        expect(new FormData(form).get('scheduled')).toBe(element.value);
        expect(element.validity.rangeUnderflow).toBeTrue();
        expect(element.validity.stepMismatch).toBeTrue();
        expect(element.checkValidity()).toBeFalse();
    });

    parameterizeSpec([
        { name: 'omitted AM/PM', text: '11/13/2024 02:25', value: '2024-11-13T02:25' },
        { name: 'omitted time', text: '11/13/2024', value: '2024-11-13T00:00' }
    ], (spec, name, { text, value }) => {
        spec(`completes pasted ${name}`, async () => {
            element.value = '';
            await waitForUpdatesAsync();
            element.control.setSelectionRange(0, 0);
            const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(paste, 'clipboardData', { value: { getData: () => text } });
            expect(element.control.dispatchEvent(paste)).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(element.control.value).toBe(element.displayValue);
            expect(element.checkValidity()).toBeTrue();
        });
    });

    parameterizeSpec([
        { name: 'midnight', display: '12:00 AM', value: '00:00' },
        { name: 'noon', display: '12:00 PM', value: '12:00' },
        { name: 'morning', display: '01:05 AM', value: '01:05' },
        { name: 'evening', display: '11:59 PM', value: '23:59' }
    ], (spec, name, { display, value }) => {
        spec(`converts ${name} entry to the 24-hour form value`, async () => {
            element.control.value = `11/13/2024 ${display}`;
            element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(`2024-11-13T${value}`);
            expect(element.control.value.replace(/\s/g, ' ')).toBe(`11/13/2024 ${display}`);
            expect(element.checkValidity()).toBeTrue();
        });
    });

    it('preserves an incomplete day period while typing and recovers on programmatic updates', async () => {
        element.control.value = '11/13/2024 02:25';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:25');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(element.checkValidity()).toBeFalse();
        element.value = '2024-11-13T14:25';
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:25 PM');
        expect(element.checkValidity()).toBeTrue();
    });

    parameterizeSpec([
        { name: 'omitted AM/PM', locale: 'en-US', text: '11/13/2024 02:25', value: '2024-11-13T02:25', display: '11/13/2024 02:25 AM' },
        { name: 'omitted AM/PM at twelve', locale: 'en-US', text: '11/13/2024 12:25', value: '2024-11-13T00:25', display: '11/13/2024 12:25 AM' },
        { name: 'explicit PM', locale: 'en-US', text: '11/13/2024 02:25 PM', value: '2024-11-13T14:25', display: '11/13/2024 02:25 PM' },
        { name: 'omitted time', locale: 'en-US', text: '11/13/2024', value: '2024-11-13T00:00', display: '11/13/2024 12:00 AM' },
        { name: '24-hour omitted time', locale: 'de-DE', text: '13.11.2024', value: '2024-11-13T00:00', display: '13.11.2024 00:00' }
    ], (spec, name, { locale, text, value, display }) => {
        spec(`completes ${name} on commit`, async () => {
            lang.setValueFor(element, locale);
            await waitForUpdatesAsync();
            element.control.value = text;
            element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            const previous = element.value;
            element.control.dispatchEvent(new Event('change', { bubbles: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(element.control.value.replace(/\s/g, ' ')).toBe(display);
            expect(element.checkValidity()).toBeTrue();
            expect(input).toHaveBeenCalledTimes(previous === value ? 0 : 1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('completes omitted AM/PM in the popup without losing the selected date', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const time = element.timeField!;
        time.value = '09:07';
        time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.validity.badInput).toBeTrue();
        time.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T09:07');
        expect(time.value.replace(/\s/g, ' ')).toBe('09:07 AM');
        expect(time.checkValidity()).toBeTrue();
        expect(element.checkValidity()).toBeTrue();
    });

    it('shows invalid popup time feedback and clears the main draft when corrected in the popup', async () => {
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.open = true;
        await waitForUpdatesAsync();
        const time = element.timeField!;
        for (const text of ['09:', '', ' ']) {
            time.value = text;
            time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            time.dispatchEvent(new Event('change', { bubbles: true }));
            expect(element.value).withContext(text).toBe('');
            expect(element.validity.badInput).withContext(text).toBeTrue();
            expect(element.entryError).withContext(text).toBe('Enter a valid time.');
        }
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.picker #entry-error')!.textContent).toContain('Enter a valid time.');
        expect(time.getAttribute('aria-invalid')).toBe('true');
        time.value = '09:07';
        time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        time.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe(`${element.dateKey(calendarToday())}T09:07`);
        expect(element.control.value).toBe(element.displayValue);
        expect(element.checkValidity()).toBeTrue();
        expect(element.shadowRoot!.querySelector('#entry-error')!.textContent.trim()).toBe('');
    });

    it('shows accessible feedback for invalid committed drafts and clears it after correction or reset', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.control.value = '02/30/2024 02:25';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.control.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(element.control.value).toBe('02/30/2024 02:25');
        expect(element.value).toBe('');
        expect(element.checkValidity()).toBeFalse();
        expect(element.shadowRoot!.querySelector('#entry-error')!.textContent).toContain(element.validationMessage);
        expect(element.control.getAttribute('aria-invalid')).toBe('true');
        expect(element.control.getAttribute('aria-describedby')).toContain('entry-error');
        element.control.value = '02/29/2024 02:25 PM';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('#entry-error')!.textContent.trim()).toBe('');
        expect(element.control.getAttribute('aria-invalid')).not.toBe('true');
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        form.reset();
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('#entry-error')!.textContent.trim()).toBe('');
        expect(element.checkValidity()).toBeTrue();
    });

    it('keeps constraints invalid after completion and preserves application error state', async () => {
        element.min = '2024-11-13T09:00';
        element.errorText = 'Application error';
        element.errorVisible = true;
        element.control.value = '11/13/2024 02:25';
        element.control.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T02:25');
        expect(element.validity.rangeUnderflow).toBeTrue();
        expect(element.errorText).toBe('Application error');
        expect(element.errorVisible).toBeTrue();
        element.errorVisible = false;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('#entry-error')!.textContent).toContain(element.validationMessage);
    });

    it('sanitizes invalid programmatic values and validates required like native controls', () => {
        for (const value of ['2023-02-29T10:00', '2024-11-31T10:00', '2024-11', '2024-11-13T24:00', '0000-01-01T10:00']) {
            element.value = value;
            expect(element.parsedValue).withContext(value).toBeNull();
            expect(element.value).withContext(value).toBe('');
            expect(element.checkValidity()).withContext(value).toBeTrue();
        }
        element.value = '2024-02-29T00:00';
        expect(element.checkValidity()).toBeTrue();
        element.value = '';
        expect(element.checkValidity()).toBeTrue();
        element.required = true;
        expect(element.checkValidity()).toBeFalse();
    });

    it('validates four-digit years without the Date constructor century offset', () => {
        for (const value of ['0001-01-01T10:00', '0099-02-28T10:00', '9999-12-31T23:59']) {
            element.value = value;
            expect(element.parsedValue).withContext(value).not.toBeNull();
            expect(element.checkValidity()).withContext(value).toBeTrue();
        }
    });

    it('does not emit value events while navigating calendar controls', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        const month = element.shadowRoot!.querySelector(selectTag)!;
        month.value = '0';
        month.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        month.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        expect(element.visibleDate.getUTCMonth()).toBe(0);
        expect(element.value).toBe('2024-11-13T14:25');
        expect(input).not.toHaveBeenCalled();
        expect(change).not.toHaveBeenCalled();
    });

    it('navigates months across year boundaries without changing the value', () => {
        element.visibleDate = new Date(Date.UTC(2024, 11, 1));
        element.moveMonth(1);
        expect(element.visibleDate.getUTCFullYear()).toBe(2025);
        expect(element.visibleDate.getUTCMonth()).toBe(0);
        expect(element.value).toBe('2024-11-13T14:25');
    });

    it('preserves picker focus between Safari mouse-down and month-button click', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-13"]')!.focus();
        const next = element.shadowRoot!.querySelector<HTMLElement>(`${buttonTag}[aria-label="Next month"]`)!;
        const button = next.shadowRoot!.querySelector('button')!;
        const allowDefault = button.dispatchEvent(new MouseEvent('mousedown', {
            button: 0, bubbles: true, composed: true, cancelable: true
        }));
        expect(allowDefault).toBeFalse();
        if (allowDefault) {
            element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-13"]')!.blur();
        }
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        button.click();
        await waitForUpdatesAsync();
        expect(element.visibleDate.getUTCMonth()).toBe(11);
        expect(element.open).toBeTrue();
    });

    it('navigates with Nimble year and month buttons without closing or committing', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const change = jasmine.createSpy('change');
        element.addEventListener('change', change);
        const year = element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.year')!;
        year.value = '2028';
        year.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.visibleDate.getUTCFullYear()).toBe(2028);
        const next = element.shadowRoot!.querySelector<HTMLElement>(`${buttonTag}[aria-label="Next month"]`)!;
        next.click();
        await waitForUpdatesAsync();
        expect(element.visibleDate.getUTCMonth()).toBe(11);
        expect(element.open).toBeTrue();
        expect(element.shadowRoot!.querySelector(selectTag)!.value).toBe('11');
        expect(element.value).toBe('2024-11-13T14:25');
        expect(change).not.toHaveBeenCalled();
    });

    it('offers nearby years and includes displayed years outside the dropdown range', async () => {
        const currentYear = new Date().getUTCFullYear();
        expect(element.years).toContain(currentYear - 100);
        expect(element.years).toContain(currentYear + 100);
        element.value = '0099-02-28T10:00';
        element.open = true;
        await waitForUpdatesAsync();
        const year = element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.year')!;
        expect(year.value).toBe('99');
        expect(element.years[0]).toBe(99);
        element.visibleDate = new Date('9999-12-01T10:00Z');
        await waitForUpdatesAsync();
        expect(year.value).toBe('9999');
        expect(element.years).toContain(9999);
    });

    it('navigates the grid across months and clamps page navigation to month end', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.handleDayKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), new Date(Date.UTC(2024, 11, 31)))).toBeFalse();
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe('2025-01-01');
        element.handleDayKeydown(new KeyboardEvent('keydown', { key: 'PageDown' }), new Date(Date.UTC(2024, 0, 31)));
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe('2024-02-29');
        expect(element.value).toBe('2024-11-13T14:25');
    });

    it('supports Alt+Down and Escape, restoring field focus', async () => {
        element.control.setSelectionRange(element.value.length, element.value.length);
        element.control.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', altKey: true, bubbles: true, composed: true
        }));
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
        expect(element.focusedDate).toBe('2024-11-13');
        element.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(element.shadowRoot!.activeElement).toBe(element.control);
    });

    it('lets an open year select consume Escape before dismissing the picker', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const year = element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.year')!;
        year.open = true;
        year.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(year.open).toBeFalse();
        expect(element.open).toBeTrue();
    });

    it('closes on an outside pointer interaction', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
        expect(element.open).toBeFalse();
    });

    (['disabled', 'readOnly'] as const).forEach(property => {
        it(`blocks picker edits while ${property}, including state changes while open`, async () => {
            element.open = true;
            await waitForUpdatesAsync();
            element[property] = true;
            await waitForUpdatesAsync();
            expect(element.open).toBeFalse();
            expect(element.trigger.disabled).toBeTrue();
            element.selectDay(new Date(Date.UTC(2024, 0, 1)));
            expect(element.value).toBe('2024-11-13T14:25');
            element.open = true;
            expect(element.open).toBeFalse();
        });

        it(`skips validation while ${property} and restores draft validity when re-enabled`, async () => {
            const form = document.createElement('form');
            element.parentElement!.appendChild(form);
            form.appendChild(element);
            element.required = true;
            element.control.value = '11/';
            element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            expect(element.checkValidity()).toBeFalse();
            element[property] = true;
            await waitForUpdatesAsync();
            expect(element.checkValidity()).toBeTrue();
            expect(element.willValidate).toBeFalse();
            expect(new FormData(form).get('scheduled')).toBe(property === 'disabled' ? null : '');
            element[property] = false;
            await waitForUpdatesAsync();
            expect(element.validity.badInput).toBeTrue();
            expect(element.checkValidity()).toBeFalse();
        });
    });

    it('uses the standard field appearances and underline default', () => {
        expect(element.appearance).toBe(FvDateTimePickerAppearance.underline);
        expect(Object.values(FvDateTimePickerAppearance)).toEqual(['underline', 'outline', 'block', 'frameless']);
        expect('maxlength' in element).toBeFalse();
        expect('pattern' in element).toBeFalse();
    });

    it('supports date-only selection, entry, submission, and reset without hidden time', async () => {
        element.type = 'date';
        element.setAttribute('value', '2024-11-13');
        element.value = '2024-11-13';
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024');
        expect(element.shadowRoot!.querySelector('#time')).toBeNull();
        expect(element.trigger.ariaLabel).toBe('Choose date');
        element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-21"]')!.click();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-21');
        expect(new FormData(form).get('scheduled')).toBe('2024-11-21');
        element.control.value = '02/29/2024';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-02-29');
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024');
    });

    it('clears incompatible values on mode changes without inventing time or emitting events', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        element.open = true;
        element.type = 'date';
        expect(element.value).toBe('');
        expect(element.open).toBeFalse();
        element.value = '2024-11-13';
        element.type = 'datetime-local';
        await waitForUpdatesAsync();
        expect(element.value).toBe('');
        expect(input).not.toHaveBeenCalled();
        expect(change).not.toHaveBeenCalled();
    });

    parameterizeSpec([
        {
            name: 'date minimum', type: 'date' as const, min: '2024-11-14', max: '', step: '', value: '2024-11-13'
        },
        {
            name: 'date maximum', type: 'date' as const, min: '', max: '2024-11-12', step: '', value: '2024-11-13'
        },
        {
            name: 'date step', type: 'date' as const, min: '2024-11-12', max: '', step: '2', value: '2024-11-13'
        },
        {
            name: 'time minimum', type: 'datetime-local' as const, min: '2024-11-13T14:26', max: '', step: '', value: '2024-11-13T14:25'
        },
        {
            name: 'time maximum', type: 'datetime-local' as const, min: '', max: '2024-11-13T14:24', step: '', value: '2024-11-13T14:25'
        },
        {
            name: 'time step', type: 'datetime-local' as const, min: '2024-11-13T14:00', max: '', step: '1800', value: '2024-11-13T14:25'
        },
        {
            name: 'seconds', type: 'datetime-local' as const, min: '', max: '', step: '1', value: '2024-11-13T14:25:37'
        },
        {
            name: 'milliseconds', type: 'datetime-local' as const, min: '', max: '', step: '0.001', value: '2024-11-13T14:25:37.123'
        },
        {
            name: 'any step', type: 'datetime-local' as const, min: '', max: '', step: 'any', value: '2024-11-13T14:25:37.123'
        },
        {
            name: 'invalid constraints', type: 'datetime-local' as const, min: 'invalid', max: 'invalid', step: '-1', value: '2024-11-13T14:25'
        }
    ], (spec, name, { type, min, max, step, value }) => {
        spec(`matches native ${name} validity and serialization`, async () => {
            const native = document.createElement('input');
            native.type = type;
            native.defaultValue = element.initialValue;
            native.min = min;
            native.max = max;
            native.step = step;
            native.value = value;
            element.type = type;
            element.min = min;
            element.max = max;
            element.step = step;
            element.value = value;
            await waitForUpdatesAsync();
            expect(element.value).toBe(native.value);
            expect(element.validity.rangeUnderflow).toBe(native.validity.rangeUnderflow);
            expect(element.validity.rangeOverflow).toBe(native.validity.rangeOverflow);
            expect(element.validity.stepMismatch).toBe(native.validity.stepMismatch);
            expect(element.checkValidity()).toBe(native.checkValidity());
            const display = element.control.value;
            element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            expect(element.value).withContext(display).toBe(native.value);
        });
    });

    it('uses the value attribute, not the current value, as the step base', () => {
        element.step = '1800';
        element.value = '2024-11-13T15:25';
        expect(element.validity.stepMismatch).toBeFalse();
        element.value = '2024-11-13T15:00';
        expect(element.validity.stepMismatch).toBeTrue();
        element.min = '2024-11-13T14:00';
        expect(element.validity.stepMismatch).toBeFalse();
        element.min = '';
        element.step = 'any';
        expect(element.validity.stepMismatch).toBeFalse();
    });

    it('disables out-of-range and off-step calendar dates, including programmatic selection', async () => {
        element.type = 'date';
        element.min = '2024-11-10';
        element.max = '2024-11-20';
        element.step = '2';
        element.value = '2024-11-12';
        element.open = true;
        await waitForUpdatesAsync();
        for (const date of ['2024-11-09', '2024-11-11', '2024-11-21']) {
            expect(element.shadowRoot!.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)!.disabled).withContext(date).toBeTrue();
            element.selectDay(new Date(`${date}T00:00Z`));
            expect(element.value).toBe('2024-11-12');
        }
        element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-14"]')!.click();
        expect(element.value).toBe('2024-11-14');
    });

    it('propagates invalid Time drafts to outer badInput and removes stale submitted values', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.open = true;
        await waitForUpdatesAsync();
        const time = element.timeField!;
        time.value = '09:';
        time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(element.checkValidity()).toBeFalse();
        expect(new FormData(form).get('scheduled')).toBe('');
        expect(time.checkValidity()).toBeFalse();
        time.value = '09:07 AM';
        time.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-11-13T09:07');
        expect(element.checkValidity()).toBeTrue();
    });

    it('clears an invalid draft on form reset even when the value is already empty', async () => {
        element.setAttribute('value', '');
        element.value = '';
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        await waitForUpdatesAsync();
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.validity.badInput).toBeTrue();
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('');
        expect(element.checkValidity()).toBeTrue();
    });

    it('does not let a pending native change overwrite a programmatic update', () => {
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.step = '0.001';
        element.value = '2024-11-13T14:25:37.123';
        element.control.dispatchEvent(new Event('change', { bubbles: true }));
        expect(element.value).toBe('2024-11-13T14:25:37.123');
        expect(element.checkValidity()).toBeTrue();
    });

    it('preserves seconds precision while editing a value that needs it', async () => {
        element.value = '2024-11-13T14:25:37';
        await waitForUpdatesAsync();
        element.control.value = '11/13/2024 02:25:3';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:25:3');
        element.control.value = '11/13/2024 02:25:38 PM';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-11-13T14:25:38');
        expect(element.validity.badInput).toBeFalse();
    });

    it('treats daylight-saving gaps as valid wall times and preserves ancient years', async () => {
        element.value = '2024-03-10T02:30';
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-03-10T02:30');
        expect(element.checkValidity()).toBeTrue();
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-03-10T02:30');
    });

    it('reacts to Nimble language changes for date order, time, months, and week headings', async () => {
        lang.setValueFor(element, 'de-DE');
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('13.11.2024 14:25');
        expect(element.timeField!.value).toBe('14:25');
        expect(element.months[2]).toBe('März');
        expect(element.weekdays[0]!.name).toBe(element.firstDayOfWeek === 1 ? 'Montag' : 'Sonntag');
        element.control.value = '29.02.2024 23:59';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-02-29T23:59');
        lang.setValueFor(element, 'en-US');
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('02/29/2024 11:59 PM');
    });

    it('uses locale week starts for Home/End and mirrors horizontal arrows in RTL', async () => {
        lang.setValueFor(element, 'de-DE');
        element.open = true;
        await waitForUpdatesAsync();
        element.handleDayKeydown(new KeyboardEvent('keydown', { key: 'Home' }), new Date('2024-11-13T00:00Z'));
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe(element.firstDayOfWeek === 1 ? '2024-11-11' : '2024-11-10');
        direction.setValueFor(element, Direction.rtl);
        element.handleDayKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), new Date('2024-11-13T00:00Z'));
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe('2024-11-14');
    });

    it('forwards supported entry attributes and all global ARIA properties', async () => {
        element.placeholder = 'Choose a scheduled date';
        element.autocomplete = 'bday';
        element.ariaLabel = 'Appointment';
        element.ariaDetails = 'details';
        element.ariaErrormessage = 'error';
        element.ariaControls = 'related';
        element.ariaKeyshortcuts = 'Alt+ArrowDown';
        await waitForUpdatesAsync();
        expect(element.control.placeholder).toBe('Choose a scheduled date');
        expect(element.control.getAttribute('autocomplete')).toBe('bday');
        expect(element.control.getAttribute('aria-label')).toBe('Appointment');
        expect(element.control.getAttribute('aria-details')).toBe('details');
        expect(element.control.getAttribute('aria-errormessage')).toBe('error');
        expect(element.control.getAttribute('aria-controls')).toBe('related');
        expect(element.control.getAttribute('aria-keyshortcuts')).toBe('Alt+ArrowDown');
    });

    it('supports the Nimble label-provider localization pattern', async () => {
        const provider = document.createElement(fvDateTimePickerLabelProviderTag);
        provider.chooseDateTime = 'Datum und Uhrzeit auswählen';
        provider.time = 'Uhrzeit';
        provider.done = 'Fertig';
        provider.invalidDateTime = 'Datum und Uhrzeit eingeben.';
        const themeProvider = document.createElement(themeProviderTag);
        element.parentElement!.appendChild(themeProvider);
        themeProvider.appendChild(provider);
        themeProvider.appendChild(element);
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.trigger.ariaLabel).toBe('Datum und Uhrzeit auswählen');
        expect(element.timeField!.textContent).toContain('Uhrzeit');
        expect(element.shadowRoot!.querySelector('.time-row nimble-button')!.textContent).toBe('Fertig');
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.validationMessage).toBe('Datum und Uhrzeit eingeben.');
    });
});
