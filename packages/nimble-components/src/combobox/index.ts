import {
    DOM,
    Observable,
    attr,
    html,
    observable,
    ref
} from '@microsoft/fast-element';
import {
    DesignSystem,
    ComboboxOptions,
    ComboboxAutocomplete,
    SelectPosition,
    ListboxOption,
    DelegatesARIACombobox,
    applyMixins,
    StartEnd
} from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnter,
    keyEscape,
    keySpace,
    keyTab,
    limit,
    uniqueId
} from '@microsoft/fast-web-utilities';
import { ToggleButton, toggleButtonTag } from '../toggle-button';
import { errorTextTemplate } from '../patterns/error/template';
import { iconArrowExpanderDownTag } from '../icons/arrow-expander-down';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

import { styles } from './styles';
import type { ErrorPattern } from '../patterns/error/types';
import {
    DropdownAppearance,
    type DropdownPattern
} from '../patterns/dropdown/types';
import type { AnchoredRegion } from '../anchored-region';
import { template } from './template';
import { FormAssociatedCombobox } from './models/combobox-form-associated';
import type { ListOption } from '../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-combobox': Combobox;
    }
}

/**
 * A nimble-styed HTML combobox
 */
export class Combobox
    extends FormAssociatedCombobox
    implements DropdownPattern, ErrorPattern {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /**
     * The autocomplete attribute.
     */
    @attr({ attribute: 'autocomplete', mode: 'fromView' })
    public autocomplete?: ComboboxAutocomplete;

    /**
     * The placement for the listbox when the combobox is open.
     */
    @attr({ attribute: 'position' })
    public positionAttribute?: SelectPosition;

    /**
     * The open attribute.
     */
    @attr({ attribute: 'open', mode: 'boolean' })
    public open = false;

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @remarks Using a non-null assertion to mimic FAST's original improper typing of an
     * uninitialized property:
     * https://github.com/microsoft/fast/blob/0c27d027ff6e8616ad4fddc17f4432aa7f6cbad0/packages/web-components/fast-foundation/src/combobox/combobox.ts#L199
     */
    @attr
    public placeholder!: string;

    /**
     * The current state of the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position?: SelectPosition;

    /**
     * @internal
     */
    @observable
    public region?: AnchoredRegion;

    /**
     * @internal
     */
    @observable
    public controlWrapper!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public control!: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public listbox!: HTMLDivElement;

    /**
     * @internal
     */
    @observable
    public readonly dropdownButton?: ToggleButton;

    /**
     * @internal
     *
     * The collection of currently filtered options.
     */
    @observable
    public filteredOptions: ListboxOption[] = [];

    /** @internal */
    @observable
    public hasOverflow = false;

    public override get value(): string {
        Observable.track(this, 'value');
        return this._value;
    }

    public override set value(next: string) {
        const prev = this._value;
        let updatedValue = next;

        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.findIndexOfValidOption(next);

            const prevSelectedValue = this.options[this.selectedIndex]?.text;
            const nextSelectedValue = this.options[selectedIndex]?.text;

            if (prevSelectedValue !== nextSelectedValue) {
                this.selectedIndex = selectedIndex;
            }

            updatedValue = this.firstSelectedOption?.text || updatedValue;
        }

        if (prev !== updatedValue) {
            this._value = updatedValue;
            super.valueChanged(prev, updatedValue);
            Observable.notify(this, 'value');
        }

        // Can remove when following resolved: https://github.com/microsoft/fast/issues/6749
        this.filter = next;
        this.filterOptions();
        this.selectedIndex = this.findIndexOfValidOption(this.value);
    }

    /**
     * The list of options.
     *
     * Overrides `Listbox.options`.
     */
    public override get options(): ListboxOption[] {
        Observable.track(this, 'options');
        return this.filteredOptions && this.filter
            ? this.filteredOptions
            : this._options;
    }

    public override set options(value: ListboxOption[]) {
        this._options = value;
        Observable.notify(this, 'options');
    }

    /**
     * The unique id for the internal listbox element.
     *
     * @internal
     */
    public listboxId: string = uniqueId('listbox-');

    /**
     * The space available in the viewport for the listbox when opened.
     *
     * @internal
     */
    @observable
    public availableViewportHeight = 0;

    private valueUpdatedByInput = false;
    private valueBeforeTextUpdate?: string;
    private _value = '';
    private filter = '';

    /**
     * The initial state of the position attribute.
     */
    private forcedPosition = false;

    private get isAutocompleteInline(): boolean {
        return (
            this.autocomplete === ComboboxAutocomplete.inline
            || this.isAutocompleteBoth
        );
    }

    private get isAutocompleteList(): boolean {
        return (
            this.autocomplete === ComboboxAutocomplete.list
            || this.isAutocompleteBoth
        );
    }

    private get isAutocompleteBoth(): boolean {
        return this.autocomplete === ComboboxAutocomplete.both;
    }

    public override slottedOptionsChanged(
        prev: HTMLElement[],
        next: HTMLElement[]
    ): void {
        // Workaround for https://github.com/microsoft/fast/issues/5773
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        this.updateValue();
        if (value) {
            this.value = value;
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
        if (this.value) {
            this.initialValue = this.value;
        }
        this.setPositioning();
        this.updateInputAriaLabel();
    }

    /**
     * @internal
     */
    public override clickHandler(e: MouseEvent): boolean {
        if (this.disabled) {
            return false;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest<ListOption>(
                'option,[role=option]'
            );

            if (!captured || captured.disabled) {
                return false;
            }

            this.selectedOptions = [captured];
            this.control.value = captured.text;
            this.clearSelectionRange();
            this.updateValue(true);
        }

        this.open = !this.open;

        if (this.open) {
            this.control.focus();
        }

        return true;
    }

    /**
     * @internal
     */
    public toggleButtonClickHandler(e: Event): void {
        e.stopImmediatePropagation();
    }

    /**
     * @internal
     */
    public toggleButtonChangeHandler(e: Event): void {
        this.open = this.dropdownButton!.checked;
        e.stopImmediatePropagation();
    }

    /**
     * @internal
     */
    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyArrowUp:
            case keyArrowDown:
            case keySpace:
            case keyEnter:
                this.open = true;
                this.stopPropagation(e);
                return false;
            default:
                return true;
        }
    }

    /**
     * @internal
     */
    public filterOptions(): void {
        if (
            !this.autocomplete
            || this.autocomplete === ComboboxAutocomplete.none
        ) {
            this.filter = '';
        }

        const filter = this.filter.toLowerCase();

        this.filteredOptions = this._options.filter(
            o => o.text.toLowerCase().startsWith(filter) && !o.hidden
        );

        if (this.isAutocompleteList) {
            this._options.forEach(o => {
                (o as ListOption).visuallyHidden = !this.filteredOptions.includes(o);
            });
        }

        const enabledOptions = this.filteredOptions.filter(o => !o.disabled);
        this.filteredOptions = enabledOptions;
    }

    /**
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this.filter = this.control.value;
        this.filterOptions();

        if (!this.isAutocompleteInline) {
            this.selectedIndex = this.findIndexOfValidOption(
                this.control.value
            );
        }

        if (!e.inputType.includes('deleteContent') && this.filter.length) {
            if (this.isAutocompleteList && !this.open) {
                this.open = true;
            }

            if (this.isAutocompleteInline) {
                if (this.filteredOptions.length) {
                    this.selectedOptions = [this.filteredOptions[0]!];
                    this.selectedIndex = this.options.indexOf(
                        this.firstSelectedOption
                    );
                    this.setInlineSelection();
                } else {
                    this.selectedIndex = -1;
                }
            }
        }

        // This is a workaround for the issue described here: https://github.com/microsoft/fast/issues/6267
        // For now, we will update the value ourselves while a user types in text. Note that there is other
        // implementation related to this (like the 'keydownEventHandler') needed to create the complete set
        // of desired behavior described in the issue noted above.
        if (!this.valueUpdatedByInput) {
            this.valueBeforeTextUpdate = this.value;
        }
        this.valueUpdatedByInput = true;

        // This is a workaround for this FAST issue: https://github.com/microsoft/fast/issues/6776
        if (this.value !== this.control.value) {
            this.focusAndScrollOptionIntoView();
        }

        this.value = this.control.value;
        return true;
    }

    public override keydownHandler(e: KeyboardEvent): boolean {
        if (e.ctrlKey || e.altKey) {
            return true;
        }

        switch (e.key) {
            case keyEnter:
                this.syncValue();
                if (this.isAutocompleteInline) {
                    this.filter = this.value;
                }

                this.open = false;
                this.clearSelectionRange();
                this.emitChangeIfValueUpdated();
                break;
            case keyEscape:
                if (!this.isAutocompleteInline) {
                    this.selectedIndex = -1;
                }

                if (this.open) {
                    this.open = false;
                    break;
                }

                this.value = '';
                this.control.value = '';
                this.filter = '';
                this.filterOptions();
                break;
            case keyTab:
                this.setInputToSelection();

                if (!this.open) {
                    return true;
                }

                e.preventDefault();
                this.open = false;
                break;
            case keyArrowDown:
            case keyArrowUp:
                this.filterOptions();

                if (!this.open) {
                    this.open = true;
                    break;
                }

                if (this.filteredOptions.length > 0) {
                    super.keydownHandler(e);
                }

                if (this.isAutocompleteInline) {
                    this.setInlineSelection();
                }

                if (this.open && this.valueUpdatedByInput) {
                    this.valueUpdatedByInput = false;
                }
                break;
            default:
                return true;
        }
        return true;
    }

    /**
     * @internal
     */
    public keyupHandler(e: KeyboardEvent): boolean {
        const key = e.key;

        switch (key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'Backspace':
            case 'Delete':
            case 'Home':
            case 'End': {
                this.filter = this.control.value;
                this.selectedIndex = -1;
                this.filterOptions();
                break;
            }
            default: {
                break;
            }
        }

        return true;
    }

    /**
     * @internal
     */
    public override focusoutHandler(e: FocusEvent): boolean {
        this.syncValue();

        if (this.open) {
            const focusTarget = e.relatedTarget as HTMLElement;
            if (this.isSameNode(focusTarget)) {
                this.focus();
            }
        }

        this.open = false;
        this.emitChangeIfValueUpdated();
        return true;
    }

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public override formResetCallback(): void {
        super.formResetCallback();
        this.setDefaultSelectedOption();
        this.updateValue();
    }

    /** {@inheritDoc (FormAssociated:interface).validate} */
    public override validate(): void {
        super.validate(this.control);
    }

    /**
     * Set the default selected options at initialization or reset.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.setDefaultSelectedOption`
     */
    public override setDefaultSelectedOption(): void {
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.findIndexOfValidOption(
                el => el.getAttribute('selected') !== null || el.selected
            );

            this.selectedIndex = selectedIndex;
            if (!this.dirtyValue && this.firstSelectedOption) {
                this.value = this.firstSelectedOption.text;
            }
            this.setSelectedOptions();
        }
    }

    /**
     * @internal
     */
    public override selectedIndexChanged(
        prev: number | undefined,
        next: number
    ): void {
        if (this.$fastController.isConnected) {
            let pinnedSelectedIndex = limit(-1, this.options.length - 1, next);
            // Ensure selectedIndex doesn't get set to a disabled option
            if (this.options[pinnedSelectedIndex]?.disabled) {
                pinnedSelectedIndex = -1;
            }

            // we only want to call the super method when the selectedIndex is in range
            if (pinnedSelectedIndex !== this.selectedIndex) {
                this.selectedIndex = pinnedSelectedIndex;
                return;
            }

            super.selectedIndexChanged(prev, pinnedSelectedIndex);
            // the base class doesn't call this when no option is selected, but we need to,
            // otherwise selectedOptions, ariaActiveDescendant, and the previously selected
            // option's selected state won't be updated
            this.setSelectedOptions();
        }
    }

    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @internal
     */
    public override disabledChanged(prev: boolean, next: boolean): void {
        if (super.disabledChanged) {
            super.disabledChanged(prev, next);
        }
        this.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    /**
     * Move focus to the previous selectable option.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.selectPreviousOption`
     */
    public override selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex >= 0) {
            this.selectedIndex -= 1;
        }
    }

    /**
     * @internal
     */
    public setPositioning(): void {
        // Workaround for https://github.com/microsoft/fast/issues/5123
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        const currentBox = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableBottom = viewportHeight - currentBox.bottom;

        if (this.forcedPosition) {
            this.position = this.positionAttribute;
        } else if (currentBox.top > availableBottom) {
            this.position = SelectPosition.above;
        } else {
            this.position = SelectPosition.below;
        }

        this.positionAttribute = this.forcedPosition
            ? this.positionAttribute
            : this.position;

        this.availableViewportHeight = this.position === SelectPosition.above
            ? Math.trunc(currentBox.top)
            : Math.trunc(availableBottom);
    }

    /**
     * Focus the control and scroll the first selected option into view.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.focusAndScrollOptionIntoView`
     */
    protected override focusAndScrollOptionIntoView(): void {
        if (this.open) {
            if (this.contains(document.activeElement)) {
                this.control.focus();
                if (this.firstSelectedOption) {
                    requestAnimationFrame(() => {
                        this.firstSelectedOption?.scrollIntoView({
                            block: 'nearest'
                        });
                    });
                }
            }
        }
    }

    protected openChanged(): void {
        if (this.open) {
            this.ariaControls = this.listboxId;
            this.ariaExpanded = 'true';

            this.setPositioning();
            this.focusAndScrollOptionIntoView();

            // focus is directed to the element when `open` is changed programmatically
            DOM.queueUpdate(() => this.focus());
        } else {
            this.ariaControls = '';
            this.ariaExpanded = 'false';
        }

        if (this.dropdownButton) {
            this.dropdownButton.checked = this.open;
        }
    }

    protected placeholderChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.placeholder = this.placeholder ?? '';
        }
    }

    /**
     * Need to update even when options is empty.
     * @internal
     * @remarks Same as `Listbox.setSelectedOptions` except does not check if options is non-empty.
     * Overrides: `Listbox.setSelectedOptions`
     */
    protected override setSelectedOptions(): void {
        this.selectedOptions = this.selectedIndex > -1 ? [this.options[this.selectedIndex]!] : [];
        this.ariaActiveDescendant = this.firstSelectedOption?.id ?? '';
        this.focusAndScrollOptionIntoView();
    }

    /**
     * Ensure that the entire list of options is used when setting the selected property.
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedOptionsChanged`
     */
    protected override selectedOptionsChanged(
        _: ListboxOption[] | undefined,
        next: ListboxOption[]
    ): void {
        if (this.$fastController.isConnected) {
            this._options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }

    protected positionChanged(
        _: SelectPosition | undefined,
        next: SelectPosition | undefined
    ): void {
        this.positionAttribute = next;
        this.setPositioning();
    }

    private regionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.region && this.controlWrapper) {
            this.region.anchorElement = this.controlWrapper;
        }
    }

    private controlWrapperChanged(
        _prev: HTMLElement | undefined,
        _next: HTMLElement | undefined
    ): void {
        if (this.region && this.controlWrapper) {
            this.region.anchorElement = this.controlWrapper;
        }
    }

    // Workaround for https://github.com/microsoft/fast/issues/6041.
    private ariaLabelChanged(_oldValue: string, _newValue: string): void {
        this.updateInputAriaLabel();
    }

    /**
     * Sets the value and to match the first selected option.
     */
    private updateValue(shouldEmit?: boolean): void {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption?.text || this.control.value;
            this.control.value = this.value;
        }

        if (shouldEmit) {
            this.$emit('change');
        }
    }

    /**
     * Focus and set the content of the control based on the first selected option.
     */
    private setInputToSelection(): void {
        if (this.firstSelectedOption) {
            this.control.value = this.firstSelectedOption.text;
            this.control.focus();
        }
    }

    /**
     * Focus, set and select the content of the control based on the first selected option.
     */
    private setInlineSelection(): void {
        if (this.firstSelectedOption) {
            this.setInputToSelection();
            this.control.setSelectionRange(
                this.filter.length,
                this.control.value.length,
                'backward'
            );
        }
    }

    private clearSelectionRange(): void {
        const controlValueLength = this.control.value.length;
        this.control.setSelectionRange(controlValueLength, controlValueLength);
    }

    /**
     * Determines if a value update should involve emitting a change event, then updates the value.
     */
    private syncValue(): void {
        const newValue = this.selectedIndex > -1
            ? this.firstSelectedOption?.text
            : this.control.value;
        this.updateValue(this.value !== newValue);
    }

    private updateInputAriaLabel(): void {
        const inputElement = this.shadowRoot?.querySelector('.selected-value');
        if (this.ariaLabel) {
            inputElement?.setAttribute('aria-label', this.ariaLabel);
        } else {
            inputElement?.removeAttribute('aria-label');
        }
    }

    /**
     * This will only emit a `change` event after text entry where the text in the input prior to
     * typing is different than the text present upon an attempt to commit (e.g. pressing <Enter>).
     * So, for a concrete example:
     * 1) User types 'Sue' (when Combobox input was blank).
     * 2) User presses <Enter> -> 'change' event fires
     * 3) User deletes 'Sue'
     * 4) User re-types 'Sue'
     * 5) User presses <Enter> -> NO 'change' event is fired
     */
    private emitChangeIfValueUpdated(): void {
        if (this.valueUpdatedByInput) {
            if (this.value !== this.valueBeforeTextUpdate) {
                this.$emit('change');
            }

            this.valueUpdatedByInput = false;
        }
    }

    private findIndexOfValidOption(
        optionTextOrPredicate: string | ((o: ListboxOption) => boolean)
    ): number {
        const predicate = typeof optionTextOrPredicate === 'string'
            ? (o: ListboxOption) => !o.disabled
                      && o.text.toLowerCase()
                          === optionTextOrPredicate.toLowerCase()
            : (o: ListboxOption) => !o.disabled && optionTextOrPredicate(o);
        return this.options.findIndex(predicate);
    }
}

const nimbleCombobox = Combobox.compose<ComboboxOptions>({
    baseName: 'combobox',
    baseClass: FormAssociatedCombobox,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: html<Combobox>`
        <div class="end-slot-container">
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon"
            ></${iconExclamationMarkTag}>
            <div class="separator"></div>
            <${toggleButtonTag}
                ${ref('dropdownButton')}
                appearance="ghost"
                ?checked="${x => x.open}"
                ?disabled="${x => x.disabled}"
                content-hidden="true"
                @click="${(x, c) => x.toggleButtonClickHandler(c.event)}"
                @change="${(x, c) => x.toggleButtonChangeHandler(c.event)}"
                @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
                class="dropdown-button"
                part="button"
                aria-haspopup="true"
                aria-expanded="${x => x.open}"
                tabindex="-1"
            >
                <${iconArrowExpanderDownTag}
                    slot="start"
                    class="dropdown-icon"
                >
                </${iconArrowExpanderDownTag}>
            </${toggleButtonTag}>
        </div>
        ${errorTextTemplate}
    `
});

export interface Combobox extends StartEnd, DelegatesARIACombobox {}
applyMixins(Combobox, StartEnd, DelegatesARIACombobox);

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCombobox());
export const comboboxTag = 'nimble-combobox';
