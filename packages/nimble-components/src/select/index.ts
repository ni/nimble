// eslint-disable-next-line max-classes-per-file
import {
    attr,
    DOM,
    html,
    observable,
    Observable,
    volatile
} from '@microsoft/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    ListboxOption,
    SelectOptions,
    SelectPosition,
    applyMixins,
    StartEnd,
    DelegatesARIASelect,
    Listbox
} from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
    keySpace,
    keyTab,
    uniqueId
} from '@microsoft/fast-web-utilities';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { DropdownAppearance } from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import type { ListOption } from '../list-option';
import { FilterMode } from './types';
import { diacriticInsensitiveStringNormalizer } from '../utilities/models/string-normalizers';
import { FormAssociatedSelect } from './models/select-form-associated';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type BooleanOrVoid = boolean | void;

/**
 * A nimble-styled HTML select. The FAST Select implementation has largely been
 * forked into here, as there was enough divergence to merit severing the
 * relationship.
 */
export class Select extends FormAssociatedSelect implements ErrorPattern {
    /**
     * The open attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: open
     */
    @attr({ attribute: 'open', mode: 'boolean' })
    public open = false;

    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    /**
     * Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: 'position' })
    public positionAttribute?: SelectPosition;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText: string | undefined;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    @attr({ attribute: 'filter-mode' })
    public filterMode: FilterMode = FilterMode.none;

    /**
     * Holds the current state for the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position?: SelectPosition;

    /**
     * The ref to the internal `.control` element.
     *
     * @internal
     */
    @observable
    public control!: HTMLElement;

    /**
     * Reference to the internal listbox element.
     *
     * @internal
     */
    public listbox!: HTMLDivElement;

    /**
     * The unique id for the internal listbox element.
     *
     * @internal
     */
    public listboxId: string = uniqueId('listbox-');

    /**
     * @internal
     */
    @observable
    public scrollableElement!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public filterInputElement?: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public region?: AnchoredRegion;

    /** @internal */
    @observable
    public hasOverflow = false;

    /**
     * @internal
     */
    @observable
    public filteredOptions: ListboxOption[] = [];

    /**
     * @internal
     */
    @observable
    public filter = '';

    /**
     * @internal
     */
    @observable
    public scrollbarIsVisible = false;

    /**
     * @internal
     */
    @observable
    public committedSelectedOption: ListboxOption | undefined = undefined;

    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    @observable
    public maxHeight = 0;

    /**
     * The component is collapsible when in single-selection mode with no size attribute.
     *
     * @internal
     */
    @volatile
    public get collapsible(): boolean {
        return !(this.multiple || typeof this.size === 'number');
    }

    private _value = '';
    private forcedPosition = false;
    private indexWhenOpened?: number;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('change', this.changeValueHandler);
        this.addEventListener('contentchange', this.updateDisplayValue);
        this.forcedPosition = !!this.positionAttribute;
        this.initializeOpenState();
    }

    public override disconnectedCallback(): void {
        this.removeEventListener('change', this.changeValueHandler);
        this.removeEventListener('contentchange', this.updateDisplayValue);
        super.disconnectedCallback();
    }

    /**
     * The list of options. This mirrors FAST's override implementation for this
     * member for the Combobox to support a filtered list in the dropdown.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    public override get options(): ListboxOption[] {
        Observable.track(this, 'options');
        return this.filteredOptions?.length
            ? this.filteredOptions
            : (this._options as ListOption[]);
    }

    public override set options(value: ListboxOption[]) {
        this._options = value;
        Observable.notify(this, 'options');
    }

    // NOTE: This is a copy of the parent implementation. When providing an override
    //  for a property setter, you must also provide its corresponding getter.
    public override get value(): string {
        Observable.track(this, 'value');
        return this._value;
    }

    // This is copied directly from FAST's implemention of its Select component, with
    // one main difference: we use 'options' (the filtered set of options) vs '_options'.
    // This is needed because while the dropdown is open the current 'selectedIndex' (set
    // within this implementation) needs to be relative to the filtered options.
    public override set value(next: string) {
        const prev = `${this._value}`;
        let newValue = next;

        if (this.options?.length) {
            const selectedIndex = this.options.findIndex(
                el => el.value === newValue
            );
            const prevSelectedValue = this.options[this.selectedIndex]?.value ?? null;
            const nextSelectedValue = this.options[selectedIndex]?.value ?? null;

            if (
                selectedIndex === -1
                || prevSelectedValue !== nextSelectedValue
            ) {
                newValue = '';
                this.selectedIndex = selectedIndex;
            }

            newValue = this.firstSelectedOption?.value ?? newValue;
        }

        if (prev !== newValue && !(this.open && this.selectedIndex < 0)) {
            this._value = newValue;
            super.valueChanged(prev, newValue);
            if (!this.open) {
                this.committedSelectedOption = this._options.find(
                    o => o.value === newValue
                );
            }
            Observable.notify(this, 'value');
            if (this.collapsible) {
                Observable.notify(this, 'displayValue');
            }
        }
    }

    public get displayValue(): string {
        Observable.track(this, 'displayValue');
        return this.committedSelectedOption?.text ?? '';
    }

    public regionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.region && this.control) {
            this.region.anchorElement = this.control;
        }
    }

    public controlChanged(
        _prev: HTMLElement | undefined,
        _next: HTMLElement | undefined
    ): void {
        if (this.region && this.control) {
            this.region.anchorElement = this.control;
        }
    }

    public setPositioning(): void {
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

        this.maxHeight = this.position === SelectPosition.above
            ? Math.trunc(currentBox.top)
            : Math.trunc(availableBottom);
        this.updateListboxMaxHeightCssVariable();
    }

    public override slottedOptionsChanged(
        prev: Element[],
        next: Element[]
    ): void {
        const value = this.value;
        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, 'value');
        });

        super.slottedOptionsChanged(prev, next);

        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.subscribe(this, 'value');
        });
        this.setProxyOptions();
        this.updateValue();
        // We need to force an update to the filteredOptions observable
        // (by calling 'filterOptions()) so that the template correctly updates.
        this.filterOptions();
        if (value) {
            this.value = value;
        }
        this.committedSelectedOption = this.options[this.selectedIndex];
    }

    public override clickHandler(e: MouseEvent): BooleanOrVoid {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        const captured = (e.target as HTMLElement).closest<ListOption>(
            'option,[role=option]'
        );

        if (!captured?.disabled) {
            this.updateSelectedIndexFromFilteredSet();
        }
        if (this.open && captured && captured.disabled) {
            return;
        }

        super.clickHandler(e);

        this.open = this.collapsible && !this.open;

        if (this.open && this.filterMode !== FilterMode.none) {
            window.requestAnimationFrame(() => {
                this.filterInputElement?.focus();
            });
        }

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
        }
    }

    /**
     * Updates the value when an option's value changes.
     *
     * @param source - the source object
     * @param propertyName - the property to evaluate
     *
     * @internal
     * @override
     */
    public override handleChange(source: unknown, propertyName: string): void {
        super.handleChange(source, propertyName);
        if (propertyName === 'value') {
            this.updateValue();
        }
    }

    /**
     * Prevents focus when size is set and a scrollbar is clicked.
     *
     * @param e - the mouse event object
     *
     * @override
     * @internal
     */
    public override mousedownHandler(e: MouseEvent): BooleanOrVoid {
        if (e.offsetX >= 0 && e.offsetX <= this.listbox?.scrollWidth) {
            return super.mousedownHandler(e);
        }

        return this.collapsible;
    }

    /**
     * Sets the multiple property on the proxy element.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     */
    public override multipleChanged(
        prev: boolean | undefined,
        next: boolean
    ): void {
        super.multipleChanged(prev, next);

        if (this.proxy) {
            this.proxy.multiple = next;
        }
    }

    public inputClickHandler(e: MouseEvent): void {
        e.stopPropagation(); // clicking in filter input shouldn't close dropdown
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this.filter = this.filterInputElement?.value ?? '';
        if (!this.committedSelectedOption) {
            this.committedSelectedOption = this._options.find(
                option => option.selected
            );
        }
        this.clearSelection();
        this.filterOptions();

        if (
            this.filteredOptions.length > 0
            && this.committedSelectedOption
            && !this.filteredOptions.includes(this.committedSelectedOption)
        ) {
            const enabledOptions = this.filteredOptions.filter(
                o => !o.disabled
            );
            if (enabledOptions.length > 0) {
                enabledOptions[0]!.selected = true;
            } else {
                // only filtered option is disabled
                this.selectedOptions = [];
                this.selectedIndex = -1;
            }
        } else if (this.committedSelectedOption) {
            this.committedSelectedOption.selected = true;
        }

        if (e.inputType.includes('deleteContent') || !this.filter.length) {
            return true;
        }

        e.stopPropagation();
        return true;
    }

    public override focusoutHandler(e: FocusEvent): BooleanOrVoid {
        this.updateSelectedIndexFromFilteredSet();
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return true;
        }

        if (!this.options?.includes(focusTarget as ListboxOption)) {
            this.open = false;
            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
        super.focusoutHandler(e);
        return true;
    }

    public override keydownHandler(e: KeyboardEvent): BooleanOrVoid {
        super.keydownHandler(e);
        const key = e.key;
        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case keySpace: {
                e.preventDefault();
                if (this.filterMode === FilterMode.none) {
                    if (this.collapsible && this.typeAheadExpired) {
                        this.open = !this.open;
                    }
                }
                break;
            }
            case keyHome:
            case keyEnd: {
                e.preventDefault();
                break;
            }
            case keyEnter: {
                e.preventDefault();
                if (
                    this.filteredOptions.length === 0
                    || this.filteredOptions.every(o => o.disabled)
                ) {
                    return false;
                }
                this.updateSelectedIndexFromFilteredSet();
                this.open = !this.open;
                break;
            }
            case keyEscape: {
                // clear filter as update to "selectedIndex" will result in processing
                // "options" and not "_options"
                this.filter = '';
                if (this.committedSelectedOption) {
                    this.clearSelection();
                    this.selectedIndex = this._options.indexOf(
                        this.committedSelectedOption
                    );
                }
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                // reset 'selected' state otherwise the selected state doesn't stick.
                const selectedOption = this._options[this.selectedIndex];
                if (selectedOption) {
                    selectedOption.selected = true;
                }
                break;
            }
            case keyTab: {
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }

                return true;
            }

            default: {
                break;
            }
        }

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
            this.indexWhenOpened = this.selectedIndex;
        }

        return !(key === keyArrowDown || key === keyArrowUp);
    }

    /**
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    public override selectedIndexChanged(
        prev: number | undefined,
        next: number
    ): void {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }

    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @param prev - The previous disabled value
     * @param next - The next disabled value
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
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public override formResetCallback(): void {
        this.setProxyOptions();
        // Call the base class's implementation setDefaultSelectedOption instead of the select's
        // override, in order to reset the selectedIndex without using the value property.
        super.setDefaultSelectedOption();
        if (this.selectedIndex === -1) {
            this.selectedIndex = 0;
        }
    }

    // Prevents parent classes from resetting selectedIndex to a positive
    // value while filtering, which can result in a disabled option being
    // selected.
    protected override setSelectedOptions(): void {
        if (this.open && this.selectedIndex === -1) {
            return;
        }

        super.setSelectedOptions();
    }

    protected positionChanged(
        _: SelectPosition | undefined,
        next: SelectPosition | undefined
    ): void {
        this.positionAttribute = next;
        this.setPositioning();
    }

    /**
     * Updates the proxy's size property when the size attribute changes.
     *
     * @param prev - the previous size
     * @param next - the current size
     *
     * @override
     * @internal
     */
    protected override sizeChanged(
        prev: number | undefined,
        next: number
    ): void {
        super.sizeChanged(prev, next);

        if (this.proxy) {
            this.proxy.size = next;
        }
    }

    protected openChanged(): void {
        if (!this.collapsible) {
            return;
        }

        if (this.open) {
            this.initializeOpenState();
            this.indexWhenOpened = this.selectedIndex;
            if (this.filterMode === FilterMode.none) {
                DOM.queueUpdate(() => this.focus());
            }

            return;
        }

        this.filter = '';
        if (this.filterInputElement) {
            this.filterInputElement.value = '';
        }

        this.ariaControls = '';
        this.ariaExpanded = 'false';
    }

    /**
     * Updates the selectedness of each option when the list of selected options changes.
     *
     * @param prev - the previous list of selected options
     * @param next - the current list of selected options
     *
     * @override
     * @internal
     */
    protected override selectedOptionsChanged(
        prev: ListboxOption[] | undefined,
        next: ListboxOption[]
    ): void {
        super.selectedOptionsChanged(prev, next);
        this.options?.forEach((o, i) => {
            const proxyOption = this.proxy?.options.item(i);
            if (proxyOption) {
                proxyOption.selected = o.selected;
            }
        });
    }

    /**
     * Sets the selected index to match the first option with the selected attribute, or
     * the first selectable option.
     *
     * @override
     * @internal
     */
    protected override setDefaultSelectedOption(): void {
        const options: ListboxOption[] = this.options
            ?? Array.from(this.children).filter(o => Listbox.slottedOptionFilter(o as HTMLElement));

        const selectedIndex = options?.findIndex(
            el => el.hasAttribute('selected')
                || el.selected
                || el.value === this.value
        );

        if (selectedIndex !== -1) {
            this.selectedIndex = selectedIndex;
            return;
        }

        this.selectedIndex = 0;
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    private filterOptions(): void {
        const filter = this.filter.toLowerCase();

        if (filter) {
            this.filteredOptions = this._options.filter(option => {
                return diacriticInsensitiveStringNormalizer(
                    option.text
                ).includes(diacriticInsensitiveStringNormalizer(filter));
            });
        } else {
            this.filteredOptions = this._options;
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });
    }

    /**
     * Sets the value and display value to match the first selected option.
     *
     * @param shouldEmit - if true, the input and change events will be emitted
     *
     * @internal
     */
    private updateValue(shouldEmit?: boolean): void {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption?.value ?? '';
        }

        if (shouldEmit) {
            this.$emit('input');
            this.$emit('change', this, {
                bubbles: true,
                composed: undefined
            });
        }
    }

    /**
     * Resets and fills the proxy to match the component's options.
     *
     * @internal
     */
    private setProxyOptions(): void {
        if (this.proxy instanceof HTMLSelectElement && this.options) {
            this.proxy.options.length = 0;
            this.options.forEach(option => {
                const proxyOption = option.proxy
                    || (option instanceof HTMLOptionElement
                        ? option.cloneNode()
                        : null);

                if (proxyOption) {
                    this.proxy.options.add(proxyOption);
                }
            });
        }
    }

    private clearSelection(): void {
        this.options.forEach(option => {
            option.selected = false;
        });
    }

    private filterChanged(): void {
        this.filterOptions();
    }

    private maxHeightChanged(): void {
        this.updateListboxMaxHeightCssVariable();
    }

    private initializeOpenState(): void {
        if (!this.open) {
            this.ariaExpanded = 'false';
            this.ariaControls = '';
            return;
        }

        this.committedSelectedOption = this._options[this.selectedIndex];
        this.ariaControls = this.listboxId;
        this.ariaExpanded = 'true';

        this.setPositioning();
        this.focusAndScrollOptionIntoView();
    }

    private updateListboxMaxHeightCssVariable(): void {
        if (this.listbox) {
            this.listbox.style.setProperty(
                '--ni-private-select-max-height',
                `${this.maxHeight}px`
            );
        }
    }

    private updateSelectedIndexFromFilteredSet(): void {
        const selectedItem = this.filteredOptions.length > 0
            ? this.options[this.selectedIndex]
                  ?? this.committedSelectedOption
            : this.committedSelectedOption;

        if (!selectedItem) {
            return;
        }
        // Clear filter so any logic resolving against 'this.options' resolves against all options,
        // since selectedIndex should be relative to entire set.
        this.filter = '';
        // translate selectedIndex for filtered list to selectedIndex for all items
        this.selectedIndex = this._options.indexOf(selectedItem);
        // force selected to true again if the selection hasn't actually changed
        if (selectedItem === this.committedSelectedOption) {
            selectedItem.selected = true;
        }
    }

    private readonly changeValueHandler = (): void => {
        this.committedSelectedOption = this.options.find(
            option => option.selected
        );
    };

    private readonly updateDisplayValue = (): void => {
        if (this.collapsible) {
            Observable.notify(this, 'displayValue');
        }
    };
}

const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data,
    end: html<Select>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

applyMixins(Select, StartEnd, DelegatesARIASelect);
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
export const selectTag = 'nimble-select';
