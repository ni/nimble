import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Direction, direction, lang, themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { fixture } from '../../../utilities/tests/fixture';
import { FvDateTimePicker, fvDateTimePickerTag } from '..';
import { FvDateTimePickerAppearance } from '../types';
import { fvDateTimePickerLabelProviderTag } from '../label-provider';
import { dateKey, today as calendarToday } from '../models/date-time';
import { FvDateTimePickerPageObject } from '../testing/fv-date-time-picker.pageobject';

describe('FvDateTimePicker', () => {
    let element: FvDateTimePicker;
    let pageObject: FvDateTimePickerPageObject;
    let disconnect: () => Promise<void>;

    const todayKey = (): string => dateKey(calendarToday());
    // The component's own formatting is the expected display text for tests that
    // would otherwise need to hard-code every locale and precision combination.
    const displayText = (): string => element.displayValue.replace(/\s/g, ' ');
    const timeDisplayText = (): string => element.timeDisplay.replace(/\s/g, ' ');

    beforeEach(async () => {
        const view = await fixture<FvDateTimePicker>(html`
            <${fvDateTimePickerTag} name="scheduled" value="2024-11-13T14:25">Scheduled time</${fvDateTimePickerTag}>
        `);
        element = view.element;
        pageObject = new FvDateTimePickerPageObject(element);
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
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25 PM');
        expect(pageObject.isInputLabelled()).toBeTrue();
        expect(element.checkValidity()).toBeTrue();
    });

    it('associates application help text across the input shadow boundary', async () => {
        const help = document.createElement('p');
        help.id = 'schedule-help';
        help.textContent = 'Use the local time of the test station.';
        element.parentElement!.appendChild(help);
        element.ariaDescribedby = help.id;
        await waitForUpdatesAsync();
        expect(pageObject.getInputDescribedByIds()).toEqual(['schedule-help']);
        await pageObject.typeInputText('11/', { commit: true });
        expect(pageObject.getEntryErrorText()).not.toBe('');
        expect(pageObject.getInputDescribedByIds()).toEqual(['schedule-help', 'entry-error']);
        expect(pageObject.isInputDescribedByPickerEntryError()).toBeFalse();
        element.open = true;
        await pageObject.waitForPickerLoaded();
        expect(pageObject.getInputDescribedByIds()).toEqual(['schedule-help', 'entry-error']);
        expect(pageObject.isInputDescribedByPickerEntryError()).toBeTrue();
        element.ariaDescribedby = '';
        await waitForUpdatesAsync();
        expect(pageObject.getInputDescribedByIds()).toEqual(['entry-error']);
        expect(pageObject.isInputDescribedByPickerEntryError()).toBeTrue();
    });

    it('does not implicitly submit the form when pressing Enter on the calendar button', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        const submit = document.createElement('button');
        submit.type = 'submit';
        form.appendChild(submit);
        const click = jasmine.createSpy('click');
        submit.addEventListener('click', event => {
            event.preventDefault();
            click();
        });
        await waitForUpdatesAsync();
        await pageObject.pressEnterOnCalendarButton();
        expect(click).not.toHaveBeenCalled();
    });

    it('opens the selected month with a six-week grid and selected day', async () => {
        await pageObject.clickCalendarButton();
        expect(element.open).toBeTrue();
        expect(pageObject.getDisplayedMonth()).toBe(10);
        expect(pageObject.getDisplayedYear()).toBe(2024);
        expect(pageObject.getPickerButtonCount()).toBe(2);
        expect(pageObject.getGridCellCount()).toBe(42);
        expect(pageObject.getSelectedDay()).toBe('2024-11-13');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-13');
    });

    it('opens and closes the calendar in the top layer', async () => {
        element.trigger.click();
        await pageObject.waitForPickerLoaded();
        const region = element.region!;
        expect(region.matches(':popover-open')).toBeTrue();
        element.open = false;
        await waitForUpdatesAsync();
        expect(region.matches(':popover-open')).toBeFalse();
        element.open = true;
        await pageObject.waitForPickerLoaded();
        expect(element.region!.matches(':popover-open')).toBeTrue();
    });

    it('updates the calendar when a containing shadow-root scroller moves', async () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const scroller = document.createElement('div');
        element.parentElement!.appendChild(host);
        root.appendChild(scroller);
        scroller.appendChild(element);
        element.trigger.click();
        await pageObject.waitForPickerLoaded();
        const update = spyOn(element.region!, 'update').and.callThrough();
        scroller.dispatchEvent(new Event('scroll'));
        expect(update).toHaveBeenCalled();
        element.open = false;
        await waitForUpdatesAsync();
        update.calls.reset();
        scroller.dispatchEvent(new Event('scroll'));
        expect(update).not.toHaveBeenCalled();
    });

    it('moves focus into the calendar when Alt+Down opens it from the input', async () => {
        pageObject.focusInput();
        await pageObject.pressInputKey('ArrowDown', { altKey: true });
        await pageObject.waitForPickerLoaded();
        expect(pageObject.getActiveDay()).toBe('2024-11-13');
    });

    parameterizeSpec([
        { name: 'date', type: 'date' as const },
        { name: 'datetime-local', type: 'datetime-local' as const }
    ], (spec, name, { type }) => {
        spec(`omits the Done button and only shows the time row in datetime-local mode (${name})`, async () => {
            element.type = type;
            element.open = true;
            await waitForUpdatesAsync();
            expect(pageObject.getPickerButtonCount()).toBe(2);
            expect(pageObject.hasTimeRow()).toBe(type === 'datetime-local');
        });
    });

    it('uses fixed placement without viewport locks while allowing automatic popup direction', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        expect(pageObject.isPickerFixedPlacement()).toBeTrue();
        expect(pageObject.isPickerViewportLocked()).toBeFalse();
        expect(pageObject.getPickerVerticalPositioningMode()).toBe('dynamic');
    });

    it('commits date selection, preserving time and emitting one event pair', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        element.open = true;
        await waitForUpdatesAsync();
        await pageObject.clickDay('2024-11-21');
        expect(element.value).toBe('2024-11-21T14:25');
        expect(pageObject.getInputText()).toBe('11/21/2024 02:25 PM');
        expect(input).toHaveBeenCalledTimes(1);
        expect(change).toHaveBeenCalledTimes(1);
    });

    parameterizeSpec([
        { name: 'typed month', value: '2024-12-13T14:25', text: '12/13/2024 02:25 PM' },
        { name: 'typed year', value: '2025-11-13T14:25', text: '11/13/2025 02:25 PM' }
    ], (spec, name, { value, text }) => {
        spec(`synchronizes the open calendar with the ${name} without stealing focus`, async () => {
            element.open = true;
            await pageObject.waitForPickerLoaded();
            pageObject.focusInput();
            await pageObject.typeInputText(text);
            expect(element.value).toBe(value);
            expect(pageObject.getDisplayedMonth()).toBe(Number(value.slice(5, 7)) - 1);
            expect(pageObject.getDisplayedYear()).toBe(Number(value.slice(0, 4)));
            expect(pageObject.getSelectedDay()).toBe(value.slice(0, 10));
            expect(pageObject.getGridTabStopDay()).toBe(value.slice(0, 10));
            expect(pageObject.isInputFocused()).toBeTrue();
        });
    });

    it('synchronizes segment adjustment and ISO paste with the open calendar', async () => {
        element.value = '2024-12-31T14:25';
        element.open = true;
        await pageObject.waitForPickerLoaded();
        pageObject.focusInput();
        pageObject.setInputSelection(0, 2);
        await pageObject.pressInputKey('ArrowUp');
        expect(pageObject.getDisplayedYear()).toBe(2025);
        expect(pageObject.getDisplayedMonth()).toBe(0);
        expect(pageObject.getGridTabStopDay()).toBe('2025-01-31');
        expect(pageObject.getInputSelectionStart()).toBe(0);
        expect(pageObject.getInputSelectionEnd()).toBe(2);
        pageObject.selectAllInputText();
        await pageObject.pasteIntoInput('2023-02-28T14:25');
        expect(pageObject.getDisplayedYear()).toBe(2023);
        expect(pageObject.getDisplayedMonth()).toBe(1);
        expect(pageObject.getGridTabStopDay()).toBe('2023-02-28');
        expect(pageObject.isInputFocused()).toBeTrue();
    });

    it('preserves calendar browsing on time-only edits and incomplete date drafts', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.clickNextMonth();
        await pageObject.clickNextMonth();
        const browsedMonth = pageObject.getDisplayedMonth();
        const browsedYear = pageObject.getDisplayedYear();
        await pageObject.typeInputText('11/13/2024 03:25 PM');
        expect(pageObject.getDisplayedMonth()).toBe(browsedMonth);
        expect(pageObject.getDisplayedYear()).toBe(browsedYear);
        await pageObject.typeInputText('02/30/2025 03:25 PM');
        expect(pageObject.getDisplayedMonth()).toBe(browsedMonth);
        expect(pageObject.getDisplayedYear()).toBe(browsedYear);
    });

    it('marks today independently of selection', async () => {
        const today = calendarToday();
        element.value = `${todayKey()}T14:25`;
        element.open = true;
        await waitForUpdatesAsync();
        expect(pageObject.getTodayDay()).toBe(todayKey());
        expect(pageObject.isTodaySelected()).toBeTrue();
        const next = new Date(today);
        next.setUTCDate(today.getUTCDate() === 1 ? 2 : today.getUTCDate() - 1);
        await pageObject.clickDay(dateKey(next));
        expect(pageObject.getSelectedDay()).toBe(dateKey(next));
        expect(pageObject.getTodayDay()).toBe(todayKey());
    });

    it('selects an adjacent-month day and updates the displayed month', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        expect(pageObject.isDayOutsideMonth('2024-10-31')).toBeTrue();
        expect(pageObject.isDayDisabled('2024-10-31')).toBeFalse();
        await pageObject.clickDay('2024-10-31');
        expect(element.value).toBe('2024-10-31T14:25');
        expect(pageObject.getDisplayedMonth()).toBe(9);
        expect(pageObject.isDayOutsideMonth(pageObject.getSelectedDay()!)).toBeFalse();
    });

    it('commits time changes without leaking the inner change event', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        await pageObject.typeTimeText('09:07 AM', { commit: true });
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
        },
        {
            name: 'AM to PM with Up', value: '2024-11-13T02:25', start: 6, end: 8, key: 'ArrowUp', expected: '2024-11-13T14:25'
        },
        {
            name: 'PM to AM with Up', value: '9999-12-31T12:25', start: 6, end: 8, key: 'ArrowUp', expected: '9999-12-31T00:25'
        },
        {
            name: 'AM to PM with Down', value: '0001-01-01T00:25', start: 6, end: 8, key: 'ArrowDown', expected: '0001-01-01T12:25'
        }
    ], (spec, name, { value, start, end, key, expected }) => {
        spec(`highlights and adjusts the popover ${name} without leaking events`, async () => {
            element.value = value;
            element.open = true;
            await pageObject.waitForPickerLoaded();
            await pageObject.clickTimeAtPosition(start);
            expect(pageObject.getTimeSelectionStart()).toBe(start);
            expect(pageObject.getTimeSelectionEnd()).toBe(end);
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            expect(await pageObject.pressTimeKey(key)).toBeFalse();
            expect(element.value).toBe(expected);
            expect(pageObject.getTimeText()).toBe(timeDisplayText());
            expect(pageObject.getTimeSelectionStart()).toBe(start);
            expect(pageObject.getTimeSelectionEnd()).toBe(end);
            expect(element.open).toBeTrue();
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('replaces and deletes popover segments without shifting other time fields', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        pageObject.setTimeSelection(3, 5);
        await pageObject.insertTimeText('0');
        await pageObject.insertTimeText('7');
        expect(element.value).toBe('2024-11-13T14:07');
        expect(pageObject.getTimeText()).toBe('02:07 PM');
        pageObject.setTimeSelection(1, 1);
        await pageObject.deleteTime('deleteContentForward');
        expect(pageObject.getTimeText()).toBe('00:07 PM');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        await pageObject.clickTimeAtPosition(0);
        await pageObject.insertTimeText('11');
        await pageObject.pressTimeKey('Enter');
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
            await pageObject.waitForPickerLoaded();
            pageObject.focusTimeInput();
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            pageObject.setTimeSelection(3, 5);
            await pageObject.insertTimeText('07', { commit: name.startsWith('native') });
            if (name === 'Escape') {
                await pageObject.pressTimeKey('Escape');
            } else {
                await pageObject.pointerDownOutsidePicker();
            }
            expect(element.open).toBeFalse();
            expect(element.value).toBe('2024-11-13T14:07');
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('increases both masks precision after a committed Time edit when constraints change', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        pageObject.setTimeSelection(3, 5);
        await pageObject.insertTimeText('07');
        await pageObject.pressTimeKey('Enter');
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(pageObject.getTimeText()).toBe('02:07:00.000 PM');
        expect(pageObject.getInputText()).toBe('11/13/2024 02:07:00.000 PM');
        await pageObject.typeTimeText('02:07:01.123 PM');
        expect(element.value).toBe('2024-11-13T14:07:01.123');
    });

    it('preserves invalid Time drafts when constraints increase precision', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('02:');
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(pageObject.getTimeText()).toBe('02:');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
    });

    it('preserves invalid main drafts when constraints increase precision', async () => {
        await pageObject.typeInputText('11/13/2024 02:');
        element.step = '0.001';
        await waitForUpdatesAsync();
        expect(pageObject.getInputText()).toBe('11/13/2024 02:');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
    });

    it('associates the Time error with its actual input across shadow roots', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('02:', { commit: true });
        expect(pageObject.getEntryErrorText()).toContain('Enter a valid time.');
        expect(pageObject.getTimeDescribedByIds()).toEqual(['entry-error']);
        await pageObject.typeTimeText('02:25 PM', { commit: true });
        expect(pageObject.getTimeDescribedByIds()).toEqual([]);
    });

    it('keeps main and popover edit state independent and reconnects listeners after reopening', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        pageObject.setTimeSelection(3, 5);
        await pageObject.insertTimeText('1');
        element.open = false;
        await waitForUpdatesAsync();
        element.open = true;
        await pageObject.waitForPickerLoaded();
        const input = jasmine.createSpy('input');
        element.addEventListener('input', input);
        pageObject.setTimeSelection(0, 2);
        await pageObject.pressTimeKey('ArrowUp');
        expect(element.value).toBe('2024-11-13T15:01');
        expect(input).toHaveBeenCalledTimes(1);
        expect(pageObject.getTimeSelectionStart()).toBe(0);
        expect(pageObject.getTimeSelectionEnd()).toBe(2);
    });

    it('focuses the calendar button before reopening so Safari does not dismiss the time field', async () => {
        pageObject.focusInput();
        expect(await pageObject.mouseDownCalendarButton(0)).toBeFalse();
        expect(pageObject.isCalendarButtonFocused()).toBeTrue();
        await pageObject.clickCalendarButton();
        await pageObject.waitForPickerLoaded();
        expect(element.open).toBeTrue();
        await pageObject.pressInputKey('Escape');
        expect(element.open).toBeFalse();
        expect(await pageObject.mouseDownCalendarButton(2)).toBeTrue();
        await pageObject.mouseDownCalendarButton(0);
        await pageObject.clickCalendarButton();
        await pageObject.waitForPickerLoaded();
        expect(element.open).toBeTrue();
        expect(pageObject.hasTimeField()).toBeTrue();
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
            await pageObject.waitForPickerLoaded();
            await pageObject.clickTimeAtPosition(0);
            await pageObject.pressTimeKey(rtl ? 'ArrowLeft' : 'ArrowRight');
            expect(pageObject.getTimeSelectionStart()).toBe(3);
            expect(pageObject.getTimeSelectionEnd()).toBe(5);
            await pageObject.pressTimeKey('ArrowUp');
            expect(element.value).toBe('2024-11-13T14:26');
            expect(element.validity.rangeOverflow).toBeTrue();
            expect(element.validity.stepMismatch).toBeTrue();
            pageObject.selectAllTimeText();
            expect(await pageObject.pressTimeKey('ArrowUp')).toBeTrue();
            expect(await pageObject.pressTimeKey('Tab')).toBeTrue();
        });
    });

    it('keeps direct input, form value, and validity in sync', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        await waitForUpdatesAsync();
        await pageObject.typeInputText('02/29/2024 11:59 PM');
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
        pageObject.setInputSelection(0, 0);
        expect(await pageObject.pasteIntoInput('02/29/2024 11:59 PM')).toBeFalse();
        expect(pageObject.getInputText()).toBe('02/29/2024 11:59 PM');
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
            await pageObject.clickInputAtPosition(position);
            expect(pageObject.getInputSelectionStart()).toBe(start);
            expect(pageObject.getInputSelectionEnd()).toBe(end);
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
        { name: 'PM to AM with Down', value: '2024-11-13T14:25', position: 17, key: 'ArrowDown', expected: '2024-11-13T02:25' },
        { name: 'PM to AM with Up', value: '9999-12-31T12:25', position: 17, key: 'ArrowUp', expected: '9999-12-31T00:25' },
        { name: 'AM to PM with Down', value: '0001-01-01T00:25', position: 17, key: 'ArrowDown', expected: '0001-01-01T12:25' },
        { name: 'DST gap', value: '2024-03-10T01:30', position: 11, key: 'ArrowUp', expected: '2024-03-10T02:30' }
    ], (spec, name, { value, position, key, expected }) => {
        spec(`adjusts ${name} and retains the selected segment`, async () => {
            element.value = value;
            await waitForUpdatesAsync();
            await pageObject.clickInputAtPosition(position);
            const start = pageObject.getInputSelectionStart();
            const end = pageObject.getInputSelectionEnd();
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            expect(await pageObject.pressInputKey(key)).toBeFalse();
            expect(element.value).toBe(expected);
            expect(pageObject.getInputText()).toBe(displayText());
            expect(pageObject.getInputSelectionStart()).toBe(start);
            expect(pageObject.getInputSelectionEnd()).toBe(end);
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('navigates segments without trapping Left/Right at a selection boundary', async () => {
        await pageObject.clickInputAtPosition(1);
        for (const [key, start, end] of [
            ['ArrowRight', 3, 5], ['ArrowRight', 6, 10], ['ArrowLeft', 3, 5], ['End', 17, 19], ['Home', 0, 2]
        ] as const) {
            // eslint-disable-next-line no-await-in-loop
            await pageObject.pressInputKey(key);
            expect(pageObject.getInputSelectionStart()).toBe(start);
            expect(pageObject.getInputSelectionEnd()).toBe(end);
        }
    });

    it('handles End from a separator and adjusts at the end of the text', async () => {
        pageObject.setInputSelection(10, 10);
        await pageObject.pressInputKey('End');
        expect(pageObject.getInputSelectionStart()).toBe(17);
        expect(pageObject.getInputSelectionEnd()).toBe(19);
        pageObject.setInputSelection(19, 19);
        await pageObject.pressInputKey('ArrowDown');
        expect(element.value).toBe('2024-11-13T02:25');
        expect(pageObject.getInputSelectionStart()).toBe(17);
        expect(pageObject.getInputSelectionEnd()).toBe(19);
    });

    it('does not restore an old selection after adjusting and immediately navigating', async () => {
        pageObject.setInputSelection(3, 5);
        await pageObject.pressInputKeysInSameTick(['ArrowUp', 'ArrowRight']);
        expect(element.value).toBe('2024-11-14T14:25');
        expect(pageObject.getInputSelectionStart()).toBe(6);
        expect(pageObject.getInputSelectionEnd()).toBe(10);
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
            pageObject.setInputSelection(start, end);
            expect(await pageObject.typeInputDigits(digits)).toBeFalse();
            expect(element.value).toBe(expected);
            expect(input).toHaveBeenCalledTimes(digits.length);
            expect(change).not.toHaveBeenCalled();
            await pageObject.blurInput();
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
        pageObject.setInputSelection(3, 5);
        await pageObject.insertInputText('2');
        await pageObject.pressInputKey('Enter');
        await pageObject.blurInput();
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
            pageObject.setInputSelection(start, end);
            expect(await pageObject.deleteInput(inputType)).toBeFalse();
            expect(pageObject.getInputText()).toBe(expected);
            expect(pageObject.getInputSelectionStart()).toBe(caret);
            expect(pageObject.getInputSelectionEnd()).toBe(caret);
        });
    });

    it('keeps deletion drafts positional until corrected, with normal validation and events', async () => {
        const input = jasmine.createSpy('input');
        const change = jasmine.createSpy('change');
        element.addEventListener('input', input);
        element.addEventListener('change', change);
        pageObject.setInputSelection(3, 5);
        await pageObject.deleteInput('deleteContentBackward');
        pageObject.setInputSelection(7, 7);
        await pageObject.deleteInput('deleteContentForward');
        await pageObject.blurInput();
        expect(pageObject.getInputText()).toBe('11/00/2024 02:25 PM');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(pageObject.getEntryErrorText()).not.toBe('');
        expect(input).toHaveBeenCalledTimes(1);
        expect(change).toHaveBeenCalledTimes(1);
        await pageObject.clickInputAtPosition(3);
        await pageObject.insertInputText('21');
        await pageObject.blurInput();
        expect(element.value).toBe('2024-11-21T14:25');
        expect(element.checkValidity()).toBeTrue();
        expect(pageObject.getEntryErrorText()).toBe('');
    });

    it('leaves clearing all text and deletion during initial entry to the native mask', async () => {
        pageObject.selectAllInputText();
        await pageObject.deleteInput('deleteContentBackward');
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25 PM');
        element.value = '';
        await waitForUpdatesAsync();
        await pageObject.typeInputCharacters('111');
        expect(pageObject.getInputText()).toBe('11/1');
        pageObject.setInputSelection(4, 4);
        await pageObject.deleteInput('deleteContentBackward');
        expect(pageObject.getInputText()).toBe('11/1');
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
            const length = pageObject.getInputText().length;
            pageObject.setInputSelection(position, position);
            await pageObject.deleteInput('deleteContentForward');
            expect(element.value).toBe(expected);
            expect(pageObject.getInputText().length).toBe(length);
        });
    });

    it('does not handle canceled input or truncate text longer than the selected segment', async () => {
        pageObject.setInputSelection(3, 5);
        const cancel = (event: Event): void => event.preventDefault();
        element.addEventListener('beforeinput', cancel, { capture: true });
        await pageObject.insertInputText('2');
        element.removeEventListener('beforeinput', cancel, { capture: true });
        expect(await pageObject.insertInputText('2025')).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25 PM');
    });

    it('preserves drag selections, Select All, modifier shortcuts, and Tab', async () => {
        pageObject.setInputSelection(1, 8);
        await pageObject.clickInput();
        expect(pageObject.getInputSelectionStart()).toBe(1);
        expect(pageObject.getInputSelectionEnd()).toBe(8);
        pageObject.selectAllInputText();
        await pageObject.pressInputKey('a', { ctrlKey: true });
        expect(pageObject.getInputSelectionStart()).toBe(0);
        expect(pageObject.getInputSelectionEnd()).toBe(pageObject.getInputText().length);
        expect(await pageObject.pressInputKey('ArrowUp')).toBeTrue();
        expect(await pageObject.pressInputKey('ArrowRight', { shiftKey: true })).toBeTrue();
        expect(await pageObject.pressInputKey('Tab')).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
    });

    parameterizeSpec([
        { name: 'empty', text: '' },
        { name: 'incomplete', text: '11/13/2024 02:' },
        { name: 'impossible', text: '02/30/2024 02:25 PM' }
    ], (spec, name, { text }) => {
        spec(`does not guess a value when adjusting ${name} input`, async () => {
            await pageObject.typeInputText(text);
            await pageObject.clickInputAtPosition(0);
            await pageObject.pressInputKey('ArrowUp');
            expect(element.value).toBe('');
            expect(pageObject.getInputText()).toBe(text);
            expect(pageObject.getInputSelectionStart()).toBe(0);
            expect(pageObject.getInputSelectionEnd()).toBe(0);
        });
    });

    it('adjusts localized date-only input with RTL navigation', async () => {
        lang.setValueFor(element, 'de-DE');
        direction.setValueFor(element, Direction.rtl);
        element.type = 'date';
        element.value = '2024-01-31';
        await waitForUpdatesAsync();
        await pageObject.clickInputAtPosition(4);
        await pageObject.pressInputKey('ArrowUp');
        expect(element.value).toBe('2024-02-29');
        expect(pageObject.getInputText()).toBe('29.02.2024');
        expect(pageObject.getInputSelectionStart()).toBe(3);
        expect(pageObject.getInputSelectionEnd()).toBe(5);
        await pageObject.pressInputKey('ArrowLeft');
        expect(pageObject.getInputSelectionStart()).toBe(6);
        expect(pageObject.getInputSelectionEnd()).toBe(10);
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
            pageObject.setInputSelection(6, 10);
            await pageObject.pressInputKey(key);
            expect(element.value).toBe(value);
            expect(input).not.toHaveBeenCalled();
        });
    });

    it('validates adjusted values without snapping to min/max or step', async () => {
        element.min = element.value;
        element.max = element.value;
        element.step = '900';
        await waitForUpdatesAsync();
        pageObject.setInputSelection(14, 16);
        await pageObject.pressInputKey('ArrowUp');
        expect(element.value).toBe('2024-11-13T14:26');
        expect(element.validity.rangeOverflow).toBeTrue();
        expect(element.validity.stepMismatch).toBeTrue();
        await pageObject.pressInputKeysInSameTick(['ArrowDown', 'ArrowDown']);
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
            await pageObject.clickInputAtPosition(1);
            await pageObject.pressInputKey('ArrowUp');
            expect(element.value).toBe('2024-11-13T14:25');
            expect(pageObject.getInputSelectionStart()).toBe(1);
            expect(pageObject.getInputSelectionEnd()).toBe(1);
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
            pageObject.selectAllInputText();
            expect(await pageObject.pasteIntoInput(text)).toBeFalse();
            expect(element.value).toBe(value);
            expect(pageObject.getInputText()).toBe(displayText());
            expect(element.validity.badInput).toBeFalse();
            expect(input).toHaveBeenCalledTimes(1);
            expect(change).not.toHaveBeenCalled();
            await pageObject.leaveInput();
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
            expect(await pageObject.pasteIntoInput(text)).toBeFalse();
            expect(element.value).toBe(expected);
            expect(pageObject.getInputText()).toBe(displayText());
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
            pageObject.selectAllInputText();
            expect(await pageObject.pasteIntoInput(text, { commit: true })).toBeFalse();
            expect(pageObject.getInputText()).toBe(text);
            expect(element.value).toBe('');
            expect(element.validity.badInput).toBeTrue();
            expect(pageObject.getEntryErrorText()).not.toBe('');
            pageObject.selectAllInputText();
            expect(await pageObject.pasteIntoInput('02/29/2024 11:59 PM')).toBeFalse();
            expect(element.value).toBe('2024-02-29T23:59');
            expect(element.checkValidity()).toBeTrue();
            expect(pageObject.getEntryErrorText()).toBe('');
        });
    });

    it('validates pasted ISO values against form constraints without changing them', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.min = '2024-03-01T00:00';
        element.step = '900';
        await waitForUpdatesAsync();
        pageObject.selectAllInputText();
        expect(await pageObject.pasteIntoInput('2024-02-29T23:59')).toBeFalse();
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
            pageObject.setInputSelection(0, 0);
            expect(await pageObject.pasteIntoInput(text)).toBeFalse();
            expect(element.value).toBe(value);
            expect(pageObject.getInputText()).toBe(displayText());
            expect(element.checkValidity()).toBeTrue();
        });
    });

    parameterizeSpec([
        { name: 'midnight', display: '12:00 AM', value: '00:00' },
        { name: 'noon', display: '12:00 PM', value: '12:00' },
        { name: 'morning', display: '01:05 AM', value: '01:05' },
        { name: 'evening', display: '11:59 PM', value: '23:59' },
        { name: 'lowercase AM', display: '01:05 am', value: '01:05' },
        { name: 'lowercase PM', display: '11:59 pm', value: '23:59' }
    ], (spec, name, { display, value }) => {
        spec(`converts ${name} entry to the 24-hour form value`, async () => {
            await pageObject.typeInputText(`11/13/2024 ${display}`);
            expect(element.value).toBe(`2024-11-13T${value}`);
            expect(pageObject.getInputText()).toBe(`11/13/2024 ${display.toUpperCase()}`);
            expect(element.checkValidity()).toBeTrue();
        });
    });

    it('accepts typing lowercase pm one character at a time', async () => {
        await pageObject.typeInputText('11/13/2024 11:59');
        pageObject.setInputSelection(16, 16);
        await pageObject.typeInputCharacters('pm');
        expect(pageObject.getInputText().toUpperCase()).toBe('11/13/2024 11:59 PM');
        expect(element.value).toBe('2024-11-13T23:59');
        expect(element.checkValidity()).toBeTrue();
    });

    it('accepts lowercase PM in the popup time field', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('11:59 pm');
        expect(element.value).toBe('2024-11-13T23:59');
        expect(element.validity.badInput).toBeFalse();
    });

    it('preserves an incomplete day period while typing and recovers on programmatic updates', async () => {
        await pageObject.typeInputText('11/13/2024 02:25');
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(element.checkValidity()).toBeFalse();
        element.value = '2024-11-13T14:25';
        await waitForUpdatesAsync();
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25 PM');
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
            await pageObject.typeInputText(text);
            const input = jasmine.createSpy('input');
            const change = jasmine.createSpy('change');
            element.addEventListener('input', input);
            element.addEventListener('change', change);
            const previous = element.value;
            await pageObject.leaveInput();
            expect(element.value).toBe(value);
            expect(pageObject.getInputText()).toBe(display);
            expect(element.checkValidity()).toBeTrue();
            expect(input).toHaveBeenCalledTimes(previous === value ? 0 : 1);
            expect(change).toHaveBeenCalledTimes(1);
        });
    });

    it('completes omitted AM/PM in the popup without losing the selected date', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('09:07');
        expect(element.validity.badInput).toBeTrue();
        await pageObject.leaveTimeInput();
        expect(element.value).toBe('2024-11-13T09:07');
        expect(pageObject.getTimeText()).toBe('09:07 AM');
        expect(pageObject.isTimeValid()).toBeTrue();
        expect(element.checkValidity()).toBeTrue();
    });

    it('shows invalid popup time feedback and clears the main draft when corrected in the popup', async () => {
        await pageObject.typeInputText('11/');
        element.open = true;
        await pageObject.waitForPickerLoaded();
        for (const text of ['09:', '', ' ']) {
            // eslint-disable-next-line no-await-in-loop
            await pageObject.typeTimeText(text, { commit: true });
            expect(element.value).withContext(text).toBe('');
            expect(element.validity.badInput).withContext(text).toBeTrue();
            expect(pageObject.getEntryErrorText()).withContext(text).toBe('Enter a valid time.');
        }
        expect(pageObject.getTimeAriaInvalid()).toBe('true');
        await pageObject.typeTimeText('09:07', { commit: true });
        expect(pageObject.getInputText()).toBe(displayText());
        expect(element.checkValidity()).toBeTrue();
        expect(pageObject.getEntryErrorText()).toBe('');
    });

    it('shows accessible feedback for invalid committed drafts and clears it after correction or reset', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        await pageObject.typeInputText('02/30/2024 02:25', { commit: true });
        expect(pageObject.getInputText()).toBe('02/30/2024 02:25');
        expect(element.value).toBe('');
        expect(element.checkValidity()).toBeFalse();
        expect(pageObject.getEntryErrorText()).toContain(element.validationMessage);
        expect(pageObject.getInputAriaInvalid()).toBe('true');
        expect(pageObject.getInputDescribedByIds()).toContain('entry-error');
        await pageObject.typeInputText('02/29/2024 02:25 PM');
        expect(pageObject.getEntryErrorText()).toBe('');
        expect(pageObject.getInputAriaInvalid()).not.toBe('true');
        await pageObject.typeInputText('11/');
        form.reset();
        await waitForUpdatesAsync();
        expect(pageObject.getEntryErrorText()).toBe('');
        expect(element.checkValidity()).toBeTrue();
    });

    it('keeps constraints invalid after completion and preserves application error state', async () => {
        element.min = '2024-11-13T09:00';
        element.errorText = 'Application error';
        element.errorVisible = true;
        await pageObject.typeInputText('11/13/2024 02:25', { commit: true });
        expect(element.value).toBe('2024-11-13T02:25');
        expect(element.validity.rangeUnderflow).toBeTrue();
        expect(element.errorText).toBe('Application error');
        expect(element.errorVisible).toBeTrue();
        element.errorVisible = false;
        await waitForUpdatesAsync();
        expect(pageObject.getEntryErrorText()).toContain(element.validationMessage);
    });

    it('sanitizes invalid programmatic values and validates required like native controls', () => {
        for (const value of ['2023-02-29T10:00', '2024-11-31T10:00', '2024-11', '2024-11-13T24:00', '0000-01-01T10:00']) {
            element.value = value;
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
            expect(element.value).withContext(value).toBe(value);
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
        await pageObject.selectMonth(0);
        expect(pageObject.getDisplayedMonth()).toBe(0);
        expect(element.value).toBe('2024-11-13T14:25');
        expect(input).not.toHaveBeenCalled();
        expect(change).not.toHaveBeenCalled();
    });

    it('navigates months across year boundaries without changing the value', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        await pageObject.selectMonth(11);
        expect(pageObject.getDisplayedMonth()).toBe(11);
        await pageObject.clickNextMonth();
        expect(pageObject.getDisplayedYear()).toBe(2025);
        expect(pageObject.getDisplayedMonth()).toBe(0);
        expect(element.value).toBe('2024-11-13T14:25');
    });

    it('preserves picker focus between Safari mouse-down and month-button click', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        pageObject.focusDay('2024-11-13');
        expect(await pageObject.mouseDownNextMonthButton()).toBeFalse();
        expect(element.open).toBeTrue();
        await pageObject.clickNextMonth();
        expect(pageObject.getDisplayedMonth()).toBe(11);
        expect(element.open).toBeTrue();
    });

    it('navigates with Nimble year and month buttons without closing or committing', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        const change = jasmine.createSpy('change');
        element.addEventListener('change', change);
        await pageObject.selectYear(2028);
        expect(pageObject.getDisplayedYear()).toBe(2028);
        await pageObject.clickNextMonth();
        expect(pageObject.getDisplayedMonth()).toBe(11);
        expect(element.open).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
        expect(change).not.toHaveBeenCalled();
    });

    it('offers nearby years and includes displayed years outside the dropdown range', async () => {
        const currentYear = new Date().getUTCFullYear();
        element.open = true;
        await waitForUpdatesAsync();
        expect(pageObject.getYearOptions()).toContain(currentYear - 100);
        expect(pageObject.getYearOptions()).toContain(currentYear + 100);
        element.value = '0099-02-28T10:00';
        await waitForUpdatesAsync();
        expect(pageObject.getDisplayedYear()).toBe(99);
        expect(pageObject.getYearOptions()[0]).toBe(99);
        element.value = '9999-12-01T10:00';
        await waitForUpdatesAsync();
        expect(pageObject.getDisplayedYear()).toBe(9999);
        expect(pageObject.getYearOptions()).toContain(9999);
    });

    it('navigates the grid across months and clamps page navigation to month end', async () => {
        element.value = '2024-12-31T14:25';
        element.open = true;
        await pageObject.waitForPickerLoaded();
        expect(await pageObject.pressKeyOnDay('2024-12-31', 'ArrowRight')).toBeFalse();
        expect(pageObject.getGridTabStopDay()).toBe('2025-01-01');
        element.value = '2024-01-31T14:25';
        await waitForUpdatesAsync();
        await pageObject.pressKeyOnDay('2024-01-31', 'PageDown');
        expect(pageObject.getGridTabStopDay()).toBe('2024-02-29');
        expect(element.value).toBe('2024-01-31T14:25');
    });

    it('keeps unavailable days focusable for directional navigation but prevents selection', async () => {
        element.type = 'date';
        element.value = '2024-11-12';
        element.min = '2024-11-10';
        element.max = '2024-11-20';
        element.step = '2';
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.pressKeyOnDay('2024-11-12', 'ArrowRight');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-13');
        expect(pageObject.getActiveDay()).toBe('2024-11-13');
        expect(pageObject.isDayDisabled('2024-11-13')).toBeTrue();
        await pageObject.clickDay('2024-11-13');
        expect(element.value).toBe('2024-11-12');
        await pageObject.pressKeyOnDay('2024-11-13', 'ArrowRight');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-14');
        await pageObject.pressKeyOnDay('2024-11-14', 'ArrowLeft');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-13');
    });

    it('keeps an enabled grid tab stop when returning to a constrained month without moving header focus', async () => {
        element.type = 'date';
        element.value = '2024-11-12';
        element.min = '2024-11-10';
        element.max = '2024-11-20';
        element.step = '2';
        element.open = true;
        await pageObject.waitForPickerLoaded();
        pageObject.focusMonthSelect();
        await pageObject.clickNextMonth();
        await pageObject.clickPreviousMonth();
        const tabStopDay = pageObject.getGridTabStopDay()!;
        expect(pageObject.isDayDisabled(tabStopDay)).toBeFalse();
        expect(tabStopDay.startsWith('2024-11-')).toBeTrue();
        expect(pageObject.isMonthSelectFocused()).toBeTrue();
    });

    it('shows accessible constraint errors immediately after segment adjustment', async () => {
        element.max = element.value;
        await waitForUpdatesAsync();
        pageObject.setInputSelection(14, 16);
        await pageObject.pressInputKey('ArrowUp');
        expect(element.validity.rangeOverflow).toBeTrue();
        expect(pageObject.getEntryErrorText()).not.toBe('');
        expect(pageObject.getInputAriaInvalid()).toBe('true');
        expect(pageObject.getInputDescribedByIds()).toContain('entry-error');
    });

    it('supports Alt+Down and Escape, restoring field focus', async () => {
        pageObject.setInputSelection(element.value.length, element.value.length);
        await pageObject.pressInputKey('ArrowDown', { altKey: true });
        await pageObject.waitForPickerLoaded();
        expect(element.open).toBeTrue();
        expect(element.value).toBe('2024-11-13T14:25');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-13');
        await pageObject.pressInputKey('Escape');
        expect(element.open).toBeFalse();
        expect(pageObject.isInputFocused()).toBeTrue();
    });

    it('lets an open year select consume Escape before dismissing the picker', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        await pageObject.openYearSelect();
        await pageObject.pressEscapeInYearSelect();
        expect(pageObject.isYearSelectOpen()).toBeFalse();
        expect(element.open).toBeTrue();
    });

    it('closes on an outside pointer interaction', async () => {
        element.open = true;
        await waitForUpdatesAsync();
        await pageObject.pointerDownOutsidePicker();
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
                expect(pageObject.isCalendarButtonVisible()).toBeFalse();
            } else {
                expect(pageObject.isCalendarButtonDisabled()).toBeTrue();
            }
            // No calendar day is reachable while closed, so guard the internal selection entry point directly.
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
            await pageObject.typeInputText('11/');
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
        pageObject = new FvDateTimePickerPageObject(element);
        disconnect = view.disconnect;
        await view.connect();
        await waitForUpdatesAsync();
        expect(pageObject.isCalendarButtonVisible()).toBeFalse();
        expect(pageObject.isInputReadOnly()).toBeTrue();
        element.readOnly = false;
        await waitForUpdatesAsync();
        expect(pageObject.isCalendarButtonVisible()).toBeTrue();
        expect(pageObject.isCalendarButtonDisabled()).toBeFalse();
        await pageObject.clickCalendarButton();
        expect(element.open).toBeTrue();
        element.readOnly = true;
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(pageObject.isCalendarButtonVisible()).toBeFalse();
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
        expect(pageObject.getInputText()).toBe('11/13/2024');
        expect(pageObject.hasTimeField()).toBeFalse();
        expect(pageObject.getCalendarButtonLabel()).toBe('Choose date');
        await pageObject.clickDay('2024-11-21');
        expect(element.value).toBe('2024-11-21');
        expect(new FormData(form).get('scheduled')).toBe('2024-11-21');
        await pageObject.typeInputText('02/29/2024');
        expect(element.value).toBe('2024-02-29');
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-11-13');
        expect(pageObject.getInputText()).toBe('11/13/2024');
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
            const display = pageObject.getInputText();
            await pageObject.typeInputText(display);
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
            expect(pageObject.isDayDisabled(date)).withContext(date).toBeTrue();
            // eslint-disable-next-line no-await-in-loop
            await pageObject.clickDay(date);
            expect(element.value).toBe('2024-11-12');
        }
        await pageObject.clickDay('2024-11-14');
        expect(element.value).toBe('2024-11-14');
    });

    it('propagates invalid Time drafts to outer badInput and removes stale submitted values', async () => {
        const form = document.createElement('form');
        element.parentElement!.appendChild(form);
        form.appendChild(element);
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('09:');
        expect(element.value).toBe('');
        expect(element.validity.badInput).toBeTrue();
        expect(element.checkValidity()).toBeFalse();
        expect(new FormData(form).get('scheduled')).toBe('');
        expect(pageObject.isTimeValid()).toBeFalse();
        await pageObject.typeTimeText('09:07 AM');
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
        await pageObject.typeInputText('11/');
        expect(element.validity.badInput).toBeTrue();
        form.reset();
        await waitForUpdatesAsync();
        expect(element.value).toBe('');
        expect(pageObject.getInputText()).toBe('');
        expect(element.checkValidity()).toBeTrue();
    });

    it('preserves programmatic updates when dismissing a Time field with a pending native change', async () => {
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.typeTimeText('09:07 AM');
        expect(element.value).toBe('2024-11-13T09:07');
        element.value = '2025-01-01T10:00';
        expect(pageObject.getTimeText()).toBe('10:00 AM');
        // Native change runs synchronously during blur, before queued bindings settle.
        pageObject.simulateTimeChangeOnBlur();
        await pageObject.pressInputKey('Escape');
        expect(element.value).toBe('2025-01-01T10:00');
        expect(pageObject.getInputText()).toBe('01/01/2025 10:00 AM');
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
            pageObject.selectAllInputText();
            await pageObject.pasteIntoInput(text);
            expect(change).not.toHaveBeenCalled();
            if (enter) {
                await pageObject.pressInputKey('Enter');
            } else {
                await pageObject.blurInput();
            }
            expect(change).toHaveBeenCalledTimes(1);
            if (text.includes('02-30')) {
                expect(element.value).toBe('');
                expect(pageObject.getEntryErrorText()).not.toBe('');
            } else {
                expect(element.value).toBe(text);
            }
        });
    });

    parameterizeSpec([
        { name: 'main', popup: false },
        { name: 'Time', popup: true }
    ], (spec, name, { popup }) => {
        const entry = {
            type: async (text: string, commit = false): Promise<void> => (popup ? await pageObject.typeTimeText(text, { commit }) : await pageObject.typeInputText(text, { commit })),
            press: async (key: string): Promise<boolean> => (popup ? await pageObject.pressTimeKey(key) : await pageObject.pressInputKey(key)),
            leave: async (): Promise<void> => (popup ? await pageObject.leaveTimeInput() : await pageObject.leaveInput())
        };

        spec(`commits ordinary ${name} typing on Enter once, including a later native change`, async () => {
            element.value = '';
            element.open = popup;
            await pageObject.waitForPickerLoaded();
            const change = jasmine.createSpy('change');
            element.addEventListener('change', change);
            await entry.type(popup ? '02:25' : '11/13/2024 02:25');
            await entry.press('Enter');
            expect(element.value).toBe(`${popup ? todayKey() : '2024-11-13'}T02:25`);
            expect(element.checkValidity()).toBeTrue();
            expect(change).toHaveBeenCalledTimes(1);
            await entry.leave();
            expect(change).toHaveBeenCalledTimes(1);
        });

        spec(`keeps successive ${name} edits independent across native and Enter commits`, async () => {
            element.open = popup;
            await pageObject.waitForPickerLoaded();
            const change = jasmine.createSpy('change');
            element.addEventListener('change', change);
            await entry.type(popup ? '09:07 AM' : '11/13/2024 09:07 AM', true);
            expect(element.value).toBe('2024-11-13T09:07');
            expect(element.checkValidity()).toBeTrue();
            expect(change).toHaveBeenCalledTimes(1);
            await entry.leave();
            expect(change).toHaveBeenCalledTimes(1);

            await entry.type(popup ? '10:08 AM' : '11/13/2024 10:08 AM');
            await entry.press('Enter');
            expect(element.value).toBe('2024-11-13T10:08');
            expect(element.checkValidity()).toBeTrue();
            expect(change).toHaveBeenCalledTimes(2);
            await entry.leave();
            expect(change).toHaveBeenCalledTimes(2);
        });
    });

    it('does not let a pending native change overwrite a programmatic update', async () => {
        await pageObject.typeInputText('11/');
        element.step = '0.001';
        element.value = '2024-11-13T14:25:37.123';
        await pageObject.leaveInput();
        expect(element.checkValidity()).toBeTrue();
    });

    it('preserves seconds precision while editing a value that needs it', async () => {
        element.value = '2024-11-13T14:25:37';
        await waitForUpdatesAsync();
        await pageObject.typeInputText('11/13/2024 02:25:3');
        expect(element.value).toBe('');
        expect(pageObject.getInputText()).toBe('11/13/2024 02:25:3');
        await pageObject.typeInputText('11/13/2024 02:25:38 PM');
        expect(element.value).toBe('2024-11-13T14:25:38');
        expect(element.validity.badInput).toBeFalse();
    });

    it('treats daylight-saving gaps as valid wall times and preserves ancient years', async () => {
        element.value = '2024-03-10T02:30';
        await waitForUpdatesAsync();
        expect(element.value).toBe('2024-03-10T02:30');
        expect(element.checkValidity()).toBeTrue();
        await pageObject.typeInputText(pageObject.getInputText());
        expect(element.value).toBe('2024-03-10T02:30');
    });

    it('reacts to Nimble language changes for date order, time, months, and week headings', async () => {
        lang.setValueFor(element, 'de-DE');
        element.open = true;
        await waitForUpdatesAsync();
        expect(pageObject.getInputText()).toBe('13.11.2024 14:25');
        expect(pageObject.getTimeText()).toBe('14:25');
        expect(pageObject.getMonthNames()[2]).toBe('März');
        expect(['Montag', 'Sonntag']).toContain(pageObject.getWeekdayNames()[0]!);
        await pageObject.typeInputText('29.02.2024 23:59');
        expect(element.value).toBe('2024-02-29T23:59');
        lang.setValueFor(element, 'en-US');
        await waitForUpdatesAsync();
        expect(pageObject.getInputText()).toBe('02/29/2024 11:59 PM');
    });

    it('uses locale week starts for Home/End and mirrors horizontal arrows in RTL', async () => {
        lang.setValueFor(element, 'de-DE');
        element.open = true;
        await pageObject.waitForPickerLoaded();
        await pageObject.pressKeyOnDay('2024-11-13', 'Home');
        expect(pageObject.getGridTabStopDay()).toBe(pageObject.getWeekdayNames()[0] === 'Montag' ? '2024-11-11' : '2024-11-10');
        direction.setValueFor(element, Direction.rtl);
        await pageObject.pressKeyOnDay('2024-11-13', 'ArrowLeft');
        expect(pageObject.getGridTabStopDay()).toBe('2024-11-14');
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
        expect(pageObject.getInputPlaceholder()).toBe('Choose a scheduled date');
        expect(pageObject.getInputAutocomplete()).toBe('bday');
        expect(pageObject.getInputAriaLabel()).toBe('Appointment');
        expect(pageObject.getInputAriaDetails()).toBe('details');
        expect(pageObject.getInputAriaErrormessage()).toBe('error');
        expect(pageObject.getInputAriaControls()).toBe('related');
        expect(pageObject.getInputAriaKeyshortcuts()).toBe('Alt+ArrowDown');
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
        expect(pageObject.getCalendarButtonLabel()).toBe('Datum und Uhrzeit auswählen');
        expect(pageObject.getTimeLabelText()).toContain('Uhrzeit');
        await pageObject.typeInputText('11/');
        expect(element.validationMessage).toBe('Datum und Uhrzeit eingeben.');
    });
});
