/* eslint-disable max-classes-per-file */
import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    FormAssociated,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { DateTimePickerAppearance } from './types';
import type { ErrorPattern } from '../patterns/error/types';
import { dateTimePickerTemplate } from './template';
import type { AnchoredRegion } from '../anchored-region';
import type { TextField } from '../text-field';
import { lang } from '../theme-provider';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-date-time-picker': DateTimePicker;
    }
}

/**
 * A form-associated base class for the date/time picker component.
 *
 * @internal
 */
class FormAssociatedDatePicker extends FormAssociated(FoundationElement) {
    public proxy = document.createElement('input');
}

/**
 * A nimble-styled HTML date/time picker
 */
export class DateTimePicker
    extends FormAssociatedDatePicker
    implements ErrorPattern {
    /**
     * The appearance the date/time picker should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: DateTimePickerAppearance = DateTimePickerAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /** @internal */
    @observable
    public supportsShowPicker = 'showPicker' in HTMLInputElement.prototype;

    /** @internal */
    @observable
    public popupOpen = false;

    /**
     * @internal
     */
    @observable
    public dateTimeLocalInput!: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public dateInput?: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public timeInput?: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public anchoredRegion?: AnchoredRegion;

    /**
     * @internal
     */
    @observable
    public textField!: TextField;

    private formatter?: Intl.DateTimeFormat;

    public override connectedCallback(): void {
        super.connectedCallback();
        const options: Intl.DateTimeFormatOptions = {
            dateStyle: 'medium',
            timeStyle: 'medium'
        };
        try {
            this.formatter = new Intl.DateTimeFormat(
                lang.getValueFor(this),
                options
            );
        } catch (e) {
            this.formatter = new Intl.DateTimeFormat('en', options);
        }
    }

    public onCalendarButtonClick(): void {
        try {
            this.dateTimeLocalInput.showPicker();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('failed to show picker', e);
            this.supportsShowPicker = false;
            this.popupOpen = true;
        }
    }

    public onMoreButtonClick(): void {
        this.popupOpen = !this.popupOpen;
    }

    public onDateTimeInputChange(): void {
        if (
            this.dateTimeLocalInput.value.length > 0
            && this.dateTimeLocalInput.checkValidity()
        ) {
            const parts = this.dateTimeLocalInput.value.split('T');
            if (parts.length === 2 && this.dateInput && this.timeInput) {
                this.dateInput.value = parts[0]!;
                this.timeInput.value = parts[1]!;
            }

            const date = new Date(this.dateTimeLocalInput.value);
            this.textField.currentValue = this.formatter?.format(date) ?? '';
        } else {
            this.textField.currentValue = '';
        }
    }

    public onDateInputChange(): void {
        this.onDateOrTimeChange();
    }

    public onTimeInputChange(): void {
        this.onDateOrTimeChange();
    }

    public focusoutHandler(e: FocusEvent): boolean {
        if (!this.popupOpen) {
            return true;
        }

        // Safari will trigger focusout after selecting either date or time, even if the other
        // hasn't been set (even before the user clicks out of the popover). So ignore focusout if date is set
        // but not time (or vice versa)
        const hasSingleDateOrTimeValue = (this.dateInput!.value === '' && this.timeInput!.value !== '')
            || (this.dateInput!.value !== '' && this.timeInput!.value === '');
        const focusTarget = e.relatedTarget as HTMLElement;
        if (!this.contains(focusTarget) && !hasSingleDateOrTimeValue) {
            this.popupOpen = false;
            return false;
        }

        return true;
    }

    public popupOpenChanged(_prev: boolean | undefined, _next: boolean): void {}

    public anchoredRegionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion
    ): void {
        if (this.anchoredRegion) {
            this.anchoredRegion.anchorElement = this.textField;
        }
    }

    public dateInputChanged(
        _prev: HTMLInputElement | undefined,
        _next: HTMLInputElement
    ): void {
        if (this.dateInput) {
            const parts = this.dateTimeLocalInput.value.split('T');
            if (parts.length === 2) {
                this.dateInput.value = parts[0]!;
            }
        }
    }

    public timeInputChanged(
        _prev: HTMLInputElement | undefined,
        _next: HTMLInputElement
    ): void {
        if (this.timeInput) {
            const parts = this.dateTimeLocalInput.value.split('T');
            if (parts.length === 2) {
                this.timeInput.value = parts[1]!;
            }
        }
    }

    private onDateOrTimeChange(): void {
        let date = this.dateInput!.value;
        let time = this.timeInput!.value;
        const parts = this.dateTimeLocalInput.value.split('T');
        if (parts.length === 2) {
            if (date === '') {
                date = parts[0]!;
            }
            if (time === '') {
                time = parts[1]!;
            }
        }
        const dateTime = `${date}T${time}`;
        this.dateTimeLocalInput.value = dateTime;
        this.onDateTimeInputChange();
    }
}

const nimbleDateTimePicker = DateTimePicker.compose({
    baseName: 'date-time-picker',
    baseClass: FormAssociatedDatePicker,
    template: dateTimePickerTemplate,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDateTimePicker());
export const dateTimePickerTag = 'nimble-date-time-picker';
