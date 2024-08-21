/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {
    attr,
    DOM,
    observable,
    type ValueConverter,
    volatile,
} from '@microsoft/fast-element';
import type { TextField } from '@ni/nimble-components/src/text-field';
import type { Button } from '@ni/nimble-components/src/button';
import { FormElementHelperText } from '../patterns/form-elements';
import { Localized } from '../patterns/localized';
import { TrappedFocus } from '../patterns/trapped-focus';
import { applyMixinsWithObservables } from '../utilities/applyMixinsWithObservables';
import {
    addDays,
    compareDateStr,
    currentDateStr,
    type DateStr,
    isValidDateStr,
} from './calendar/dateStr';
import {
    addMonths,
    compareMonths,
    getCurrentMonth,
    type Month,
    monthOfDate,
    monthToStr,
} from './calendar/month';
import { buildCalendarGrid } from './calendar/calendarGrid';
import { buildMonthPickerGrid, MonthsPerRow } from './calendar/monthPickerGrid';
import { yearOfDate } from './calendar/year';
import { FormAssociatedDatePickerBase } from './date-picker-base.form-associated';
import type {
    CalendarSegment,
    MonthPickerSegment,
    Segment,
} from './calendar/segment';

/// Converter ensures that the value is always a valid date string or empty string
// eslint-disable-next-line @typescript-eslint/naming-convention
const ValidDateFilter: ValueConverter = {
    fromView: (value: string) => {
        if (value && isValidDateStr(value)) {
            return value;
        }
        return '';
    },
    toView(value: string) {
        return value;
    },
};

/**
 * Base class for date-picker
 *
 * @event {CustomEvent<undefined>} clear-click - Event emitted when the clear button is clicked.
 *
 * @public
 */
export abstract class DatePickerBase extends FormAssociatedDatePickerBase {
    // --- Attributes ---
    public abstract label: string;

    /**
     * The earliest accepted date of the date-picker.
     *
     * @public
     * @remarks
     * HTML Attribute: min
     */
    @attr({ converter: ValidDateFilter })
    public min: string;

    /**
     * @internal
     */
    public minChanged(_: string, newMin: string): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.min = newMin;
            this.validate();
        }
    }

    /**
     * The latest accepted date of the date-picker.
     *
     * @public
     * @remarks
     * HTML Attribute: max
     */
    @attr({ converter: ValidDateFilter })
    public max: string;

    /**
     * @internal
     */
    public maxChanged(_: string, newMax: string): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.max = newMax;
            this.validate();
        }
    }

    /**
     * The initial value of the date-picker.
     *
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: 'value' })
    public override initialValue!: string;

    /**
     * The current value of the date-picker.
     *
     * @public
     * @remarks
     * HTML Attribute: current-value
     */
    @attr({ attribute: 'current-value' })
    public override currentValue!: string;

    /**
     * Whether the date-picker is readonly.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: 'readonly', mode: 'boolean' })
    public readOnly = false;

    /**
     * @internal
     */
    protected readOnlyChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
            this.validate();
        }
    }

    // --- Refs ---
    /**
     * @internal
     */
    public _textFieldEl!: TextField;
    /**
     * @internal
     */
    public _dialogEl!: HTMLElement;
    /**
     * @internal
     */
    public _calendarButtonEl!: Button;

    // --- Common state and getters ---

    /**
     * The month the calendar is currently showing.
     * @internal
     */
    @observable public _selectedMonth = getCurrentMonth();

    protected _adjustSelectedMonthToEnsureVisibilityOf(date: DateStr): boolean {
        const month = monthOfDate(date);
        const firstDisplayedMonth = this._selectedMonth;
        const lastDisplayedMonth = addMonths(
            this._selectedMonth,
            this._numCalendars - 1
        );
        if (compareMonths(month, firstDisplayedMonth) < 0) {
            this._selectedMonth = month;
            return true;
        }
        if (compareMonths(month, lastDisplayedMonth) > 0) {
            this._selectedMonth = addMonths(month, 1 - this._numCalendars);
            return true;
        }
        return false;
    }

    /**
     * Today's date.
     * @internal
     */
    public _currentDate = currentDateStr();

    /**
     * Today's month.
     * @internal
     */
    public _currentMonth = getCurrentMonth();

    /**
     * @internal
     */
    public _isDateInValidRange(date: DateStr): boolean {
        return (
            (!this.min || compareDateStr(date, this.min) >= 0)
            && (!this.max || compareDateStr(date, this.max) <= 0)
        );
    }

    #isMonthAfterValidRange(month: Month): boolean {
        return Boolean(this.max && compareMonths(month, monthOfDate(this.max)) > 0);
    }

    #isMonthBeforeValidRange(month: Month): boolean {
        return Boolean(this.min && compareMonths(month, monthOfDate(this.min)) < 0);
    }

    /**
     * @internal
     */
    public _isMonthInValidRange(month: Month): boolean {
        return !(
            this.#isMonthBeforeValidRange(month)
            || this.#isMonthAfterValidRange(month)
        );
    }

    // --- Core ---

    public constructor() {
        super();
        this.value = '';
        this.min = '';
        this.max = '';
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        document.addEventListener('click', this.#dismissOnClickOutside);
        this.addEventListener('focusin', this.#onFocusIn);
        this.addEventListener('focusout', this.#onFocusOut);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        document.removeEventListener('click', this.#dismissOnClickOutside);
        this.removeEventListener('focusin', this.#onFocusIn);
        this.removeEventListener('focusout', this.#onFocusOut);
    }

    #onFocusIn = (): void => {
        this.$emit('focus', undefined, { bubbles: false });
    };

    #onFocusOut = (): void => {
        this.$emit('blur', undefined, { bubbles: false });
    };

    /**
     * @internal
     */
    public abstract errorValidationMessage: string;

    /**
     * @internal
     */
    public override validate(): void {
        // When error-text is present, validate() is skipped and the error-text is used instead

        // Otherwise, super.validate() will use validity of the proxy
        // We can use .setCustomValidity to force any custom error on it here
        if (this.proxy) {
            this.proxy.setCustomValidity(this._getCustomValidationError() ?? '');
        }

        super.validate(this._textFieldEl?.querySelector('input') ?? undefined);
    }

    protected abstract _getCustomValidationError(): string | null;

    // --- Popup ---

    /**
     * Whether the date-picker popup is open.
     * @internal
     */
    @observable public _popupOpen = false;

    #dismissOnClickOutside = (event: MouseEvent): void => {
        if (!this._popupOpen) {
            return;
        }

        const path = event.composedPath();
        const elementsToIgnoreClicksOn = [this._dialogEl, this._calendarButtonEl];
        if (!elementsToIgnoreClicksOn.some(element => path.includes(element as EventTarget))) {
            this._closePopup(false);
        }
    };

    #openPopupIfPossible(): void {
        if (!this.readOnly) {
            this._popupOpen = true;
        }
    }

    /**
     * @internal
     */
    protected _closePopup(restoreFocusToTextField = true): void {
        this._popupOpen = false;
        this._monthPickerYear = null;

        if (restoreFocusToTextField) {
            this._textFieldEl.focus();
        }
    }

    /**
     * On keydown anywhere in the date picker.
     * @internal
     */
    public _onBaseKeyDown(event: KeyboardEvent): boolean {
        // Close dialog on Escape
        if (event.key === 'Escape') {
            this._closePopup();
            return false;
        }

        if (
            this._trappedFocus(
                event,
                () => this.shadowRoot!.querySelectorAll(`
                .dialog .button:not(:disabled),
                .dialog .vwc-button:not(:disabled)
            `)
            )
        ) {
            return false;
        }

        // Otherwise, don't prevent default
        return true;
    }

    // --- Text field ---

    /**
     * Stores the value of the text field.
     * @internal
     */
    @observable public _presentationValue = '';
    /**
     * @internal
     */
    _presentationValueChanged() {
        this.dirtyValue = true;
        this.validate();
    }

    /**
     * @internal
     */
    abstract get _textFieldPlaceholder(): string;

    /**
     * @internal
     */
    abstract _textFieldSize: string;

    /**
     * @internal
     */
    _onTextFieldInput(event: Event) {
        const textField = event.currentTarget as TextField;
        this._presentationValue = textField.value;
    }

    /**
     * @internal
     */
    abstract _onTextFieldChange(): void;

    // --- Calendar button ---

    /**
     * @internal
     */
    abstract get _calendarButtonLabel(): string;

    /**
     * @internal
     */
    _onCalendarButtonClick() {
        if (this._popupOpen) {
            this._closePopup();
        } else {
            this.#openPopupIfPossible();

            DOM.processUpdates();

            const tabbableDate = this.shadowRoot!.querySelector<HTMLElement>(
                `[data-date="${this._tabbableDate!}"]`
            )!;
            tabbableDate.focus();
        }
    }

    // --- Dialog header ---

    /**
     * @internal
     */
    _onTitleActionClick() {
        if (this._inMonthPicker) {
            this._monthPickerYear = null;
        } else {
            this._monthPickerYear = this._selectedMonth.year;
        }
    }

    /**
     * @internal
     */
    @volatile
    get _isPrevYearDisabled() {
        const currentYear = this._inMonthPicker
            ? this._monthPickerYear!
            : this._selectedMonth.year;
        const prevYear = currentYear - 1;

        return this.min && prevYear < yearOfDate(this.min);
    }

    /**
     * @internal
     */
    _onPrevYearClick() {
        if (this._inMonthPicker) {
            this._monthPickerYear = this._monthPickerYear! - 1;
        } else {
            this._selectedMonth = {
                year: this._selectedMonth.year - 1,
                month: this._selectedMonth.month,
            };
        }
    }

    /**
     * @internal
     */
    @volatile
    get _isNextYearDisabled() {
        const currentYear = this._inMonthPicker
            ? this._monthPickerYear!
            : this._selectedMonth.year;
        const nextYear = currentYear + 1;

        return this.max && nextYear > yearOfDate(this.max);
    }

    /**
     * @internal
     */
    _onNextYearClick() {
        if (this._inMonthPicker) {
            this._monthPickerYear = this._monthPickerYear! + 1;
        } else {
            this._selectedMonth = {
                year: this._selectedMonth.year + 1,
                month: this._selectedMonth.month,
            };
        }
    }

    /**
     * @internal
     */
    get _isPrevMonthDisabled() {
        return this.#isMonthBeforeValidRange(addMonths(this._selectedMonth, -1));
    }

    /**
     * @internal
     */
    _onPrevMonthClick() {
        this._selectedMonth = addMonths(this._selectedMonth, -1);
    }

    /**
     * @internal
     */
    get _isNextMonthDisabled() {
        return this.#isMonthAfterValidRange(addMonths(this._selectedMonth, 1));
    }

    /**
     * @internal
     */
    _onNextMonthClick() {
        this._selectedMonth = addMonths(this._selectedMonth, 1);
    }

    // --- Calendar ---

    /**
     * The number of calendars to show in the picker.
     * @internal
     */
    @observable _numCalendars = 1;

    /**
     * @internal
     */
    get _segments(): Segment[] {
        const segments: Segment[] = [];

        if (this._inMonthPicker) {
            segments.push({
                id: 0,
                type: 'month-picker',
                title: `${this._monthPickerYear!}`,
                titleClickable: true,
                prevYearButton: true,
                nextYearButton: true,
                months: buildMonthPickerGrid(
                    this._monthPickerYear!,
                    this.locale.datePicker
                ),
            });
        } else {
            for (let i = 0; i < this._numCalendars; i++) {
                const month = addMonths(this._selectedMonth, i);
                const isSingle = this._numCalendars === 1;
                const isFirst = i === 0;
                const isLast = i === this._numCalendars - 1;
                segments.push({
                    id: i,
                    type: 'calendar',
                    title: `${this.locale.datePicker.months.name[month.month]!} ${
                        month.year
                    }`,
                    titleClickable: isSingle,
                    prevYearButton: isFirst && isSingle,
                    prevMonthButton: isFirst,
                    nextMonthButton: isLast,
                    nextYearButton: isLast && isSingle,
                    calendar: buildCalendarGrid(month, this.locale.datePicker),
                });
            }
        }

        return segments;
    }

    /**
     * @internal
     */
    _hideDatesOutsideMonth = false;

    /**
     * The last date that had focus, used to implement tab roving
     * @internal
     */
    @observable
    private _lastFocussedDate: DateStr | null = null;

    /**
     * @internal
     */
    _isDateSelected(_: DateStr) {
        return false;
    }

    /**
     * @internal
     */
    abstract _isDateAriaSelected(date: DateStr): void;

    /**
     * @internal
     */
    _isDateInSelectedRange(_: DateStr) {
        return false;
    }

    /**
     * @internal
     */
    _isDateRangeStart(_: DateStr) {
        return false;
    }

    /**
     * @internal
     */
    _isDateRangeEnd(_: DateStr) {
        return false;
    }

    protected abstract _getSelectedDates(): DateStr[];

    /**
     * @internal
     */
    _onDateMouseEnter(_: DateStr) {}

    /**
     * @internal
     */
    _onDateMouseLeave(_: DateStr) {}

    /**
     * @internal
     */
    abstract _onDateClick(date: DateStr): void;

    /**
     * Handle keydown on a date in the calendar.
     * @internal
     */
    _onDateKeydown(date: DateStr, event: KeyboardEvent) {
        let newDate: DateStr | null = null;

        if (event.key === 'ArrowUp') {
            newDate = addDays(date, -7);
        } else if (event.key === 'ArrowDown') {
            newDate = addDays(date, 7);
        } else if (event.key === 'ArrowLeft') {
            newDate = addDays(date, -1);
        } else if (event.key === 'ArrowRight') {
            newDate = addDays(date, 1);
        }

        if (newDate && this._isDateInValidRange(newDate)) {
            if (this._adjustSelectedMonthToEnsureVisibilityOf(newDate)) {
                // Update DOM immediately so that we can focus the new date
                DOM.processUpdates();
            }

            // Move focus to new date
            (
                this._dialogEl.querySelector<HTMLElement>(
                    `[data-date="${newDate}"]`
                )!
            ).focus();

            return false;
        }

        return true; // Don't prevent default
    }

    /**
     * @internal
     */
    _onDateFocus(date: DateStr) {
        this._lastFocussedDate = date;
    }

    /**
     * Only one date should be in the tab order at a time (tab roving).
     * @internal
     */
    @volatile
    get _tabbableDate(): DateStr | null {
        const datesInSegments = this._segments
            .filter(
                (segment): segment is CalendarSegment => segment.type === 'calendar'
            )
            .flatMap(segment => segment.calendar.grid.flat().map(d => d.date));

        const candidates = [
            this._lastFocussedDate,
            ...this._getSelectedDates(),
            currentDateStr(),
            ...datesInSegments,
        ];

        const firstVisibleMonth = this._selectedMonth;
        const lastVisibleMonth = addMonths(
            this._selectedMonth,
            this._numCalendars - 1
        );

        // Find valid candidate
        return (
            candidates.find(
                date => date
                    && compareMonths(monthOfDate(date), firstVisibleMonth) >= 0
                    && compareMonths(monthOfDate(date), lastVisibleMonth) <= 0
                    && this._isDateInValidRange(date)
            ) ?? null
        );
    }

    // --- Month picker ---

    /**
     * The year the month picker is currently showing.
     * If null, the month picker is not showing.
     * @internal
     */
    @observable _monthPickerYear: number | null = null;

    /**
     * @internal
     */
    get _inMonthPicker() {
        return this._monthPickerYear !== null;
    }

    /**
     * The month that had focus last, used to implement tab roving
     * @internal
     */
    @observable
    private _lastFocussedMonth: Month | null = null;

    /**
     * Handle month selected in the month picker.
     * @internal
     */
    _onMonthClick(month: Month) {
        this._selectedMonth = month;
        this._monthPickerYear = null;
    }

    /**
     * Handle keydown on a month in the month picker.
     * @internal
     */
    _onMonthKeydown(month: Month, event: KeyboardEvent) {
        let newMonth: Month | null = null;

        if (event.key === 'ArrowUp') {
            newMonth = addMonths(month, -MonthsPerRow);
        } else if (event.key === 'ArrowDown') {
            newMonth = addMonths(month, MonthsPerRow);
        } else if (event.key === 'ArrowLeft') {
            newMonth = addMonths(month, -1);
        } else if (event.key === 'ArrowRight') {
            newMonth = addMonths(month, 1);
        }

        if (newMonth && this._isMonthInValidRange(newMonth)) {
            // Change year if we moved to a different year
            if (newMonth.year !== this._monthPickerYear) {
                this._monthPickerYear = newMonth.year;
                // Update DOM immediately so that we can focus the new month
                DOM.processUpdates();
            }

            // Move focus to new month
            (
                this._dialogEl.querySelector<HTMLElement>(
                    `[data-month="${monthToStr(newMonth)}"]`
                )!
            ).focus();

            return false;
        }

        return true; // Don't prevent default
    }

    /**
     * @internal
     */
    _onMonthFocus(month: Month) {
        this._lastFocussedMonth = month;
    }

    /**
     * Only one month should be in the tab order at a time (tab roving).
     * @internal
     */
    @volatile
    get _tabbableMonth(): Month | null {
        const monthsInSegments = this._segments
            .filter(
                (segments): segments is MonthPickerSegment => segments.type === 'month-picker'
            )
            .flatMap(segment => segment.months.flat().map(c => c.month));

        const candidates = [
            this._lastFocussedMonth,
            this._selectedMonth,
            getCurrentMonth(),
            ...monthsInSegments,
        ];

        // Find valid candidate
        return (
            candidates.find(
                month => month
                    && month.year === this._monthPickerYear
                    && this._isMonthInValidRange(month)
            ) ?? null
        );
    }

    // --- Dialog footer ---

    /**
     * @internal
     */
    _onOkClick() {
        this._closePopup();
    }

    /**
     * @internal
     */
    _onClearClick() {
        this._closePopup();
    }
}

export interface DatePickerBase
    extends Localized,
    FormElementHelperText,
    TrappedFocus {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
applyMixinsWithObservables(
    DatePickerBase,
    Localized,
    FormElementHelperText,
    TrappedFocus
);
