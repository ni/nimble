// Based on: https://github.com/microsoft/fast/blob/%40microsoft/fast-foundation_v2.49.5/packages/web-components/fast-foundation/src/select/select.ts
import {
    attr,
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
    DelegatesARIASelect
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
import { DropdownAppearance, DropdownOwner } from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import { ListOption } from '../list-option';
import { FilterMode } from './types';
import { diacriticInsensitiveStringNormalizer } from '../utilities/models/string-normalizers';
import { FormAssociatedSelect } from './models/select-form-associated';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

// Used in overrides of base class methods
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type BooleanOrVoid = boolean | void;

const isNimbleListOption = (el: Element): el is ListOption => {
    return el instanceof ListOption;
};

/**
 * A nimble-styled HTML select.
 */
export class Select
    extends FormAssociatedSelect
    implements ErrorPattern, DropdownOwner {
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
     * @internal
     */
    @observable
    public displayPlaceholder = false;

    /**
     * @internal
     */
    @attr({ attribute: 'open', mode: 'boolean' })
    public open = false;

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
    public scrollableRegion!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public filterInput?: HTMLInputElement;

    /**
     * @internal
     */
    @observable
    public anchoredRegion!: AnchoredRegion;

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
    public committedSelectedOption?: ListboxOption;

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

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
        this.initializeOpenState();
    }

    public override get value(): string {
        Observable.track(this, 'value');
        return this._value;
    }

    public override set value(next: string) {
        const prev = this._value;
        let newValue = next;

        if (this.options?.length) {
            const newValueIndex = this.options.findIndex(
                el => el.value === newValue
            );
            const prevSelectedValue = this.options[this.selectedIndex]?.value ?? null;
            const nextSelectedValue = this.options[newValueIndex]?.value ?? null;

            if (
                newValueIndex === -1
                || prevSelectedValue !== nextSelectedValue
            ) {
                newValue = '';
                this.selectedIndex = newValueIndex;
            }

            newValue = this.firstSelectedOption?.value ?? newValue;
        }

        if (prev !== newValue && !(this.open && this.selectedIndex < 0)) {
            this._value = newValue;
            super.valueChanged(prev, newValue);
            if (!this.open) {
                this.committedSelectedOption = this.options.find(
                    o => o.value === newValue
                );
            }
            Observable.notify(this, 'value');
            if (this.collapsible) {
                Observable.notify(this, 'displayValue');
            }
        }
    }

    /**
     * @internal
     */
    @volatile
    public get displayValue(): string {
        Observable.track(this, 'displayValue');
        return this.committedSelectedOption?.text ?? '';
    }

    /**
     * @internal
     */
    public anchoredRegionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.anchoredRegion && this.control) {
            this.anchoredRegion.anchorElement = this.control;
        }
    }

    /**
     * @internal
     */
    public controlChanged(
        _prev: HTMLElement | undefined,
        _next: HTMLElement | undefined
    ): void {
        if (this.anchoredRegion && this.control) {
            this.anchoredRegion.anchorElement = this.control;
        }
    }

    /**
     * @internal
     */
    public override slottedOptionsChanged(
        prev: Element[],
        next: Element[]
    ): void {
        const value = this.value;
        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, 'value');
            notifier.unsubscribe(this, 'hidden');
            notifier.unsubscribe(this, 'disabled');
        });

        super.slottedOptionsChanged(prev, next);

        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.subscribe(this, 'value');
            notifier.subscribe(this, 'hidden');
            notifier.subscribe(this, 'disabled');
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

    /**
     * @internal
     */
    public override clickHandler(e: MouseEvent): BooleanOrVoid {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest<ListOption>(
                'option,[role=option]'
            );

            if (captured?.disabled) {
                return;
            }
        }

        super.clickHandler(e);

        this.open = this.collapsible && !this.open;

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
        // don't call super.handleChange so hidden options can be selected programmatically
        const sourceElement = source as Element;
        switch (propertyName) {
            case 'value': {
                this.updateValue();
                break;
            }
            case 'selected': {
                if (isNimbleListOption(sourceElement)) {
                    this.selectedIndex = this.options.indexOf(sourceElement);
                }
                this.setSelectedOptions();
                this.updateDisplayValue();
                break;
            }
            case 'hidden': {
                if (isNimbleListOption(sourceElement)) {
                    sourceElement.visuallyHidden = sourceElement.hidden;
                }
                this.updateDisplayValue();
                break;
            }
            case 'disabled': {
                this.updateDisplayValue();
                break;
            }
            default:
                break;
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
     * @internal
     */
    public regionLoadedHandler(): void {
        this.focusAndScrollOptionIntoView();
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

    /**
     * @internal
     */
    public inputClickHandler(e: MouseEvent): void {
        e.stopPropagation(); // clicking in filter input shouldn't close dropdown
    }

    /**
     * @internal
     */
    public changeValueHandler(): void {
        this.committedSelectedOption = this.options.find(
            option => option.selected
        );
    }

    /**
     * @internal
     */
    public updateDisplayValue(): void {
        if (
            this.committedSelectedOption?.disabled
            && this.committedSelectedOption?.hidden
            && this.committedSelectedOption?.selected
        ) {
            this.displayPlaceholder = true;
        } else {
            this.displayPlaceholder = false;
        }

        if (this.collapsible) {
            Observable.notify(this, 'displayValue');
        }
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this.filter = this.filterInput?.value ?? '';
        this.clearSelection();
        this.filterOptions();

        if (this.filteredOptions.length > 0) {
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

    /**
     * @internal
     */
    public override focusoutHandler(e: FocusEvent): BooleanOrVoid {
        super.focusoutHandler(e);
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
            if (this.selectedIndex === -1) {
                this.selectedIndex = this.indexWhenOpened!;
            }

            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
        return true;
    }

    /**
     * @internal
     */
    public override keydownHandler(e: KeyboardEvent): BooleanOrVoid {
        super.keydownHandler(e);
        const key = e.key;
        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case keySpace: {
                // when dropdown is open allow user to enter a space for filter text
                if (this.open && this.filterMode !== FilterMode.none) {
                    break;
                }

                e.preventDefault();
                if (this.collapsible && this.typeAheadExpired) {
                    this.open = !this.open;
                }
                if (!this.open) {
                    this.focus();
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
                this.open = !this.open;
                if (!this.open) {
                    this.focus();
                }
                break;
            }
            case keyEscape: {
                if (!this.open) {
                    break;
                }
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }

                if (this.selectedIndex !== this.indexWhenOpened!) {
                    this.options[this.selectedIndex]!.selected = false;
                    this.selectedIndex = this.indexWhenOpened!;
                }
                this.focus();
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
        _: number | undefined,
        __: number
    ): void {
        // Don't call super.selectedIndexChanged as this will disallow disabled options
        // from being valid initial selected values. Our setDefaultSelectedOption
        // implementation handles skipping non-selected disabled options for the initial
        // selected value.
        this.setSelectedOptions();
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

    public override selectNextOption(): void {
        // don't call super.selectNextOption as that relies on side-effecty
        // behavior to not select disabled option (which no longer works)
        for (let i = this.selectedIndex + 1; i < this.options.length; i++) {
            if (!this.options[i]?.disabled) {
                this.selectedIndex = i;
                break;
            }
        }
    }

    public override selectPreviousOption(): void {
        // don't call super.selectPreviousOption as that relies on side-effecty
        // behavior to not select disabled option (which no longer works)
        for (let i = this.selectedIndex - 1; i >= 0; i--) {
            if (!this.options[i]?.disabled) {
                this.selectedIndex = i;
                break;
            }
        }
    }

    /**
     * @internal
     */
    public registerOption(option: ListOption): void {
        if (this.options.includes(option)) {
            return;
        }

        this.options.push(option);
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

    protected override focusAndScrollOptionIntoView(): void {
        if (this.open) {
            super.focusAndScrollOptionIntoView();
            window.requestAnimationFrame(() => {
                this.filterInput?.focus();
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

            return;
        }

        this.filter = '';
        if (this.filterInput) {
            this.filterInput.value = '';
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
        _prev: ListboxOption[] | undefined,
        next: ListboxOption[]
    ): void {
        // don't call super.selectedOptionsChanged so we don't filter out hidden elements
        // when updating 'selected' state (copied relevant super implementation)
        this.options?.forEach((o, i) => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, 'selected');
            o.selected = next.includes(o);
            notifier.subscribe(this, 'selected');
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
            ?? Array.from(this.children).filter(o => isNimbleListOption(o));

        const optionIsSelected = (option: ListboxOption): boolean => {
            return option.hasAttribute('selected') || option.selected;
        };
        const optionIsDisabled = (option: ListboxOption): boolean => {
            return option.hasAttribute('disabled') || option.disabled;
        };
        let selectedIndex = -1;
        let firstValidOptionIndex = -1;
        for (let i = 0; i < options?.length; i++) {
            const option = options[i];
            if (optionIsSelected(option!) || option?.value === this.value) {
                selectedIndex = i;
            }
            if (firstValidOptionIndex === -1 && !optionIsDisabled(option!)) {
                firstValidOptionIndex = i;
            }
        }

        if (selectedIndex !== -1) {
            this.selectedIndex = selectedIndex;
        } else if (firstValidOptionIndex !== -1) {
            this.selectedIndex = firstValidOptionIndex;
        } else {
            this.selectedIndex = 0;
        }
        this.committedSelectedOption = options[this.selectedIndex];
    }

    private committedSelectedOptionChanged(): void {
        this.updateDisplayValue();
    }

    private setPositioning(): void {
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

    /**
     * Filter available options by text value.
     *
     * @public
     */
    private filterOptions(): void {
        const filter = this.filter.toLowerCase();

        if (filter) {
            this.filteredOptions = this.options.filter(option => {
                const normalizedFilter = diacriticInsensitiveStringNormalizer(filter);
                return (
                    !option.hidden
                    && diacriticInsensitiveStringNormalizer(option.text).includes(
                        normalizedFilter
                    )
                );
            });
        } else {
            this.filteredOptions = this.options.filter(
                option => !option.hidden
            );
        }

        this.options.forEach(o => {
            if (isNimbleListOption(o)) {
                if (!this.filteredOptions.includes(o)) {
                    o.visuallyHidden = true;
                } else {
                    o.visuallyHidden = false;
                }
            }
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

        this.committedSelectedOption = this.options[this.selectedIndex];
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
