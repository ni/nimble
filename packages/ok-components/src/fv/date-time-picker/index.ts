import { attr, DOM, observable, Observable } from '@ni/fast-element';
import { applyMixins, ARIAGlobalStatesAndProperties, DesignSystem } from '@ni/fast-foundation';
import { Maskito } from '@maskito/core';
import { maskitoDate, maskitoDateTime, maskitoTime, type MaskitoTimeMode } from '@maskito/kit';
import type { TextField } from '@ni/nimble-components/dist/esm/text-field';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import type { Button } from '@ni/nimble-components/dist/esm/button';
import type { Select } from '@ni/nimble-components/dist/esm/select';
import { mixinErrorPattern } from '@ni/nimble-components/dist/esm/patterns/error/types';
import { mixinRequiredVisiblePattern } from '@ni/nimble-components/dist/esm/patterns/required-visible/types';
import { direction, lang } from '@ni/nimble-components/dist/esm/theme-provider';
import { FormAssociatedDateTimePicker } from './models/form-associated';
import { adjustSegment, calendarDate, dateFormat, dateKey, displaySegments, formatDisplay, formatTime, formatValue, parseDisplay, parseIsoPaste, parseValue, timeFormat, today } from './models/date-time';
import { labels } from './label-provider';
import { styles } from './styles';
import { template } from './template';
import { FvDateTimePickerAppearance, FvDateTimePickerType, type FvDateTimePickerAppearance as Appearance, type FvDateTimePickerType as PickerType } from './types';

interface InputEditState {
    input?: { start: number, end: number, text: string };
    pending: boolean;
    draftLength?: number;
    committedText?: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-date-time-picker': FvDateTimePicker;
    }
}

/**
 * A local date/time field with masked entry and a calendar picker.
 * Values use YYYY-MM-DD or YYYY-MM-DDTHH:mm without a time zone.
 * @slot - The field label.
 * @fires input - The value changed through user interaction.
 * @fires change - The user committed a field or picker edit.
 */
export class FvDateTimePicker extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FormAssociatedDateTimePicker)
) {
    @attr
    public appearance: Appearance = FvDateTimePickerAppearance.underline;

    @attr
    public type: PickerType = FvDateTimePickerType.datetimeLocal;

    @attr
    public min?: string;

    @attr
    public max?: string;

    /** Days for date mode, seconds for datetime-local; "any" disables step validation. */
    @attr
    public step?: string;

    @attr({ attribute: 'readonly', mode: 'boolean' })
    public readOnly = false;

    @attr({ mode: 'boolean' })
    public override autofocus = false;

    @attr
    public autocomplete?: string;

    @attr
    public placeholder?: string;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;

    @attr({ attribute: 'appearance-readonly', mode: 'boolean' })
    public appearanceReadOnly = false;

    /** @internal */
    @observable
    public defaultSlottedNodes: Node[] = [];

    /** @internal */
    public control!: HTMLInputElement;

    /** @internal */
    @observable
    public locale = 'en-US';

    /** @internal */
    @observable
    public rtl = false;

    @attr({ mode: 'boolean' })
    public open = false;

    /** @internal */
    @observable
    public visibleDate = today();

    /** @internal */
    @observable
    public focusedDate = '';

    /** @internal */
    public trigger!: Button;

    /** @internal */
    public field!: HTMLDivElement;

    /** @internal */
    @observable
    public region?: AnchoredRegion;

    /** @internal */
    @observable
    public timeField?: TextField;

    /** @internal */
    @observable
    public entryError = '';

    /** @internal */
    @observable
    public entryErrorElement?: HTMLElement;

    private validationAttempted = false;

    private mask?: Maskito;
    private timeMask?: Maskito;

    @observable
    private editingText?: string;

    @observable
    private timeText?: string;

    private timeEditDate?: Date;

    @observable
    private editingTimeMode?: MaskitoTimeMode;

    private updatingText = false;

    private maskKey = '';

    private readonly mainSegmentState: InputEditState = { pending: false };

    private timeSegmentListeners?: AbortController;
    private readonly timeSegmentState: InputEditState = { pending: false };

    private readonly scrollRoots: (Document | ShadowRoot)[] = [];

    private readonly localeSubscriber = { handleChange: (): void => this.refreshLocale() };

    private readonly stateSubscriber = {
        handleChange: (): void => {
            if (this.disabled || this.readOnly) {
                this.open = false;
            }
        }
    };

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.refreshLocale();
        this.updateConstraints();
        this.ownerDocument.addEventListener('pointerdown', this.outsidePointerHandler);
        let root = this.getRootNode();
        while (root instanceof ShadowRoot || root instanceof Document) {
            root.addEventListener('scroll', this.updatePopupPosition, true);
            this.scrollRoots.push(root);
            if (root instanceof Document) {
                break;
            }
            root = root.host.getRootNode();
        }
        this.ownerDocument.defaultView?.addEventListener('resize', this.updatePopupPosition);
        lang.subscribe(this.localeSubscriber, this);
        direction.subscribe(this.localeSubscriber, this);
        Observable.getNotifier(this).subscribe(this.stateSubscriber, 'disabled');
        Observable.getNotifier(this).subscribe(this.stateSubscriber, 'readOnly');
        this.entryErrorChanged();
        if (this.open) {
            this.openChanged();
        }
        if (this.autofocus) {
            DOM.queueUpdate(() => this.control.focus());
        }
    }

    /** @internal */
    public override disconnectedCallback(): void {
        if (this.region?.isConnected && this.region.matches(':popover-open')) {
            this.region.hidePopover();
        }
        this.timeSegmentListeners?.abort();
        this.timeMask?.destroy();
        this.mask?.destroy();
        this.mask = undefined;
        this.maskKey = '';
        lang.unsubscribe(this.localeSubscriber, this);
        direction.unsubscribe(this.localeSubscriber, this);
        this.ownerDocument.removeEventListener('pointerdown', this.outsidePointerHandler);
        for (const root of this.scrollRoots) {
            root.removeEventListener('scroll', this.updatePopupPosition, true);
        }
        this.scrollRoots.length = 0;
        this.ownerDocument.defaultView?.removeEventListener('resize', this.updatePopupPosition);
        Observable.getNotifier(this).unsubscribe(this.stateSubscriber, 'disabled');
        Observable.getNotifier(this).unsubscribe(this.stateSubscriber, 'readOnly');
        super.disconnectedCallback();
    }

    /** @internal */
    public openChanged(): void {
        DOM.queueUpdate(() => DOM.queueUpdate(() => {
            const region = this.region;
            if (!region?.isConnected) {
                return;
            }
            if (this.open && !region.matches(':popover-open')) {
                region.showPopover();
            } else if (!this.open && region.matches(':popover-open')) {
                region.hidePopover();
            }
        }));
        if (!this.open) {
            if (this.timeField && this.timeSegmentState !== undefined) {
                // Flush native change before the synthetic fallback to avoid duplicate commits.
                this.timeField.control.blur();
                this.handleInputBlur(this.timeField.control);
            }
            this.timeSegmentListeners?.abort();
            this.resetInputState(this.timeSegmentState);
            this.timeMask?.destroy();
            this.timeMask = undefined;
            return;
        }
        if (this.disabled || this.readOnly) {
            this.open = false;
            return;
        }
        const date = this.parsedValue ?? this.timeEditDate ?? today();
        this.visibleDate = new Date(date);
        this.visibleDate.setUTCDate(1);
        const focus = this.isDayDisabled(date) ? this.days.find(day => !this.isDayDisabled(day)) ?? date : date;
        this.focusedDate = this.dateKey(focus);
        this.focusDay();
        this.timeFieldChanged();
    }

    /** @internal */
    public timeFieldChanged(): void {
        this.timeSegmentListeners?.abort();
        this.timeMask?.destroy();
        DOM.queueUpdate(() => {
            if (this.open && this.timeField) {
                this.timeMask?.destroy();
                const control = this.timeField.control;
                this.timeSegmentListeners?.abort();
                this.timeSegmentListeners = new AbortController();
                const options = { signal: this.timeSegmentListeners.signal };
                const listen = <K extends keyof HTMLElementEventMap>(name: K, handler: (event: HTMLElementEventMap[K]) => boolean): void => {
                    control.addEventListener(name, event => {
                        if (!handler(event)) {
                            event.preventDefault();
                        }
                    }, options);
                };
                listen('click', () => this.highlightSegment(control));
                listen('keyup', event => this.handleInputKeyup(event, control));
                listen('keydown', event => this.handleInputKeydown(event, control));
                listen('beforeinput', event => this.handleSegmentInput(event, control));
                listen('blur', () => this.handleInputBlur(control));
                const mask = maskitoTime(timeFormat(this.locale, this.timeMode));
                this.timeMask = new Maskito(control, { mask: mask.mask, overwriteMode: mask.overwriteMode });
                this.entryErrorChanged();
            }
        });
    }

    /** @internal */
    public entryErrorChanged(): void {
        DOM.queueUpdate(() => {
            const root = this.getRootNode();
            const descriptions: Element[] = [];
            if (root instanceof Document || root instanceof ShadowRoot) {
                for (const id of this.ariaDescribedby?.split(/\s+/) ?? []) {
                    const description = root.getElementById(id);
                    if (description) {
                        descriptions.push(description);
                    }
                }
            }
            if (this.entryError && this.entryErrorElement) {
                descriptions.push(this.entryErrorElement);
            }
            // String ID references cannot cross the native inputs' shadow boundaries.
            if (this.control !== undefined) {
                this.control.ariaDescribedByElements = descriptions;
            }
            if (this.timeField) {
                this.timeField.control.ariaDescribedByElements = descriptions;
            }
        });
    }

    /** @internal */
    public entryErrorElementChanged(): void {
        this.entryErrorChanged();
    }

    /** @internal */
    public ariaDescribedbyChanged(): void {
        this.entryErrorChanged();
    }

    /** @internal */
    public regionChanged(): void {
        if (this.region) {
            this.region.anchorElement = this.field;
        }
    }

    /** @internal */
    public override validate(): void {
        if (this.proxy === undefined) {
            return;
        }
        const badTime = this.timeText !== undefined && !this.parseTimeText(this.timeText);
        const badInput = (this.editingText !== undefined && this.editingText !== '' && !this.parseText(this.editingText))
            || badTime;
        const native = this.proxy.validity;
        const invalidEntryMessage = badTime ? this.localizedLabels.invalidTime
            : this.localizedLabels[this.type === 'date' ? 'invalidDate' : 'invalidDateTime'];
        this.setValidity(this.disabled || this.readOnly ? {} : {
            badInput,
            valueMissing: native.valueMissing,
            rangeUnderflow: native.rangeUnderflow,
            rangeOverflow: native.rangeOverflow,
            stepMismatch: native.stepMismatch
        }, badInput ? invalidEntryMessage : this.proxy.validationMessage, this.control);
        this.entryError = this.validationAttempted ? this.validationMessage : '';
    }

    /** @internal */
    public handleInvalid(): void {
        this.validationAttempted = true;
        this.validate();
    }

    /** @internal */
    public handleChange(): void {
        this.commitControl(this.control);
    }

    /** @internal */
    public handleTextInput(complete = false): void {
        if (this.disabled || this.readOnly) {
            return;
        }
        const text = this.control.value;
        this.trackInput(this.mainSegmentState, text, complete);
        const value = this.parseText(text, complete);
        this.setTextValue(value);
        this.timeText = undefined;
        this.timeEditDate = undefined;
        this.editingText = value || !text ? undefined : text;
        if (complete && value) {
            this.control.value = this.displayValue;
        }
        this.validate();
    }

    /** @internal */
    public handlePaste(event: ClipboardEvent): boolean {
        this.mainSegmentState.input = undefined;
        this.mainSegmentState.draftLength = undefined;
        const text = event.clipboardData?.getData('text');
        if (!text || this.disabled || this.readOnly) {
            return true;
        }
        const start = this.control.selectionStart ?? 0;
        const end = this.control.selectionEnd ?? start;
        let next = this.control.value.slice(0, start) + text + this.control.value.slice(end);
        const iso = start === 0 && end === this.control.value.length && /^\d{4}-/.test(text.trim());
        const parsed = iso ? parseIsoPaste(text, this.type) : parseValue(this.parseText(next, true), this.type);
        if (!parsed && !iso) {
            return true;
        }
        if (parsed) {
            if (parsed.getUTCMilliseconds() !== 0) {
                this.editingTimeMode = 'HH:MM:SS.MSS';
            } else if (parsed.getUTCSeconds() !== 0 && this.timeMode === 'HH:MM') {
                this.editingTimeMode = 'HH:MM:SS';
            }
            this.updateMask();
            next = formatDisplay(parsed, this.type, this.locale, this.timeMode);
        } else {
            // Preserve invalid ISO drafts without Maskito rearranging their digits.
            this.mask?.destroy();
            this.maskKey = '';
            next = text.trim();
        }
        // Maskito's date/time paste normalizer drops the meridiem from complete dates.
        this.control.value = next;
        this.control.setSelectionRange(next.length, next.length);
        this.control.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertFromPaste' }));
        if (!parsed) {
            this.updateMask();
        }
        return false;
    }

    /** @internal */
    public override valueChanged(previous: string, next: string): void {
        if (!this.updatingText) {
            this.resetSegmentStates();
            this.validationAttempted = false;
            this.entryError = '';
            this.editingText = undefined;
            this.timeText = undefined;
            this.timeEditDate = undefined;
            this.editingTimeMode = undefined;
        }
        if (this.proxy !== undefined) {
            this.proxy.type = this.type;
            this.proxy.value = next;
            if (!parseValue(this.proxy.value, this.type)) {
                this.proxy.value = '';
            }
            if (next !== this.proxy.value) {
                this.value = this.proxy.value;
                return;
            }
        }
        super.valueChanged(previous, next);
        const date = this.parsedValue;
        if (this.open && date && previous.slice(0, 10) !== next.slice(0, 10)) {
            this.focusedDate = this.dateKey(date);
            this.visibleDate = calendarDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
        }
        if (!this.updatingText) {
            this.updateMask();
            if (this.control !== undefined) {
                this.control.value = this.displayValue;
            }
            if (this.timeField) {
                this.timeField.value = this.timeDisplay;
                this.timeField.control.value = this.timeDisplay;
            }
        }
    }

    /** @internal */
    public override formResetCallback(): void {
        this.resetSegmentStates();
        this.validationAttempted = false;
        this.entryError = '';
        this.editingText = undefined;
        this.timeText = undefined;
        this.timeEditDate = undefined;
        this.editingTimeMode = undefined;
        super.formResetCallback();
        this.validate();
    }

    /** @internal */
    public typeChanged(): void {
        if (this.type !== 'date' && this.type !== 'datetime-local') {
            throw new RangeError('Date/time picker type must be "date" or "datetime-local".');
        }
        if (this.proxy !== undefined) {
            this.resetSegmentStates();
            this.open = false;
            this.editingText = undefined;
            this.timeText = undefined;
            this.timeEditDate = undefined;
            this.editingTimeMode = undefined;
            this.proxy.type = this.type;
            if (this.value && !parseValue(this.value, this.type)) {
                this.value = '';
            }
            this.updateConstraints();
            this.updateMask();
        }
    }

    /** @internal */
    public minChanged(): void {
        this.updateConstraints();
        this.updateMask();
    }

    /** @internal */
    public maxChanged(): void {
        this.updateConstraints();
        this.updateMask();
    }

    /** @internal */
    public stepChanged(): void {
        this.updateConstraints();
        this.updateMask();
    }

    /** @internal */
    public readOnlyChanged(): void {
        if (this.proxy !== undefined) {
            this.proxy.readOnly = this.readOnly;
            this.validate();
        }
    }

    /** @internal */
    public override initialValueChanged(previous: string, next: string): void {
        super.initialValueChanged?.(previous, next);
        this.updateConstraints();
    }

    /** @internal */
    public get displayValue(): string {
        if (this.editingText !== undefined) {
            return this.editingText;
        }
        const date = this.parsedValue;
        if (!date) {
            return this.value;
        }
        return formatDisplay(date, this.type, this.locale, this.timeMode);
    }

    /** @internal */
    public get parsedValue(): Date | null {
        return parseValue(this.value, this.type);
    }

    /** @internal */
    public get days(): Date[] {
        const first = new Date(this.visibleDate);
        first.setUTCDate(1);
        first.setUTCDate(1 - ((first.getUTCDay() - this.firstDayOfWeek + 7) % 7));
        return Array.from({ length: 42 }, (_, index) => {
            const date = new Date(first);
            date.setUTCDate(first.getUTCDate() + index);
            return date;
        });
    }

    /** @internal */
    public get weeks(): { days: Date[], picker: FvDateTimePicker }[] {
        const days = this.days;
        return Array.from({ length: 6 }, (_, index) => ({
            days: days.slice(index * 7, index * 7 + 7),
            picker: this
        }));
    }

    /** @internal */
    public get monthLabel(): string {
        return this.visibleDate.toLocaleDateString(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    }

    /** @internal */
    public get months(): string[] {
        return Array.from({ length: 12 }, (_, month) => calendarDate(2024, month, 1)
            .toLocaleDateString(this.locale, { month: 'long', timeZone: 'UTC' }));
    }

    /** @internal */
    public get timeValue(): string {
        return this.parsedValue ? this.value.slice(11) : '00:00';
    }

    /** @internal */
    public get timeDisplay(): string {
        return this.timeText ?? formatTime(this.parsedValue ?? calendarDate(1970, 0, 1), this.locale, this.timeMode);
    }

    /** @internal */
    public get timePlaceholder(): string {
        const { dayPeriod, mode, separators } = timeFormat(this.locale, this.timeMode);
        let index = 0;
        const text = mode.toLowerCase().replace(/[:.]/g, () => {
            const separator = separators[index] ?? ':';
            index += 1;
            return separator;
        });
        return `${text}${dayPeriod[0] ? ` ${dayPeriod.join('/')}` : ''}`;
    }

    /** @internal */
    public get inputPlaceholder(): string {
        const { mode, separator } = dateFormat(this.locale);
        const date = mode.toUpperCase().split('/').join(separator);
        return this.type === 'date' ? date : `${date} ${this.timePlaceholder}`;
    }

    /** @internal */
    public get timeMode(): MaskitoTimeMode {
        const sources = [this.value, this.min, this.max, this.initialValue];
        const step = Number(this.step);
        let mode: MaskitoTimeMode = 'HH:MM';
        if (this.step === 'any' || sources.some(value => value?.includes('.')) || (step > 0 && step % 1 !== 0)) {
            mode = 'HH:MM:SS.MSS';
        } else if (sources.some(value => value !== undefined && value.length > 16)
            || (step > 0 && step % 60 !== 0)) {
            mode = 'HH:MM:SS';
        }
        return this.editingTimeMode !== undefined && this.editingTimeMode.length > mode.length ? this.editingTimeMode : mode;
    }

    /** @internal */
    public get firstDayOfWeek(): number {
        const locale: Intl.Locale & {
            getWeekInfo?: () => { firstDay: number },
            weekInfo?: { firstDay: number }
        } = new Intl.Locale(this.locale);
        // Older Firefox versions lack week information; Sunday is the documented fallback.
        return (locale.getWeekInfo?.().firstDay ?? locale.weekInfo?.firstDay ?? 7) % 7;
    }

    /** @internal */
    public get weekdays(): { name: string, short: string }[] {
        return Array.from({ length: 7 }, (_, index) => {
            const date = calendarDate(2024, 0, 7 + ((this.firstDayOfWeek + index) % 7));
            return {
                name: date.toLocaleDateString(this.locale, { weekday: 'long', timeZone: 'UTC' }),
                short: date.toLocaleDateString(this.locale, { weekday: 'narrow', timeZone: 'UTC' })
            };
        });
    }

    /** @internal */
    public dayLabel(date: Date): string {
        return date.toLocaleDateString(this.locale, { dateStyle: 'full', timeZone: 'UTC' });
    }

    /** @internal */
    public isDayDisabled(date: Date): boolean {
        if (date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) {
            return true;
        }
        const key = dateKey(date);
        const min = parseValue(this.min ?? '', this.type);
        const max = parseValue(this.max ?? '', this.type);
        if ((min && key < dateKey(min)) || (max && key > dateKey(max))) {
            return true;
        }
        if (this.type === 'date' && this.step !== 'any') {
            const step = Number(this.step) > 0 ? Number(this.step) : 1;
            const base = min ?? parseValue(this.initialValue, 'date') ?? calendarDate(1970, 0, 1);
            const steps = (date.getTime() - base.getTime()) / (step * 86400000);
            return Math.abs(steps - Math.round(steps)) > 1e-8;
        }
        return false;
    }

    /** @internal */
    public get years(): number[] {
        const currentYear = new Date().getFullYear();
        const first = Math.max(1, currentYear - 100);
        const last = Math.min(9999, currentYear + 100);
        const years = Array.from({ length: last - first + 1 }, (_, index) => first + index);
        const visibleYear = this.visibleDate.getUTCFullYear();
        if (visibleYear < first) {
            years.unshift(visibleYear);
        } else if (visibleYear > last) {
            years.push(visibleYear);
        }
        return years;
    }

    /** @internal */
    public dateKey(date: Date): string {
        return dateKey(date);
    }

    /** @internal */
    public isSelected(date: Date): boolean {
        return this.dateKey(date) === this.value.slice(0, 10) && this.parsedValue !== null;
    }

    /** @internal */
    public isToday(date: Date): boolean {
        return this.dateKey(date) === this.dateKey(today());
    }

    /** @internal */
    public togglePicker(): boolean {
        this.open = !this.open;
        return true;
    }

    /** @internal */
    public handleTriggerMousedown(event: MouseEvent): boolean {
        if (event.button !== 0 || this.disabled || this.readOnly) {
            return true;
        }
        this.trigger.focus();
        return false;
    }

    /** @internal */
    public closePicker(): boolean {
        this.open = false;
        this.control.focus();
        return true;
    }

    /** @internal */
    public selectDay(date: Date): boolean {
        if (!this.disabled && !this.readOnly && !this.isDayDisabled(date)) {
            this.commit(this.type === 'date' ? this.dateKey(date) : `${this.dateKey(date)}T${this.timeValue}`);
            this.focusedDate = this.dateKey(date);
            this.visibleDate = new Date(date);
            this.visibleDate.setUTCDate(1);
            this.focusDay();
        }
        return true;
    }

    /** @internal */
    public handleTimeInput(event: Event): boolean {
        event.stopPropagation();
        this.updateTimeInput(event.currentTarget as TextField);
        return true;
    }

    /** @internal */
    public changeTime(event: Event): boolean {
        event.stopPropagation();
        this.commitControl((event.currentTarget as TextField).control);
        return true;
    }

    /** @internal */
    public stopPickerEvent(event: Event): boolean {
        event.stopPropagation();
        return true;
    }

    /** @internal */
    public handlePickerMousedown(event: MouseEvent): boolean {
        const button = event.composedPath().find(target => target instanceof HTMLButtonElement);
        if (event.button === 0 && button instanceof HTMLButtonElement) {
            // Safari otherwise blurs the day before click, dismissing the picker.
            button.focus();
            return false;
        }
        return true;
    }

    /** @internal */
    public moveMonth(offset: number): boolean {
        this.setMonth(this.visibleDate.getUTCFullYear(), this.visibleDate.getUTCMonth() + offset);
        return true;
    }

    /** @internal */
    public changeMonth(event: Event): boolean {
        const month = Number((event.currentTarget as Select).value);
        if (month !== this.visibleDate.getUTCMonth()) {
            this.setMonth(this.visibleDate.getUTCFullYear(), month);
        }
        return true;
    }

    /** @internal */
    public changeYear(event: Event): boolean {
        const input = event.currentTarget as Select;
        if (input.validity.valid && input.value && Number(input.value) !== this.visibleDate.getUTCFullYear()) {
            this.setMonth(Number(input.value), this.visibleDate.getUTCMonth());
        }
        return true;
    }

    /** @internal */
    public handleKeydown(event: KeyboardEvent): boolean {
        if (event.defaultPrevented) {
            return true;
        }
        if (event.key === 'Escape' && this.open) {
            event.stopPropagation();
            this.closePicker();
            return false;
        }
        if (event.altKey && event.key === 'ArrowDown') {
            if (!this.disabled && !this.readOnly) {
                this.trigger.focus();
            }
            this.open = true;
            return false;
        }
        return true;
    }

    /** @internal */
    public highlightSegment(control = this.control): boolean {
        const state = this.getSegmentState(control);
        state.input = undefined;
        if (this.disabled || this.readOnly || control.selectionStart !== control.selectionEnd
            || (!this.parseControl(control) && state.draftLength !== control.value.length)) {
            return true;
        }
        const position = control.selectionStart ?? 0;
        const segments = this.controlSegments(control);
        const segment = segments.find(range => position < range.end) ?? segments[segments.length - 1]!;
        control.setSelectionRange(segment.start, segment.end);
        return true;
    }

    /** @internal */
    public handleSegmentInput(event: InputEvent, control = this.control): boolean {
        const state = this.getSegmentState(control);
        if (event.defaultPrevented || this.disabled || this.readOnly || event.isComposing) {
            state.input = undefined;
            return true;
        }
        const start = control.selectionStart ?? 0;
        const end = control.selectionEnd ?? start;
        const text = control.value;
        const segmented = Boolean(this.parseControl(control)) || state.draftLength === text.length;
        if (segmented && ['deleteContentBackward', 'deleteContentForward', 'deleteByCut'].includes(event.inputType)
            && !(start === 0 && end === text.length)) {
            const segments = this.controlSegments(control)
                .filter(range => range.part !== 'dayPeriod');
            const positions = segments.flatMap(range => Array.from({ length: range.end - range.start }, (_, i) => range.start + i));
            let from = start;
            let to = end;
            if (start === end) {
                const position = event.inputType === 'deleteContentBackward'
                    ? positions.filter(i => i < start).pop() : positions.find(i => i >= start);
                if (position === undefined) {
                    event.stopImmediatePropagation();
                    return false;
                }
                from = position;
                to = position + 1;
            }
            control.value = Array.from(text, (character, index) => (
                index >= from && index < to && positions.includes(index) ? '0' : character
            )).join('');
            control.setSelectionRange(from, from);
            state.input = undefined;
            if (control.value !== text) {
                state.draftLength = text.length;
                this.emitSegmentInput(event, control);
            } else {
                event.stopImmediatePropagation();
            }
            return false;
        }
        if (event.inputType !== 'insertText' || !event.data || !/^\d+$/.test(event.data)) {
            state.input = undefined;
            return true;
        }
        let input = state.input;
        if (!input || start !== end || start !== input.end) {
            const segment = segmented
                ? this.controlSegments(control)
                    .find(range => range.part !== 'dayPeriod' && (start === end
                        ? start >= range.start && start + event.data!.length <= range.end
                        : start === range.start && end === range.end))
                : undefined;
            if (!segment) {
                state.input = undefined;
                return true;
            }
            input = { start, end: start === end ? start + event.data.length : end, text: '' };
        }
        const length = input.end - input.start;
        if (input.text.length + event.data.length > length) {
            state.input = undefined;
            return true;
        }
        input.text += event.data;
        control.value = control.value.slice(0, input.start)
            + input.text.padStart(length, '0') + control.value.slice(input.end);
        control.setSelectionRange(input.end, input.end);
        state.input = input.text.length < length ? input : undefined;
        this.emitSegmentInput(event, control);
        return false;
    }

    /** @internal */
    public handleInputBlur(control = this.control): boolean {
        const state = this.getSegmentState(control);
        state.input = undefined;
        if (state.pending) {
            this.commitControl(control);
        }
        return true;
    }

    /** @internal */
    public handleInputKeyup(event: KeyboardEvent, control = this.control): boolean {
        if (!event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey
            && ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'].includes(event.key)) {
            this.highlightSegment(control);
        }
        return true;
    }

    /** @internal */
    public handleInputKeydown(event: KeyboardEvent, control = this.control): boolean {
        const state = this.getSegmentState(control);
        if (!/^\d$/.test(event.key)) {
            state.input = undefined;
        }
        if (event.defaultPrevented || event.isComposing || this.disabled || this.readOnly
            || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return true;
        }
        if (event.key === 'Enter' && state.pending) {
            this.commitControl(control);
            return false;
        }
        const date = parseValue(this.parseControl(control), this.type);
        if (!date) {
            return true;
        }
        const segments = this.controlSegments(control);
        const start = control.selectionStart ?? 0;
        const end = control.selectionEnd ?? start;
        const index = segments.findIndex(range => (start === end
            ? start < range.end || range === segments[segments.length - 1]
            : start === range.start && end === range.end));
        if (index < 0) {
            return true;
        }
        const segment = segments[index]!;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            const offset = (event.key === 'ArrowRight' ? 1 : -1) * (this.rtl ? -1 : 1);
            let targetIndex = Math.max(0, Math.min(segments.length - 1, index + offset));
            if (event.key === 'Home') {
                targetIndex = 0;
            } else if (event.key === 'End') {
                targetIndex = segments.length - 1;
            }
            const target = segments[targetIndex]!;
            control.setSelectionRange(target.start, target.end);
            return false;
        }
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return true;
        }
        const next = adjustSegment(date, segment.part, event.key === 'ArrowUp' ? 1 : -1);
        if (next.getUTCFullYear() >= 1 && next.getUTCFullYear() <= 9999) {
            state.pending = false;
            const mode = this.timeMode;
            this.commit(formatValue(next, this.type));
            this.editingTimeMode = mode;
            this.updateMask();
            this.control.value = this.displayValue;
            if (control !== this.control && this.timeField) {
                this.timeField.value = this.timeDisplay;
                control.value = this.timeDisplay;
                this.timeEditDate = next;
            }
            const range = this.controlSegments(control)[index]!;
            control.setSelectionRange(range.start, range.end);
        }
        return false;
    }

    /** @internal */
    public handleDayKeydown(event: KeyboardEvent, date: Date): boolean {
        const next = new Date(date);
        switch (event.key) {
            case 'ArrowLeft': next.setUTCDate(date.getUTCDate() + (this.rtl ? 1 : -1)); break;
            case 'ArrowRight': next.setUTCDate(date.getUTCDate() + (this.rtl ? -1 : 1)); break;
            case 'ArrowUp': next.setUTCDate(date.getUTCDate() - 7); break;
            case 'ArrowDown': next.setUTCDate(date.getUTCDate() + 7); break;
            case 'Home': next.setUTCDate(date.getUTCDate() - ((date.getUTCDay() - this.firstDayOfWeek + 7) % 7)); break;
            case 'End': next.setUTCDate(date.getUTCDate() + 6 - ((date.getUTCDay() - this.firstDayOfWeek + 7) % 7)); break;
            case 'PageUp':
            case 'PageDown': {
                next.setTime(adjustSegment(date, 'month', event.key === 'PageUp' ? -1 : 1).getTime());
                break;
            }
            default: return true;
        }
        if (next.getUTCFullYear() >= 1 && next.getUTCFullYear() <= 9999) {
            this.focusedDate = this.dateKey(next);
            this.visibleDate = new Date(next);
            this.visibleDate.setUTCDate(1);
            this.focusDay();
        }
        return false;
    }

    /** @internal */
    public handleFocusout(): boolean {
        DOM.queueUpdate(() => {
            if (!this.shadowRoot?.activeElement) {
                this.open = false;
            }
        });
        return true;
    }

    /** @internal */
    public focusDay(preserveFocus = false): boolean {
        DOM.queueUpdate(() => {
            const active = this.shadowRoot?.activeElement;
            if (preserveFocus && active && active !== this.trigger) {
                return;
            }
            const requested = this.shadowRoot?.querySelector<HTMLButtonElement>(`[data-date="${this.focusedDate}"]`);
            const day = requested ?? this.shadowRoot?.querySelector<HTMLButtonElement>('.day:not([aria-disabled="true"])');
            if (day) {
                this.focusedDate = day.dataset.date ?? '';
                day.focus();
            } else {
                this.shadowRoot?.querySelector<Select>('.month')?.focus();
            }
        });
        return true;
    }

    private readonly updatePopupPosition = (): void => {
        if (this.open && this.region?.isConnected) {
            this.region.update();
        }
    };

    private readonly outsidePointerHandler = (event: Event): void => {
        if (!event.composedPath().includes(this)) {
            this.open = false;
        }
    };

    private setMonth(year: number, month: number): void {
        const date = new Date(this.visibleDate);
        date.setUTCFullYear(year, month, 1);
        if (date.getUTCFullYear() >= 1 && date.getUTCFullYear() <= 9999) {
            this.visibleDate = date;
            const enabled = this.days.filter(day => !this.isDayDisabled(day));
            const target = enabled.find(day => day.getUTCMonth() === date.getUTCMonth()) ?? enabled[0] ?? date;
            this.focusedDate = this.dateKey(target);
        }
    }

    private commit(value: string): void {
        this.editingText = undefined;
        this.timeText = undefined;
        this.timeEditDate = undefined;
        this.editingTimeMode = undefined;
        const changed = this.value !== value;
        if (changed) {
            this.value = value;
        }
        this.validationAttempted = true;
        this.validate();
        if (changed) {
            this.$emit('input');
            this.$emit('change');
        }
    }

    private parseText(text: string, complete = false): string {
        return parseDisplay(text, this.type, this.locale, this.timeMode, complete);
    }

    private setTextValue(value: string): void {
        const mode = this.timeMode;
        this.updatingText = true;
        try {
            this.value = value;
        } finally {
            this.updatingText = false;
        }
        this.editingTimeMode = mode;
    }

    /** @internal */
    public get localizedLabels(): { [K in keyof typeof labels]: string } {
        return {
            chooseDate: labels.chooseDate.getValueFor(this),
            chooseDateTime: labels.chooseDateTime.getValueFor(this),
            month: labels.month.getValueFor(this),
            year: labels.year.getValueFor(this),
            previousMonth: labels.previousMonth.getValueFor(this),
            nextMonth: labels.nextMonth.getValueFor(this),
            time: labels.time.getValueFor(this),
            invalidDate: labels.invalidDate.getValueFor(this),
            invalidDateTime: labels.invalidDateTime.getValueFor(this),
            invalidTime: labels.invalidTime.getValueFor(this)
        };
    }

    /** @internal */
    public get pickerLabel(): string {
        return this.type === 'date' ? this.localizedLabels.chooseDate : this.localizedLabels.chooseDateTime;
    }

    private updateTimeInput(input: TextField, complete = false): void {
        if (this.disabled || this.readOnly) {
            return;
        }
        const text = input.value;
        this.trackInput(this.timeSegmentState, text, complete);
        const date = this.timeEditDate ?? this.parsedValue ?? today();
        const value = this.parseTimeText(text, date, complete);
        this.setTextValue(value);
        this.editingText = undefined;
        this.timeEditDate = date;
        this.timeText = complete && value ? undefined : text;
        if (complete && value) {
            input.value = this.timeDisplay;
        }
        input.setValidity(value ? {} : { customError: true }, value ? '' : this.localizedLabels.invalidTime, input.control);
        this.validate();
        this.$emit('input');
    }

    private parseTimeText(text: string, date = this.timeEditDate ?? this.parsedValue ?? today(), complete = false): string {
        const dateText = formatDisplay(date, 'date', this.locale, this.timeMode);
        return text.trim() ? parseDisplay(`${dateText} ${text}`, 'datetime-local', this.locale, this.timeMode, complete) : '';
    }

    private refreshLocale(): void {
        this.resetSegmentStates();
        this.locale = new Intl.Locale(lang.getValueFor(this), { calendar: 'gregory', numberingSystem: 'latn' }).toString();
        this.rtl = direction.getValueFor(this) === 'rtl';
        this.updateMask();
    }

    private emitSegmentInput(event: InputEvent, control: HTMLInputElement): void {
        // Maskito must not compact or reapply an edit already handled positionally.
        event.stopImmediatePropagation();
        control.dispatchEvent(new InputEvent('input', {
            bubbles: true, composed: true, inputType: event.inputType, data: event.data
        }));
    }

    private getSegmentState(control: HTMLInputElement): InputEditState {
        return control === this.control ? this.mainSegmentState : this.timeSegmentState;
    }

    private trackInput(state: InputEditState, text: string, complete: boolean): void {
        state.pending = !complete;
        state.committedText = undefined;
        if (text.length !== state.draftLength) {
            state.draftLength = undefined;
        }
    }

    private resetInputState(state: InputEditState | undefined): void {
        // Attribute callbacks can run before private field initializers.
        if (state !== undefined) {
            state.input = undefined;
            state.pending = false;
            state.draftLength = undefined;
            state.committedText = undefined;
        }
    }

    private resetSegmentStates(): void {
        this.resetInputState(this.mainSegmentState);
        this.resetInputState(this.timeSegmentState);
    }

    private parseControl(control: HTMLInputElement): string {
        return control === this.control ? this.parseText(control.value) : this.parseTimeText(control.value);
    }

    private controlSegments(control: HTMLInputElement): ReturnType<typeof displaySegments> {
        if (control === this.control) {
            return displaySegments(control.value, this.type, this.locale, this.timeMode);
        }
        const prefix = `${formatDisplay(calendarDate(2000, 0, 1), 'date', this.locale, this.timeMode)} `;
        return displaySegments(prefix + control.value, 'datetime-local', this.locale, this.timeMode)
            .filter(range => range.start >= prefix.length)
            .map(range => ({ ...range, start: range.start - prefix.length, end: range.end - prefix.length }));
    }

    private commitControl(control: HTMLInputElement): void {
        const state = this.getSegmentState(control);
        if (this.disabled || this.readOnly || state.committedText === control.value) {
            return;
        }
        state.pending = false;
        state.input = undefined;
        this.validationAttempted = true;
        if (control === this.control) {
            const previous = this.value;
            this.handleTextInput(true);
            if (this.editingText === undefined) {
                this.editingTimeMode = undefined;
                this.updateMask();
            }
            if (previous !== this.value) {
                this.$emit('input');
            }
        } else if (this.timeField) {
            if (this.timeField.value !== this.timeText || !this.parseTimeText(this.timeField.value)) {
                this.updateTimeInput(this.timeField, true);
            }
            if (this.parseTimeText(this.timeField.value)) {
                this.timeText = undefined;
                this.editingTimeMode = undefined;
                this.updateMask();
            }
            control.value = this.timeField.value;
        }
        this.validate();
        state.committedText = control.value;
        this.$emit('change');
    }

    private updateConstraints(): void {
        if (this.proxy === undefined) {
            return;
        }
        this.proxy.type = this.type;
        this.proxy.min = this.min ?? '';
        this.proxy.max = this.max ?? '';
        this.proxy.step = this.step ?? '';
        this.proxy.readOnly = this.readOnly;
        this.proxy.defaultValue = this.initialValue;
        this.validate();
    }

    private updateMask(): void {
        if (!this.$fastController.isConnected || this.control === undefined) {
            return;
        }
        const key = `${this.type}:${this.locale}:${this.timeMode}`;
        if (key === this.maskKey) {
            return;
        }
        this.maskKey = key;
        this.mask?.destroy();
        const date = dateFormat(this.locale);
        const time = timeFormat(this.locale, this.timeMode);
        const options = this.type === 'date'
            ? maskitoDate(date)
            : maskitoDateTime({
                dateMode: date.mode,
                dateSeparator: date.separator,
                timeMode: time.mode,
                timeSeparators: time.separators,
                dayPeriod: time.dayPeriod,
                timeStep: 0,
                dateTimeSeparator: ' '
            });
        // Maskito's date normalizers construct local Dates, shifting DST-gap wall times.
        // Use its positional mask and leave civil-date validation to this field.
        this.mask = new Maskito(this.control, { mask: options.mask, overwriteMode: options.overwriteMode });
        this.control.value = this.displayValue;
        this.timeFieldChanged();
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FvDateTimePicker extends ARIAGlobalStatesAndProperties {}
applyMixins(FvDateTimePicker, ARIAGlobalStatesAndProperties);

const okFvDateTimePicker = FvDateTimePicker.compose({
    baseName: 'fv-date-time-picker',
    template,
    styles,
    shadowOptions: { delegatesFocus: true }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvDateTimePicker());
export const fvDateTimePickerTag = 'ok-fv-date-time-picker';
