import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { anchoredRegionTag, type AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { listOptionTag, type ListOption } from '@ni/nimble-components/dist/esm/list-option';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import type { FvDateTimePicker } from '..';

export interface KeyModifiers {
    altKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
}

export interface EditOptions {
    /** Also raise the native `change` event a browser fires when the edit is committed. */
    commit?: boolean;
}

interface LabelledDisableableElement extends HTMLElement {
    disabled: boolean;
    ariaLabel: string | null;
}

function normalizeWhitespace(text: string): string {
    return text.replace(/\s/g, ' ');
}

/**
 * Page object for the `ok-fv-date-time-picker` component to provide consistent
 * ways of querying and interacting with the component during tests.
 *
 * Methods that dispatch a cancelable event return `true` when the event was
 * left for the browser to handle and `false` when the component handled it.
 */
export class FvDateTimePickerPageObject {
    public constructor(
        protected readonly dateTimePickerElement: FvDateTimePicker
    ) {}

    // Text input

    public getInputText(): string {
        return normalizeWhitespace(this.getInput().value);
    }

    public getInputSelectionStart(): number | null {
        return this.getInput().selectionStart;
    }

    public getInputSelectionEnd(): number | null {
        return this.getInput().selectionEnd;
    }

    public getInputPlaceholder(): string {
        return this.getInput().placeholder;
    }

    public getInputAutocomplete(): string | null {
        return this.getInput().getAttribute('autocomplete');
    }

    public getInputAriaLabel(): string | null {
        return this.getInput().getAttribute('aria-label');
    }

    public getInputAriaDetails(): string | null {
        return this.getInput().getAttribute('aria-details');
    }

    public getInputAriaErrormessage(): string | null {
        return this.getInput().getAttribute('aria-errormessage');
    }

    public getInputAriaControls(): string | null {
        return this.getInput().getAttribute('aria-controls');
    }

    public getInputAriaKeyshortcuts(): string | null {
        return this.getInput().getAttribute('aria-keyshortcuts');
    }

    public getInputAriaInvalid(): string | null {
        return this.getInput().getAttribute('aria-invalid');
    }

    public getInputDescribedByIds(): string[] {
        return (this.getInput().ariaDescribedByElements ?? []).map(
            element => element.id
        );
    }

    public isInputDescribedByPickerEntryError(): boolean {
        const pickerError = this.getPicker()?.querySelector('#entry-error');
        return (
            !!pickerError
            && (this.getInput().ariaDescribedByElements ?? []).includes(
                pickerError
            )
        );
    }

    public isInputLabelled(): boolean {
        return (this.getInput().labels?.length ?? 0) > 0;
    }

    public isInputReadOnly(): boolean {
        return this.getInput().readOnly;
    }

    public isInputFocused(): boolean {
        return (
            this.dateTimePickerElement.shadowRoot?.activeElement
            === this.getInput()
        );
    }

    public focusInput(): void {
        this.getInput().focus();
    }

    public setInputSelection(start: number, end: number): void {
        this.getInput().setSelectionRange(start, end);
    }

    public selectAllInputText(): void {
        this.getInput().select();
    }

    /** Clicks the input while preserving the current selection, as when a drag selection ends. */
    public async clickInput(): Promise<void> {
        this.getInput().click();
        await waitForUpdatesAsync();
    }

    public async clickInputAtPosition(position: number): Promise<void> {
        const input = this.getInput();
        input.setSelectionRange(position, position);
        input.click();
        await waitForUpdatesAsync();
    }

    public async typeInputText(
        text: string,
        options: EditOptions = {}
    ): Promise<void> {
        const input = this.getInput();
        this.typeText(input, text);
        if (options.commit) {
            this.fireChange(input);
        }
        await waitForUpdatesAsync();
    }

    /** Types characters one at a time at the current selection, as a keyboard would. */
    public async typeInputCharacters(characters: string): Promise<void> {
        const input = this.getInput();
        for (const character of characters) {
            this.dispatchBeforeInput(input, 'insertText', character);
            input.dispatchEvent(
                new InputEvent('input', {
                    inputType: 'insertText',
                    data: character,
                    bubbles: true,
                    composed: true
                })
            );
        }
        await waitForUpdatesAsync();
    }

    /** Types digits one at a time, including the key events a keyboard would raise. */
    public async typeInputDigits(digits: string): Promise<boolean> {
        const input = this.getInput();
        let allowed = false;
        for (const digit of digits) {
            this.dispatchKey(input, 'keydown', digit);
            allowed = this.dispatchBeforeInput(input, 'insertText', digit) || allowed;
        }
        await waitForUpdatesAsync();
        return allowed;
    }

    public async insertInputText(
        data: string,
        options: EditOptions = {}
    ): Promise<boolean> {
        const input = this.getInput();
        const allowed = this.dispatchBeforeInput(input, 'insertText', data);
        if (options.commit) {
            this.fireChange(input);
        }
        await waitForUpdatesAsync();
        return allowed;
    }

    /** Deletes using an input type such as `deleteContentBackward` or `deleteByCut`. */
    public async deleteInput(inputType: string): Promise<boolean> {
        const allowed = this.dispatchBeforeInput(
            this.getInput(),
            inputType,
            null
        );
        await waitForUpdatesAsync();
        return allowed;
    }

    public async pressInputKey(
        key: string,
        modifiers: KeyModifiers = {}
    ): Promise<boolean> {
        const allowed = this.pressKey(this.getInput(), key, modifiers);
        await waitForUpdatesAsync();
        return allowed;
    }

    /** Presses several keys without letting updates settle between them. */
    public async pressInputKeysInSameTick(keys: string[]): Promise<void> {
        for (const key of keys) {
            this.pressKey(this.getInput(), key, {});
        }
        await waitForUpdatesAsync();
    }

    public async pasteIntoInput(
        text: string,
        options: EditOptions = {}
    ): Promise<boolean> {
        const input = this.getInput();
        const allowed = this.paste(input, text);
        if (options.commit) {
            this.fireChange(input);
        }
        await waitForUpdatesAsync();
        return allowed;
    }

    public async blurInput(): Promise<void> {
        this.getInput().dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
    }

    /** Moves focus out of the input as a browser does after an edit: native `change`, then `blur`. */
    public async leaveInput(): Promise<void> {
        const input = this.getInput();
        this.fireChange(input);
        input.dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
    }

    // Calendar button

    public isCalendarButtonVisible(): boolean {
        return this.getCalendarButton() !== null;
    }

    public isCalendarButtonDisabled(): boolean {
        return this.requireCalendarButton().disabled;
    }

    public isCalendarButtonFocused(): boolean {
        return (
            this.dateTimePickerElement.shadowRoot?.activeElement
            === this.requireCalendarButton()
        );
    }

    public getCalendarButtonLabel(): string | null {
        return this.requireCalendarButton().ariaLabel;
    }

    public async clickCalendarButton(): Promise<void> {
        this.requireCalendarButton().click();
        await waitForUpdatesAsync();
    }

    public async mouseDownCalendarButton(button = 0): Promise<boolean> {
        const allowed = this.requireCalendarButton().dispatchEvent(
            new MouseEvent('mousedown', {
                button,
                bubbles: true,
                cancelable: true
            })
        );
        await waitForUpdatesAsync();
        return allowed;
    }

    public async pressEnterOnCalendarButton(): Promise<void> {
        this.requireCalendarButton().dispatchEvent(
            new KeyboardEvent('keypress', {
                key: 'Enter',
                bubbles: true,
                composed: true,
                cancelable: true
            })
        );
        await waitForUpdatesAsync();
    }

    // Picker

    public async waitForPickerLoaded(): Promise<void> {
        await waitForUpdatesAsync();
        const region = this.getRegion();
        if (region && !region.classList.contains('loaded')) {
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => resolve(), {
                    once: true
                });
            });
        }
        await waitForUpdatesAsync();
    }

    public isPickerFixedPlacement(): boolean {
        return this.requireRegion().fixedPlacement;
    }

    public isPickerViewportLocked(): boolean {
        const region = this.requireRegion();
        return region.horizontalViewportLock || region.verticalViewportLock;
    }

    public getPickerVerticalPositioningMode(): string {
        return this.requireRegion().verticalPositioningMode;
    }

    public getPickerButtonCount(): number {
        return this.requirePicker().querySelectorAll(buttonTag).length;
    }

    public async pointerDownOutsidePicker(): Promise<void> {
        document.body.dispatchEvent(
            new Event('pointerdown', { bubbles: true, composed: true })
        );
        await waitForUpdatesAsync();
    }

    public getEntryErrorText(): string {
        return (
            this.dateTimePickerElement.shadowRoot
                ?.querySelector('#entry-error')
                ?.textContent?.trim() ?? ''
        );
    }

    // Calendar header

    public getDisplayedMonth(): number {
        return Number(this.getMonthSelect().value);
    }

    public getDisplayedYear(): number {
        return Number(this.getYearSelect().value);
    }

    public getMonthNames(): string[] {
        return Array.from(
            this.getMonthSelect().querySelectorAll<ListOption>(listOptionTag)
        ).map(option => option.textContent?.trim() ?? '');
    }

    public getYearOptions(): number[] {
        return Array.from(
            this.getYearSelect().querySelectorAll<ListOption>(listOptionTag)
        ).map(option => Number(option.value));
    }

    public getWeekdayNames(): string[] {
        return Array.from(this.requirePicker().querySelectorAll('th')).map(
            header => header.getAttribute('abbr') ?? ''
        );
    }

    public async selectMonth(month: number): Promise<void> {
        const select = this.getMonthSelect();
        select.value = String(month);
        this.dispatchSelectEvents(select);
        await waitForUpdatesAsync();
    }

    public async selectYear(year: number): Promise<void> {
        const select = this.getYearSelect();
        select.value = String(year);
        this.dispatchSelectEvents(select);
        await waitForUpdatesAsync();
    }

    public focusMonthSelect(): void {
        this.getMonthSelect().focus();
    }

    public isMonthSelectFocused(): boolean {
        return (
            this.dateTimePickerElement.shadowRoot?.activeElement
            === this.getMonthSelect()
        );
    }

    public async openYearSelect(): Promise<void> {
        this.getYearSelect().open = true;
        await waitForUpdatesAsync();
    }

    public isYearSelectOpen(): boolean {
        return this.getYearSelect().open;
    }

    public async pressEscapeInYearSelect(): Promise<void> {
        this.pressKey(this.getYearSelect(), 'Escape', {}, false);
        await waitForUpdatesAsync();
    }

    public async clickPreviousMonth(): Promise<void> {
        this.getMonthButtons()[0]!.click();
        await waitForUpdatesAsync();
    }

    public async clickNextMonth(): Promise<void> {
        this.getMonthButtons()[1]!.click();
        await waitForUpdatesAsync();
    }

    public async mouseDownNextMonthButton(): Promise<boolean> {
        const nativeButton = this.getMonthButtons()[1]!.shadowRoot!.querySelector('button')!;
        const allowed = nativeButton.dispatchEvent(
            new MouseEvent('mousedown', {
                button: 0,
                bubbles: true,
                composed: true,
                cancelable: true
            })
        );
        await waitForUpdatesAsync();
        return allowed;
    }

    // Calendar grid

    public getGridCellCount(): number {
        return this.requirePicker().querySelectorAll('[role="gridcell"]').length;
    }

    public getSelectedDay(): string | null {
        return this.getDayAttribute('[aria-selected="true"] button');
    }

    public getTodayDay(): string | null {
        return this.getDayAttribute('[aria-current="date"]');
    }

    public isTodaySelected(): boolean {
        return (
            this.requirePicker()
                .querySelector('[aria-current="date"]')
                ?.closest('[role="gridcell"]')
                ?.getAttribute('aria-selected') === 'true'
        );
    }

    public getGridTabStopDay(): string | null {
        return this.getDayAttribute('.day[tabindex="0"]');
    }

    public getActiveDay(): string | null {
        return (
            this.dateTimePickerElement.shadowRoot?.activeElement?.getAttribute(
                'data-date'
            ) ?? null
        );
    }

    public isDayDisabled(day: string): boolean {
        return this.getDay(day).getAttribute('aria-disabled') === 'true';
    }

    public isDayOutsideMonth(day: string): boolean {
        return this.getDay(day).hasAttribute('data-outside-month');
    }

    public focusDay(day: string): void {
        this.getDay(day).focus();
    }

    public async clickDay(day: string): Promise<void> {
        this.getDay(day).click();
        await waitForUpdatesAsync();
    }

    public async pressKeyOnDay(day: string, key: string): Promise<boolean> {
        const allowed = this.pressKey(this.getDay(day), key, {}, false);
        await waitForUpdatesAsync();
        return allowed;
    }

    // Time field

    public hasTimeRow(): boolean {
        return this.requirePicker().querySelector('.time-row') !== null;
    }

    public hasTimeField(): boolean {
        return this.getTimeField() !== null;
    }

    public getTimeLabelText(): string {
        return this.requireTimeField().textContent ?? '';
    }

    public getTimeText(): string {
        return normalizeWhitespace(this.getTimeInput().value);
    }

    public getTimeSelectionStart(): number | null {
        return this.getTimeInput().selectionStart;
    }

    public getTimeSelectionEnd(): number | null {
        return this.getTimeInput().selectionEnd;
    }

    public getTimeAriaInvalid(): string | null {
        return this.requireTimeField().getAttribute('aria-invalid');
    }

    public isTimeValid(): boolean {
        return this.requireTimeField().checkValidity();
    }

    public getTimeDescribedByIds(): string[] {
        return (this.getTimeInput().ariaDescribedByElements ?? []).map(
            element => element.id
        );
    }

    public focusTimeInput(): void {
        this.getTimeInput().focus();
    }

    public setTimeSelection(start: number, end: number): void {
        this.getTimeInput().setSelectionRange(start, end);
    }

    public selectAllTimeText(): void {
        this.getTimeInput().select();
    }

    public async clickTimeAtPosition(position: number): Promise<void> {
        const input = this.getTimeInput();
        input.setSelectionRange(position, position);
        input.click();
        await waitForUpdatesAsync();
    }

    public async typeTimeText(
        text: string,
        options: EditOptions = {}
    ): Promise<void> {
        const input = this.getTimeInput();
        this.typeText(input, text);
        if (options.commit) {
            this.fireChange(input);
        }
        await waitForUpdatesAsync();
    }

    public async insertTimeText(
        data: string,
        options: EditOptions = {}
    ): Promise<boolean> {
        const input = this.getTimeInput();
        const allowed = this.dispatchBeforeInput(input, 'insertText', data);
        if (options.commit) {
            this.fireChange(input);
        }
        await waitForUpdatesAsync();
        return allowed;
    }

    public async deleteTime(inputType: string): Promise<boolean> {
        const allowed = this.dispatchBeforeInput(
            this.getTimeInput(),
            inputType,
            null
        );
        await waitForUpdatesAsync();
        return allowed;
    }

    public async pressTimeKey(
        key: string,
        modifiers: KeyModifiers = {}
    ): Promise<boolean> {
        const allowed = this.pressKey(this.getTimeInput(), key, modifiers);
        await waitForUpdatesAsync();
        return allowed;
    }

    /** Moves focus out of the time field as a browser does after an edit: native `change`, then `blur`. */
    public async leaveTimeInput(): Promise<void> {
        const input = this.getTimeInput();
        this.fireChange(input);
        input.dispatchEvent(new FocusEvent('blur'));
        await waitForUpdatesAsync();
    }

    /**
     * Makes the time field raise its native `change` event when it is blurred,
     * as browsers do for user-edited fields, before the field is dismissed.
     */
    public simulateTimeChangeOnBlur(): void {
        const input = this.getTimeInput();
        input.blur = () => {
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };
    }

    private getInput(): HTMLInputElement {
        const input = this.dateTimePickerElement.shadowRoot?.querySelector<HTMLInputElement>('input.control');
        if (!input) {
            throw new Error('Date/time input element not found');
        }
        return input;
    }

    private getCalendarButton(): LabelledDisableableElement | null {
        return (
            this.dateTimePickerElement.shadowRoot?.querySelector<LabelledDisableableElement>(
                '.calendar-trigger'
            ) ?? null
        );
    }

    private requireCalendarButton(): LabelledDisableableElement {
        const button = this.getCalendarButton();
        if (!button) {
            throw new Error(
                'Calendar button not found — is the date/time picker read-only?'
            );
        }
        return button;
    }

    private getPicker(): HTMLElement | null {
        return (
            this.dateTimePickerElement.shadowRoot?.querySelector<HTMLElement>(
                '.picker'
            ) ?? null
        );
    }

    private requirePicker(): HTMLElement {
        const picker = this.getPicker();
        if (!picker) {
            throw new Error('Picker not found — is the picker open?');
        }
        return picker;
    }

    private getRegion(): AnchoredRegion | null {
        return (
            this.dateTimePickerElement.shadowRoot?.querySelector<AnchoredRegion>(
                anchoredRegionTag
            ) ?? null
        );
    }

    private requireRegion(): AnchoredRegion {
        const region = this.getRegion();
        if (!region) {
            throw new Error('Picker region not found — is the picker open?');
        }
        return region;
    }

    private getMonthSelect(): Select {
        return this.requirePicker().querySelector<Select>('.month')!;
    }

    private getYearSelect(): Select {
        return this.requirePicker().querySelector<Select>('.year')!;
    }

    private getMonthButtons(): HTMLElement[] {
        return Array.from(
            this.requirePicker().querySelectorAll<HTMLElement>(
                `.calendar-header ${buttonTag}`
            )
        );
    }

    private getDay(day: string): HTMLButtonElement {
        const button = this.requirePicker().querySelector<HTMLButtonElement>(
            `[data-date="${day}"]`
        );
        if (!button) {
            throw new Error(`Day ${day} is not displayed`);
        }
        return button;
    }

    private getDayAttribute(selector: string): string | null {
        return (
            this.requirePicker()
                .querySelector(selector)
                ?.getAttribute('data-date') ?? null
        );
    }

    private getTimeField(): TextField | null {
        return (
            this.dateTimePickerElement.shadowRoot?.querySelector<TextField>(
                '#time'
            ) ?? null
        );
    }

    private requireTimeField(): TextField {
        const field = this.getTimeField();
        if (!field) {
            throw new Error(
                'Time field not found — is a date-time picker open?'
            );
        }
        return field;
    }

    private getTimeInput(): HTMLInputElement {
        return this.requireTimeField().control;
    }

    private fireChange(input: HTMLInputElement): void {
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    private typeText(input: HTMLInputElement, text: string): void {
        input.value = text;
        input.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        );
    }

    private dispatchKey(
        target: EventTarget,
        type: 'keydown' | 'keyup',
        key: string,
        modifiers: KeyModifiers = {}
    ): boolean {
        return target.dispatchEvent(
            new KeyboardEvent(type, {
                key,
                ...modifiers,
                bubbles: true,
                composed: true,
                cancelable: true
            })
        );
    }

    private pressKey(
        target: EventTarget,
        key: string,
        modifiers: KeyModifiers,
        includeKeyup = true
    ): boolean {
        const allowed = this.dispatchKey(target, 'keydown', key, modifiers);
        if (includeKeyup) {
            this.dispatchKey(target, 'keyup', key, modifiers);
        }
        return allowed;
    }

    private dispatchBeforeInput(
        target: EventTarget,
        inputType: string,
        data: string | null
    ): boolean {
        return target.dispatchEvent(
            new InputEvent('beforeinput', {
                inputType,
                data,
                bubbles: true,
                composed: true,
                cancelable: true
            })
        );
    }

    private paste(input: HTMLInputElement, text: string): boolean {
        const event = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        Object.defineProperty(event, 'clipboardData', {
            value: { getData: () => text }
        });
        return input.dispatchEvent(event);
    }

    private dispatchSelectEvents(select: Select): void {
        select.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        );
        select.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
        );
    }
}
