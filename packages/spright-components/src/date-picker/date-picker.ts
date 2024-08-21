/* eslint-disable @typescript-eslint/member-ordering */
import { volatile } from '@microsoft/fast-element';
// import {
//     type ErrorText,
//     errorText,
//     type FormElement,
//     formElements,
// } from '../../shared/patterns';
import { DesignSystem } from '@microsoft/fast-foundation';
import {
    type FormElement,
    formElements
} from '../patterns/form-elements';
import { DatePickerBase } from '../date-picker-base/date-picker-base';
import {
    type DateStr,
    isValidDateStr,
} from '../date-picker-base/calendar/dateStr';
import {
    formatPresentationDate,
    parsePresentationDate,
} from '../date-picker-base/calendar/presentationDate';
import { datePickerBaseTemplate as template } from '../date-picker-base/date-picker-base.template';
import { datePickerBaseStyles as styles } from '../date-picker-base/date-picker-base.styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-date-picker': DatePicker;
    }
}

/**
 * Single date picker component.
 *
 * @public
 * @component date-picker
 * @slot helper-text - Describes how to use the date-picker. Alternative to the `helper-text` attribute.
 * @event {CustomEvent<undefined>} input - Emitted when the date is changed by the user.
 * @event {CustomEvent<undefined>} change - Emitted when the date is changed by the user.
 * @vueModel modelValue value input `(event.target as HTMLInputElement).value`
 */
// @errorText
@formElements
export class DatePicker extends DatePickerBase {
    public constructor() {
        super();
        this.proxy.type = 'date';
    }

    /**
     * @internal
     */
    public override valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        if (this.value) {
            if (!isValidDateStr(this.value)) {
                this.value = '';
                return;
            }

            this._presentationValue = formatPresentationDate(
                this.value,
                this.locale.datePicker
            );
            this._adjustSelectedMonthToEnsureVisibilityOf(this.value);
        } else {
            this._presentationValue = '';
        }
    }

    #updateValueDueToUserInteraction(newValue: DateStr): void {
        this.value = newValue;
        this.$emit('change');
        this.$emit('input');
    }

    /**
     * @internal
     */
    @volatile
    public get _calendarButtonLabel(): string {
        if (this.value) {
            return this.locale.datePicker.changeDateLabel(
                formatPresentationDate(this.value, this.locale.datePicker)
            );
        }
        return this.locale.datePicker.chooseDateLabel;
    }

    /**
     * @internal
     */
    public get _textFieldPlaceholder(): string {
        return this.locale.datePicker.dateFormatPlaceholder;
    }

    /**
     * @internal
     */
    public override _textFieldSize = '20';

    /**
     * @internal
     */
    public _onTextFieldChange(): void {
        if (this._presentationValue === '') {
            this.#updateValueDueToUserInteraction('');
            return;
        }

        try {
            this.#updateValueDueToUserInteraction(
                parsePresentationDate(this._presentationValue, this.locale.datePicker)
            );
        } catch (_) { /* empty */ }
    }

    /**
     * Handle selecting a date from the calendar.
     * @internal
     */
    public _onDateClick(date: DateStr): void {
        this.#updateValueDueToUserInteraction(date);
        this._closePopup();
    }

    /**
     * @internal
     */
    public override _isDateSelected(date: DateStr): boolean {
        return date === this.value;
    }

    /**
     * @internal
     */
    public override _isDateAriaSelected(date: DateStr): boolean {
        return this._isDateSelected(date);
    }

    /**
     * @internal
     */
    protected override _getSelectedDates(): DateStr[] {
        const dates = [];
        if (this.value) {
            dates.push(this.value);
        }
        return dates;
    }

    /**
     * @internal
     */
    protected override _getCustomValidationError(): string | null {
        if (this._isPresentationValueInvalid()) {
            return this.locale.datePicker.invalidDateError;
        }

        return null;
    }

    /**
     * @internal
     */
    private _isPresentationValueInvalid(): boolean {
        if (this._presentationValue === '') {
            return false;
        }

        try {
            parsePresentationDate(this._presentationValue, this.locale.datePicker);
            return false;
        } catch (_) {
            return true;
        }
    }

    /**
     * @internal
     */
    public override _onClearClick(): void {
        this.#updateValueDueToUserInteraction('');
        super._onClearClick();
    }
}

// export interface DatePicker extends ErrorText, FormElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatePicker extends FormElement {}

const sprightDatePicker = DatePicker.compose({
    baseName: 'date-picker',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightDatePicker());
export const datePickerTag = 'spright-date-picker';
