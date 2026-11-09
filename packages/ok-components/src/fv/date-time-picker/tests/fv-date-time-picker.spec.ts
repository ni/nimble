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

    async function waitForPickerLoaded(): Promise<void> {
        await waitForUpdatesAsync();
        if (!element.region!.classList.contains('loaded')) {
            await new Promise<void>(resolve => {
                element.region!.addEventListener('loaded', () => resolve(), { once: true });
            });
        }
        await waitForUpdatesAsync();
    }

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

    parameterizeSpec([
        { name: 'date', type: 'date' as const },
        { name: 'datetime-local', type: 'datetime-local' as const }
    ], (spec, name, { type }) => {
        spec(`omits the Done button and only shows the time row in datetime-local mode (${name})`, async () => {
            element.type = type;
            element.open = true;
            await waitForUpdatesAsync();
            expect(element.shadowRoot!.querySelectorAll(`.picker ${buttonTag}`).length).toBe(2);
            expect(element.shadowRoot!.querySelector('.time-row') !== null).toBe(type === 'datetime-local');
        });
    });

    it('uses document placement without viewport locks while allowing automatic popup direction', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.region!.fixedPlacement).toBeFalse();
        expect(element.region!.horizontalViewportLock).toBeFalse();
        expect(element.region!.verticalViewportLock).toBeFalse();
        expect(element.region!.verticalPositioningMode).toBe('dynamic');
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

    parameterizeSpec([
        { name: 'typed month', value: '2024-12-13T14:25', text: '12/13/2024 02:25 PM' },
        { name: 'typed year', value: '2025-11-13T14:25', text: '11/13/2025 02:25 PM' }
    ], (spec, name, { value, text }) => {
        spec(`synchronizes the open calendar with the ${name} without stealing focus`, async () => {
            element.open = true;
            await waitForUpdatesAsync();
            element.control.focus();
            element.control.value = text;
            element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.month')!.value)
                .toBe(String(Number(value.slice(5, 7)) - 1));
            expect(element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.year')!.value).toBe(value.slice(0, 4));
            expect(element.shadowRoot!.querySelector('[aria-selected="true"] button')?.getAttribute('data-date')).toBe(value.slice(0, 10));
            expect(element.focusedDate).toBe(value.slice(0, 10));
            expect(element.shadowRoot!.activeElement).toBe(element.control);
        });
    });

    it('synchronizes segment adjustment and ISO paste with the open calendar', async () => {
        element.value = '2024-12-31T14:25';
        element.open = true;
        await waitForUpdatesAsync();
        element.control.focus();
        element.control.setSelectionRange(0, 2);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.visibleDate.getUTCFullYear()).toBe(2025);
        expect(element.visibleDate.getUTCMonth()).toBe(0);
        expect(element.focusedDate).toBe('2025-01-31');
        expect(element.control.selectionStart).toBe(0);
        expect(element.control.selectionEnd).toBe(2);
        element.control.select();
        const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
        Object.defineProperty(paste, 'clipboardData', { value: { getData: () => '2023-02-28T14:25' } });
        element.control.dispatchEvent(paste);
        await waitForUpdatesAsync();
        expect(element.visibleDate.getUTCFullYear()).toBe(2023);
        expect(element.visibleDate.getUTCMonth()).toBe(1);
        expect(element.focusedDate).toBe('2023-02-28');
        expect(element.shadowRoot!.activeElement).toBe(element.control);
    });

    it('preserves calendar browsing on time-only edits and incomplete date drafts', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        element.moveMonth(2);
        await waitForUpdatesAsync();
        const browsed = element.visibleDate.getTime();
        element.control.value = '11/13/2024 03:25 PM';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.visibleDate.getTime()).toBe(browsed);
        element.control.value = '02/30/2025 03:25 PM';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();
        expect(element.visibleDate.getTime()).toBe(browsed);
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

    parameterizeSpec([
        {
            name: 'hour', value: '2024-11-13T23:25', start: 0, end: 2, key: 'ArrowUp', expected: '2024-11-14T00:25'
        },
        {
            name: 'minute', value: '2024-12-31T23:59', start: 3, end: 5, key: 'ArrowUp', expected: '2025-01-01T00:00'
        },
        {
            name: 'second', value: '2024-11-13T14:25:59', start: 6, end: 8, key: 'ArrowUp', expected: '2024-11-13T14:26'
        },
        {
            name: 'millisecond', value: '2024-11-13T14:25:37.999', start: 9, end: 12, key: 'ArrowUp', expected: '2024-11-13T14:25:38'
        },
        {
            name: 'AM/PM', value: '2024-11-13T14:25', start: 6, end: 8, key: 'ArrowDown', expected: '2024-11-13T02:25'
        }
    ], (spec, name, { value, start, end, key, expected }) => {
        spec(`highlights and adjusts the popover ${name} without leaking events`, async () => {
            element.value = value;
            element.open = true;
            await waitForUpdatesAsync();
            const control = element.timeField!.control;
            control.setSelectionRange(start, start);
            control.click();
            expect(control.selectionStart).toBe(start);
            expect(control.selectionEnd).toBe(end);
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            expect(control.dispatchEvent(new KeyboardEvent('keydown', {
                key, bubbles: true, composed: true, cancelable: true
            }))).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(control.value).toBe(element.timeDisplay);
            expect(control.selectionStart).toBe(start);
            expect(control.selectionEnd).toBe(end);
            expect(element.open).toBeTrue();
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('replaces and deletes popover segments without shifting other time fields', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const control = element.timeField!.control;
        control.setSelectionRange(3, 5);
        for (const digit of '07') {
            control.dispatchEvent(new InputEvent('beforeinput', {
                inputType: 'insertText', data: digit, bubbles: true, cancelable: true, composed: true
            }));
        }
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T14:07');
        expect(control.value.replace(/\s/g, ' ')).toBe('02:07 PM');
        control.setSelectionRange(1, 1);
        control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'deleteContentForward', bubbles: true, cancelable: true, composed: true
        }));
        await waitForUpdatesAsync();
        expect(control.value.replace(/\s/g, ' ')).toBe('00:07 PM');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        control.setSelectionRange(0, 0);
        control.click();
        control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '11', bubbles: true, cancelable: true, composed: true
        }));
        control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T23:07');
        expect(element.checkValidity()).toBeTrue();
    });

    parameterizeSpec([
        { name: 'Escape' },
        { name: 'outside pointer' },
        { name: 'native change then outside pointer' }
    ], (spec, name) => {
        spec(`commits pending Time segment edits once on ${name}`, async () => {
            element.open = true;
            await waitForUpdatesAsync();
            const control = element.timeField!.control;
            control.focus();
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            control.setSelectionRange(3, 5);
            control.dispatchEvent(new InputEvent('beforeinput', {
                inputType: 'insertText', data: '07', bubbles: true, cancelable: true, composed: true
            }));
            if (name.startsWith('native')) {
                control.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (name === 'Escape') {
                control.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape', bubbles: true, composed: true, cancelable: true
                }));
            } else {
                document.body.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
            }
            await waitForUpdatesAsync();
            expect(element.open).toBeFalse();
            expect(element.value).toBe('2024-11-13T14:07');
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('increases both masks precision after a committed Time edit when constraints change', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const control = element.timeField!.control;
        control.setSelectionRange(3, 5);
        control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '07', bubbles: true, cancelable: true, composed: true
        }));
        control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(element.timeMode).toBe('HH:MM:SS.MSS');
        expect(control.value.replace(/\s/g, ' ')).toBe('02:07:00.000 PM');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:07:00.000 PM');
        control.value = '02:07:01.123 PM';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-11-13T14:07:01.123');
    });

    it('preserves invalid Time drafts when constraints increase precision', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const control = element.timeField!.control;
        control.value = '02:';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(element.timeMode).toBe('HH:MM:SS.MSS');
        expect(control.value).toBe('02:');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
    });

    it('preserves invalid main drafts when constraints increase precision', async () => {
        element.control.value = '11/13/2024 02:';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(element.timeMode).toBe('HH:MM:SS.MSS');
        expect(element.control.value).toBe('11/13/2024 02:');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
    });

    it('associates the Time error with its actual input across shadow roots', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const control = element.timeField!.control;
        control.value = '02:';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        const error = element.shadowRoot!.querySelector('#entry-error')!;
        expect(error.textContent).toContain('Enter a valid time.');
        expect(control.ariaDescribedByElements).toEqual([error]);
        control.value = '02:25 PM';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();
        expect(control.ariaDescribedByElements ?? []).toEqual([]);
    });

    it('keeps main and popover edit state independent and reconnects listeners after reopening', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const control = element.timeField!.control;
        control.setSelectionRange(3, 5);
        control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '1', bubbles: true, cancelable: true, composed: true
        }));
        element.open = false;
        await waitForUpdatesAsync();
        element.open = true;
        await waitForUpdatesAsync();
        const reopened = element.timeField!.control;
        const input = jasmine.createSpy('input');
        element.addEventListener('input', input);
        reopened.setSelectionRange(0, 2);
        reopened.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T15:01');
        expect(input).toHaveBeenCalledTimes(1);
        expect(reopened.selectionStart).toBe(0);
        expect(reopened.selectionEnd).toBe(2);
    });

    it('focuses the trigger before reopening so Safari does not dismiss the time field', async () => {
        element.control.focus();
        expect(element.handleTriggerMousedown(new MouseEvent('mousedown', { button: 0 }))).toBeFalse();
        element.trigger.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        element.closePicker();
        await waitForUpdatesAsync();
        expect(element.handleTriggerMousedown(new MouseEvent('mousedown', { button: 2 }))).toBeTrue();
        element.handleTriggerMousedown(new MouseEvent('mousedown', { button: 0 }));
        element.trigger.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        expect(element.timeField!.isConnected).toBeTrue();
    });

    parameterizeSpec([
        { name: '24-hour German', locale: 'de-DE', rtl: false },
        { name: 'RTL Arabic', locale: 'ar-EG', rtl: true }
    ], (spec, name, { locale, rtl }) => {
        spec(`preserves popover navigation and validation in ${name}`, async () => {
            lang.setValueFor(element, locale);
            direction.setValueFor(element, rtl ? Direction.rtl : Direction.ltr);
            element.min = element.value;
            element.max = element.value;
            element.step = '900';
            element.open = true;
            await waitForUpdatesAsync();
            const control = element.timeField!.control;
            control.setSelectionRange(0, 0);
            control.click();
            control.dispatchEvent(new KeyboardEvent('keydown', {
                key: rtl ? 'ArrowLeft' : 'ArrowRight', bubbles: true, cancelable: true
            }));
            expect(control.selectionStart).toBe(3);
            expect(control.selectionEnd).toBe(5);
            control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe('2024-11-13T14:26');
            expect(element.validity.rangeOverflow).toBeTrue();
            expect(element.validity.stepMismatch).toBeTrue();
            control.select();
            expect(element.handleInputKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), control)).toBeTrue();
            expect(element.handleInputKeydown(new KeyboardEvent('keydown', { key: 'Tab' }), control)).toBeTrue();
        });
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
        { name: 'US month', locale: 'en-US', position: 1, start: 0, end: 2 },
        { name: 'US day', locale: 'en-US', position: 4, start: 3, end: 5 },
        { name: 'US year', locale: 'en-US', position: 8, start: 6, end: 10 },
        { name: 'US hour', locale: 'en-US', position: 12, start: 11, end: 13 },
        { name: 'US minute', locale: 'en-US', position: 15, start: 14, end: 16 },
        { name: 'US AM/PM', locale: 'en-US', position: 18, start: 17, end: 19 },
        { name: 'German day', locale: 'de-DE', position: 1, start: 0, end: 2 },
        { name: 'German month', locale: 'de-DE', position: 4, start: 3, end: 5 },
        { name: 'Japanese year', locale: 'ja-JP', position: 2, start: 0, end: 4 },
        { name: 'Japanese month', locale: 'ja-JP', position: 6, start: 5, end: 7 }
    ], (spec, name, { locale, position, start, end }) => {
        spec(`highlights the ${name} segment on click`, async () => {
            lang.setValueFor(element, locale);
            await waitForUpdatesAsync();
            element.control.setSelectionRange(position, position);
            element.control.click();
            expect(element.control.selectionStart).toBe(start);
            expect(element.control.selectionEnd).toBe(end);
        });
    });

    parameterizeSpec([
        { name: 'month end', value: '2024-01-31T14:25', position: 0, key: 'ArrowUp', expected: '2024-02-29T14:25' },
        { name: 'previous month end', value: '2024-03-31T14:25', position: 0, key: 'ArrowDown', expected: '2024-02-29T14:25' },
        { name: 'leap year', value: '2024-02-29T14:25', position: 6, key: 'ArrowUp', expected: '2025-02-28T14:25' },
        { name: 'day rollover', value: '2024-12-31T14:25', position: 3, key: 'ArrowUp', expected: '2025-01-01T14:25' },
        { name: 'hour rollover', value: '2024-12-31T23:25', position: 11, key: 'ArrowUp', expected: '2025-01-01T00:25' },
        { name: 'minute rollover', value: '2024-12-31T23:59', position: 14, key: 'ArrowUp', expected: '2025-01-01T00:00' },
        { name: 'minute borrow', value: '2024-01-01T00:00', position: 14, key: 'ArrowDown', expected: '2023-12-31T23:59' },
        { name: 'seconds', value: '2024-12-31T23:59:59', position: 17, key: 'ArrowUp', expected: '2025-01-01T00:00' },
        { name: 'milliseconds', value: '2024-12-31T23:59:59.999', position: 20, key: 'ArrowUp', expected: '2025-01-01T00:00' },
        { name: 'AM/PM', value: '2024-11-13T02:25', position: 17, key: 'ArrowUp', expected: '2024-11-13T14:25' },
        { name: 'DST gap', value: '2024-03-10T01:30', position: 11, key: 'ArrowUp', expected: '2024-03-10T02:30' }
    ], (spec, name, { value, position, key, expected }) => {
        spec(`adjusts ${name} and retains the selected segment`, async () => {
            element.value = value;
            await waitForUpdatesAsync();
            element.control.setSelectionRange(position, position);
            element.control.click();
            const start = element.control.selectionStart;
            const end = element.control.selectionEnd;
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            expect(element.control.dispatchEvent(new KeyboardEvent('keydown', {
                key, bubbles: true, composed: true, cancelable: true
            }))).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(element.control.value).toBe(element.displayValue);
            expect(element.control.selectionStart).toBe(start);
            expect(element.control.selectionEnd).toBe(end);
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('navigates segments without trapping Left/Right at a selection boundary', async () => {
        element.control.setSelectionRange(1, 1);
        element.control.click();
        for (const [key, start, end] of [
            ['ArrowRight', 3, 5], ['ArrowRight', 6, 10], ['ArrowLeft', 3, 5], ['End', 17, 19], ['Home', 0, 2]
        ] as const) {
            element.control.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
            element.control.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
            expect(element.control.selectionStart).toBe(start);
            expect(element.control.selectionEnd).toBe(end);
        }
        await waitForUpdatesAsync();
    });

    it('handles End from a separator and adjusts at the end of the text', async () => {
        element.control.setSelectionRange(10, 10);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
        expect(element.control.selectionStart).toBe(17);
        expect(element.control.selectionEnd).toBe(19);
        element.control.setSelectionRange(19, 19);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T02:25');
        expect(element.control.selectionStart).toBe(17);
        expect(element.control.selectionEnd).toBe(19);
    });

    it('does not restore an old selection after adjusting and immediately navigating', async () => {
        element.control.setSelectionRange(3, 5);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-14T14:25');
        expect(element.control.selectionStart).toBe(6);
        expect(element.control.selectionEnd).toBe(10);
    });

    parameterizeSpec([
        { name: 'day', start: 3, end: 5, digits: '21', expected: '2024-11-21T14:25' },
        { name: 'month', start: 0, end: 2, digits: '2', expected: '2024-02-13T14:25' },
        { name: 'year', start: 6, end: 10, digits: '2025', expected: '2025-11-13T14:25' },
        { name: 'hour', start: 11, end: 13, digits: '11', expected: '2024-11-13T23:25' },
        { name: 'minute', start: 14, end: 16, digits: '07', expected: '2024-11-13T14:07' }
    ], (spec, name, { start, end, digits, expected }) => {
        spec(`replaces the selected ${name} without shifting other segments`, async () => {
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            element.control.setSelectionRange(start, end);
            for (const digit of digits) {
                element.control.dispatchEvent(new KeyboardEvent('keydown', { key: digit, bubbles: true }));
                expect(element.control.dispatchEvent(new InputEvent('beforeinput', {
                    inputType: 'insertText', data: digit, bubbles: true, cancelable: true, composed: true
                }))).toBeFalse();
            }
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(input).toHaveBeenCalledTimes(digits.length);
            expect(change).not.toHaveBeenCalled();
            element.control.dispatchEvent(new FocusEvent('blur'));
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('commits typed segment replacement on Enter and resets it with the form', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        await waitForUpdatesAsync();
        const change = jasmine.createSpy('change');
        element.addEventListener('change', change);
        element.control.setSelectionRange(3, 5);
        element.control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '2', bubbles: true, cancelable: true
        }));
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        element.control.dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-02T14:25');
        expect(new FormData(form).get('scheduled')).toBe(element.value);
        expect(change).toHaveBeenCalledTimes(1);
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T14:25');
    });

    parameterizeSpec([
        {
            name: 'backspace in day', start: 4, end: 4, inputType: 'deleteContentBackward', expected: '11/03/2024 02:25 PM', caret: 3
        },
        {
            name: 'delete in day', start: 3, end: 3, inputType: 'deleteContentForward', expected: '11/03/2024 02:25 PM', caret: 3
        },
        {
            name: 'selected day', start: 3, end: 5, inputType: 'deleteContentBackward', expected: '11/00/2024 02:25 PM', caret: 3
        },
        {
            name: 'selected year and day', start: 4, end: 10, inputType: 'deleteByCut', expected: '11/10/0000 02:25 PM', caret: 4
        },
        {
            name: 'backspace across separator', start: 6, end: 6, inputType: 'deleteContentBackward', expected: '11/10/2024 02:25 PM', caret: 4
        },
        {
            name: 'delete across separator', start: 5, end: 5, inputType: 'deleteContentForward', expected: '11/13/0024 02:25 PM', caret: 6
        },
        {
            name: 'selected minute', start: 14, end: 16, inputType: 'deleteContentForward', expected: '11/13/2024 02:00 PM', caret: 14
        }
    ], (spec, name, { start, end, inputType, expected, caret }) => {
        spec(`keeps other segments in place when deleting ${name}`, async () => {
            element.control.setSelectionRange(start, end);
            expect(element.control.dispatchEvent(new InputEvent('beforeinput', {
                inputType, bubbles: true, cancelable: true, composed: true
            }))).toBeFalse();
            await waitForUpdatesAsync();
            expect(element.control.value.replace(/\s/g, ' ')).toBe(expected);
            expect(element.control.selectionStart).toBe(caret);
            expect(element.control.selectionEnd).toBe(caret);
        });
    });

    it('keeps deletion drafts positional until corrected, with normal validation and events', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        element.control.setSelectionRange(3, 5);
        element.control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'deleteContentBackward', bubbles: true, cancelable: true
        }));
        element.control.setSelectionRange(7, 7);
        element.control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'deleteContentForward', bubbles: true, cancelable: true
        }));
        element.control.dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/00/2024 02:25 PM');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(element.entryError).not.toBe('');
        expect(input).toHaveBeenCalledTimes(1);
        expect(change).toHaveBeenCalledTimes(1);
        element.control.setSelectionRange(3, 3);
        element.control.click();
        element.control.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '21', bubbles: true, cancelable: true
        }));
        element.control.dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-21T14:25');
        expect(element.checkValidity()).toBeTrue();
        expect(element.entryError).toBe('');
    });

    it('leaves clearing all text and deletion during initial entry to the native mask', async () => {
        element.control.select();
        expect(element.handleSegmentInput(new InputEvent('beforeinput', {
            inputType: 'deleteContentBackward'
        }))).toBeTrue();
        element.value = '';
        await waitForUpdatesAsync();
        element.control.value = '11/1';
        element.handleTextInput();
        element.control.setSelectionRange(4, 4);
        expect(element.handleSegmentInput(new InputEvent('beforeinput', {
            inputType: 'deleteContentBackward'
        }))).toBeTrue();
    });

    parameterizeSpec([
        {
            name: 'German date', locale: 'de-DE', value: '2024-11-13', type: 'date' as const, position: 4, expected: '2024-10-13'
        },
        {
            name: 'Japanese year', locale: 'ja-JP', value: '2024-11-13T14:25', type: 'datetime-local' as const, position: 3, expected: '2020-11-13T14:25'
        },
        {
            name: 'seconds', locale: 'en-US', value: '2024-11-13T14:25:37', type: 'datetime-local' as const, position: 18, expected: '2024-11-13T14:25:30'
        },
        {
            name: 'milliseconds', locale: 'en-US', value: '2024-11-13T14:25:37.125', type: 'datetime-local' as const, position: 22, expected: '2024-11-13T14:25:37.12'
        }
    ], (spec, name, { locale, value, type, position, expected }) => {
        spec(`deletes ${name} without moving later segments`, async () => {
            lang.setValueFor(element, locale);
            element.type = type;
            element.value = value;
            await waitForUpdatesAsync();
            const length = element.control.value.length;
            element.control.setSelectionRange(position, position);
            element.control.dispatchEvent(new InputEvent('beforeinput', {
                inputType: 'deleteContentForward', bubbles: true, cancelable: true
            }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(expected);
            expect(element.control.value.length).toBe(length);
        });
    });

    it('does not handle canceled input or truncate text longer than the selected segment', () => {
        element.control.setSelectionRange(3, 5);
        const canceled = new InputEvent('beforeinput', { inputType: 'insertText', data: '2', cancelable: true });
        canceled.preventDefault();
        expect(element.handleSegmentInput(canceled)).toBeTrue();
        expect(element.handleSegmentInput(new InputEvent('beforeinput', {
            inputType: 'insertText', data: '2025', cancelable: true
        }))).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('11/13/2024 02:25 PM');
    });

    it('preserves drag selections, Select All, modifier shortcuts, and Tab', () => {
        element.control.setSelectionRange(1, 8);
        element.control.click();
        expect(element.control.selectionStart).toBe(1);
        expect(element.control.selectionEnd).toBe(8);
        element.control.select();
        element.control.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', ctrlKey: true }));
        expect(element.control.selectionStart).toBe(0);
        expect(element.control.selectionEnd).toBe(element.control.value.length);
        for (const options of [{ key: 'ArrowUp' }, { key: 'ArrowRight', shiftKey: true }, { key: 'Tab' }]) {
            expect(element.control.dispatchEvent(new KeyboardEvent('keydown', {
                ...options, bubbles: true, cancelable: true
            }))).toBeTrue();
        }
        expect(element.value).toBe('2024-11-13T14:25');
    });

    parameterizeSpec([
        { name: 'empty', text: '' },
        { name: 'incomplete', text: '11/13/2024 02:' },
        { name: 'impossible', text: '02/30/2024 02:25 PM' }
    ], (spec, name, { text }) => {
        spec(`does not guess a value when adjusting ${name} input`, async () => {
            element.control.value = text;
            element.handleTextInput();
            await waitForUpdatesAsync();
            element.control.setSelectionRange(0, 0);
            element.control.click();
            element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe('');
            expect(element.control.value).toBe(text);
            expect(element.control.selectionStart).toBe(0);
            expect(element.control.selectionEnd).toBe(0);
        });
    });

    it('adjusts localized date-only input with RTL navigation', async () => {
        lang.setValueFor(element, 'de-DE');
        direction.setValueFor(element, Direction.rtl);
        element.type = 'date';
        element.value = '2024-01-31';
        await waitForUpdatesAsync();
        element.control.setSelectionRange(4, 4);
        element.control.click();
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-02-29');
        expect(element.control.value).toBe('29.02.2024');
        expect(element.control.selectionStart).toBe(3);
        expect(element.control.selectionEnd).toBe(5);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
        expect(element.control.selectionStart).toBe(6);
        expect(element.control.selectionEnd).toBe(10);
    });

    parameterizeSpec([
        { name: 'minimum year', value: '0001-01-01T00:00', key: 'ArrowDown' },
        { name: 'maximum year', value: '9999-12-31T23:59', key: 'ArrowUp' }
    ], (spec, name, { value, key }) => {
        spec(`does not adjust beyond the ${name}`, async () => {
            element.value = value;
            await waitForUpdatesAsync();
            const input = jasmine.createSpy('input');
            element.addEventListener('input', input);
            element.control.setSelectionRange(6, 10);
            element.control.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(value);
            expect(input).not.toHaveBeenCalled();
        });
    });

    it('validates adjusted values without snapping to min/max or step', async () => {
        element.min = element.value;
        element.max = element.value;
        element.step = '900';
        await waitForUpdatesAsync();
        element.control.setSelectionRange(14, 16);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T14:26');
        expect(element.validity.rangeOverflow).toBeTrue();
        expect(element.validity.stepMismatch).toBeTrue();
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13T14:24');
        expect(element.validity.rangeUnderflow).toBeTrue();
    });

    parameterizeSpec([
        { name: 'disabled', disabled: true, readOnly: false },
        { name: 'readonly', disabled: false, readOnly: true }
    ], (spec, name, { disabled, readOnly }) => {
        spec(`does not adjust or highlight ${name} input`, async () => {
            element.disabled = disabled;
            element.readOnly = readOnly;
            await waitForUpdatesAsync();
            element.control.setSelectionRange(1, 1);
            element.control.click();
            element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe('2024-11-13T14:25');
            expect(element.control.selectionStart).toBe(1);
            expect(element.control.selectionEnd).toBe(1);
        });
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

    it('keeps unavailable days focusable for directional navigation but prevents selection', async () => {
        element.type = 'date';
        element.value = '2024-11-12';
        element.min = '2024-11-10';
        element.max = '2024-11-20';
        element.step = '2';
        element.open = true;
        await waitForPickerLoaded();
        const key = (date: string, value: string): void => {
            element.shadowRoot!.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)!
                .dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
        };
        key('2024-11-12', 'ArrowRight');
        await waitForUpdatesAsync();
        const unavailable = element.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2024-11-13"]')!;
        expect(element.focusedDate).toBe('2024-11-13');
        expect(element.shadowRoot!.activeElement).toBe(unavailable);
        expect(unavailable.getAttribute('aria-disabled')).toBe('true');
        unavailable.click();
        expect(element.value).toBe('2024-11-12');
        key('2024-11-13', 'ArrowRight');
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe('2024-11-14');
        key('2024-11-14', 'ArrowLeft');
        await waitForUpdatesAsync();
        expect(element.focusedDate).toBe('2024-11-13');
    });

    it('keeps an enabled grid tab stop when returning to a constrained month without moving header focus', async () => {
        element.type = 'date';
        element.value = '2024-11-12';
        element.min = '2024-11-10';
        element.max = '2024-11-20';
        element.step = '2';
        element.open = true;
        await waitForPickerLoaded();
        const month = element.shadowRoot!.querySelector<HTMLElementTagNameMap['nimble-select']>('.month')!;
        month.focus();
        element.moveMonth(1);
        await waitForUpdatesAsync();
        element.moveMonth(-1);
        await waitForUpdatesAsync();
        const day = element.shadowRoot!.querySelector<HTMLButtonElement>('.day[tabindex="0"]')!;
        expect(element.isDayDisabled(new Date(`${day.dataset.date}T00:00Z`))).toBeFalse();
        expect(day.dataset.date?.startsWith('2024-11-')).toBeTrue();
        expect(element.shadowRoot!.activeElement).toBe(month);
    });

    it('shows accessible constraint errors immediately after segment adjustment', async () => {
        element.max = element.value;
        await waitForUpdatesAsync();
        element.control.setSelectionRange(14, 16);
        element.control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();
        expect(element.validity.rangeOverflow).toBeTrue();
        expect(element.entryError).not.toBe('');
        expect(element.control.getAttribute('aria-invalid')).toBe('true');
        expect(element.control.getAttribute('aria-describedby')).toContain('entry-error');
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
            if (property === 'readOnly') {
                expect(element.shadowRoot!.querySelector('.calendar-trigger')).toBeNull();
            } else {
                expect(element.trigger.disabled).toBeTrue();
            }
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

    it('omits the calendar button when initially readonly and restores it when editable', async () => {
        await disconnect();
        const view = await fixture<FvDateTimePicker>(html`
            <${fvDateTimePickerTag} readonly value="2024-11-13T14:25">Scheduled time</${fvDateTimePickerTag}>
        `);
        element = view.element;
        disconnect = view.disconnect;
        await view.connect();
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.calendar-trigger')).toBeNull();
        expect(element.control.readOnly).toBeTrue();
        element.readOnly = false;
        await waitForUpdatesAsync();
        expect(element.shadowRoot!.querySelector('.calendar-trigger')).toBe(element.trigger);
        expect(element.trigger.disabled).toBeFalse();
        element.trigger.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeTrue();
        element.readOnly = true;
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(element.shadowRoot!.querySelector('.calendar-trigger')).toBeNull();
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
            expect(element.shadowRoot!.querySelector(`[data-date="${date}"]`)!.getAttribute('aria-disabled')).withContext(date).toBe('true');
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

    it('preserves programmatic updates when dismissing a Time field with a pending native change', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const field = element.timeField!;
        const control = field.control;
        control.value = '09:07 AM';
        control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.value).toBe('2024-11-13T09:07');
        element.value = '2025-01-01T10:00';
        expect(field.value.replace(/\s/g, ' ')).toBe('10:00 AM');
        expect(control.value.replace(/\s/g, ' ')).toBe('10:00 AM');
        // Native change runs synchronously during blur, before queued bindings settle.
        spyOn(control, 'blur').and.callFake(() => {
            control.dispatchEvent(new Event('change', { bubbles: true }));
        });
        element.closePicker();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2025-01-01T10:00');
        expect(element.control.value.replace(/\s/g, ' ')).toBe('01/01/2025 10:00 AM');
    });

    parameterizeSpec([
        { name: 'valid paste then blur', paste: '2025-01-02T10:30', enter: false },
        { name: 'valid paste then Enter', paste: '2025-01-02T10:30', enter: true },
        { name: 'invalid paste then blur', paste: '2025-02-30T10:30', enter: false },
        { name: 'invalid paste then Enter', paste: '2025-02-30T10:30', enter: true }
    ], (spec, name, { paste: text, enter }) => {
        spec(`commits ${name} without a native change event`, async () => {
            const change = jasmine.createSpy('change');
            element.addEventListener('change', change);
            element.control.select();
            const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, composed: true });
            Object.defineProperty(paste, 'clipboardData', { value: { getData: () => text } });
            element.control.dispatchEvent(paste);
            expect(change).not.toHaveBeenCalled();
            element.control.dispatchEvent(enter
                ? new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
                : new FocusEvent('blur'));
            await waitForUpdatesAsync();
            expect(change).toHaveBeenCalledTimes(1);
            if (text.includes('02-30')) {
                expect(element.value).toBe('');
                expect(element.entryError).not.toBe('');
            } else {
                expect(element.value).toBe(text);
            }
        });
    });

    parameterizeSpec([
        { name: 'main', popup: false },
        { name: 'Time', popup: true }
    ], (spec, name, { popup }) => {
        spec(`commits ordinary ${name} typing on Enter once, including a later native change`, async () => {
            element.value = '';
            element.open = popup;
            await waitForUpdatesAsync();
            const control = popup ? element.timeField!.control : element.control;
            const change = jasmine.createSpy('change');
            element.addEventListener('change', change);
            control.value = popup ? '02:25' : '11/13/2024 02:25';
            control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
            await waitForUpdatesAsync();
            expect(element.value).toBe(`${popup ? element.dateKey(calendarToday()) : '2024-11-13'}T02:25`);
            expect(element.checkValidity()).toBeTrue();
            expect(change).toHaveBeenCalledTimes(1);
            control.dispatchEvent(new Event('change', { bubbles: true }));
            control.dispatchEvent(new FocusEvent('blur'));
            await waitForUpdatesAsync();
            expect(change).toHaveBeenCalledTimes(1);
        });
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
        provider.invalidDateTime = 'Datum und Uhrzeit eingeben.';
        const themeProvider = document.createElement(themeProviderTag);
        element.parentElement!.appendChild(themeProvider);
        themeProvider.appendChild(provider);
        themeProvider.appendChild(element);
        element.open = true;
        await waitForUpdatesAsync();
        expect(element.trigger.ariaLabel).toBe('Datum und Uhrzeit auswählen');
        expect(element.timeField!.textContent).toContain('Uhrzeit');
        element.control.value = '11/';
        element.control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        expect(element.validationMessage).toBe('Datum und Uhrzeit eingeben.');
    });
});
