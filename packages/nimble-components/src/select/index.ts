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
    findLastIndex,
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
    keySpace,
    uniqueId
} from '@microsoft/fast-web-utilities';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import {
    DropdownAppearance,
    ListOptionOwner
} from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { isListOption, isListOptionGroup, template } from './template';
import type { ListOption } from '../list-option';
import { FilterMode, SelectFilterInputEventDetail } from './types';
import { diacriticInsensitiveStringNormalizer } from '../utilities/models/string-normalizers';
import { FormAssociatedSelect } from './models/select-form-associated';
import type { ListOptionGroup } from '../list-option-group';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

// Used in overrides of base class methods
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type BooleanOrVoid = boolean | void;

const isOptionSelectable = (el: ListOption): boolean => {
    return !el.visuallyHidden && !el.disabled && !el.hidden;
};

const isOptionPlaceholder = (el: ListboxOption): boolean => {
    return el.disabled && el.hidden;
};

const isOptionOrGroupVisible = (el: ListOption | ListOptionGroup): boolean => {
    return !el.visuallyHidden && !el.hidden;
};

/**
 * A nimble-styled HTML select.
 */
export class Select
    extends FormAssociatedSelect
    implements ErrorPattern, ListOptionOwner {
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

    @attr({ attribute: 'clearable', mode: 'boolean' })
    public clearable = false;

    @attr({ attribute: 'loading-visible', mode: 'boolean' })
    public loadingVisible = false;

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
     * The space available in the viewport for the listbox when opened.
     *
     * @internal
     */
    @observable
    public availableViewportHeight = 0;

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
    private openActiveIndex?: number;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
        if (this.open) {
            this.initializeOpenState();
        }
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

        if (prev !== newValue) {
            this._value = newValue;
            super.valueChanged(prev, newValue);
            Observable.notify(this, 'value');
            this.updateDisplayValue();
        }
    }

    /**
     * @internal
     */
    @volatile
    public get displayValue(): string {
        Observable.track(this, 'displayValue');
        return this.firstSelectedOption?.text ?? '';
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
        prev: Element[] | undefined,
        next: Element[] | undefined
    ): void {
        const value = this.value;
        this.options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, 'value');
            notifier.unsubscribe(this, 'hidden');
            notifier.unsubscribe(this, 'disabled');
        });

        prev?.filter<ListOptionGroup>(isListOptionGroup).forEach(el => {
            const notifier = Observable.getNotifier(el);
            notifier.unsubscribe(this, 'hidden');
            notifier.unsubscribe(this, 'visuallyHidden');
            notifier.unsubscribe(this, 'listOptions');
        });
        const options = this.getSlottedOptions(next);
        super.slottedOptionsChanged(prev, options);

        options.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.subscribe(this, 'value');
            notifier.subscribe(this, 'hidden');
            notifier.subscribe(this, 'disabled');
        });
        next?.filter<ListOptionGroup>(isListOptionGroup).forEach(el => {
            this.updateAdjacentSeparatorState(el);
            const notifier = Observable.getNotifier(el);
            notifier.subscribe(this, 'hidden');
            notifier.subscribe(this, 'visuallyHidden');
            notifier.subscribe(this, 'listOptions');
        });
        this.setProxyOptions();
        this.updateValue();
        // We need to force an update to the filteredOptions observable
        // (by calling 'filterOptions()) so that the template correctly updates.
        this.filterOptions();
        if (value) {
            this.value = value;
        }
    }

    /**
     * @internal
     */
    public override clickHandler(e: MouseEvent): BooleanOrVoid {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        let optionClicked = false;
        if (this.open) {
            const captured = (e.target as HTMLElement).closest<ListOption>(
                'option,[role=option]'
            );
            optionClicked = captured !== null;

            if (captured?.disabled) {
                return;
            }
        }

        const previousSelectedIndex = this.selectedIndex;
        super.clickHandler(e);

        if (
            this.open
            && this.selectedIndex !== previousSelectedIndex
            && optionClicked
        ) {
            this.updateValue(true);
        }
        this.open = this.collapsible && !this.open;
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
                if (isListOption(sourceElement) && sourceElement.selected) {
                    this.selectedIndex = this.options.indexOf(sourceElement);
                } else {
                    this.clearSelect();
                }
                break;
            }
            case 'hidden': {
                if (isListOption(sourceElement)) {
                    sourceElement.visuallyHidden = sourceElement.hidden;
                    this.updateAdjacentSeparatorState(sourceElement);
                } else if (isListOptionGroup(sourceElement)) {
                    sourceElement.listOptions.forEach(e => {
                        e.visuallyHidden = sourceElement.hidden;
                    });
                    this.updateAdjacentSeparatorState(sourceElement);
                }
                this.filterOptions();
                this.updateDisplayValue();
                break;
            }
            case 'visuallyHidden': {
                if (
                    isListOptionGroup(sourceElement)
                    || isListOption(sourceElement)
                ) {
                    this.updateAdjacentSeparatorState(sourceElement);
                }
                break;
            }
            case 'disabled': {
                this.updateDisplayValue();
                break;
            }
            case 'listOptions': {
                // force refresh of slotted options for groups
                this.slottedOptionsChanged(
                    this.slottedOptions,
                    this.slottedOptions
                );
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
    public ignoreClickHandler(e: MouseEvent): void {
        e.stopPropagation();
    }

    /**
     * @internal
     */
    public clearClickHandler(e: MouseEvent): void {
        this.open = false;
        this.clearSelect();
        this.updateValue(true);
        e.stopPropagation();
    }

    /**
     * @internal
     */
    public updateDisplayValue(): void {
        const placeholderOption = this.getPlaceholderOption();
        if (
            placeholderOption
            && this.firstSelectedOption === placeholderOption
        ) {
            this.displayPlaceholder = true;
        } else {
            this.displayPlaceholder = false;
        }

        Observable.notify(this, 'displayValue');
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this.filter = this.filterInput?.value ?? '';
        if (this.filterMode === FilterMode.standard) {
            this.filterOptions();

            const enabledOptions = this.filteredOptions.filter(
                o => !o.disabled
            );
            let activeOptionIndex = this.filter !== ''
                ? this.openActiveIndex ?? this.selectedIndex
                : this.selectedIndex;

            if (
                enabledOptions.length > 0
                && !enabledOptions.find(o => o === this.options[activeOptionIndex])
            ) {
                activeOptionIndex = this.options.indexOf(enabledOptions[0]!);
            } else if (enabledOptions.length === 0) {
                activeOptionIndex = -1;
            }
            this.setActiveOption(activeOptionIndex);
        }

        if (this.filterMode !== FilterMode.none) {
            this.emitFilterInputEvent();
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

        this.open = false;
        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return true;
        }

        return true;
    }

    /**
     * @internal
     */
    public override keydownHandler(e: KeyboardEvent): BooleanOrVoid {
        const initialSelectedIndex = this.selectedIndex;
        super.keydownHandler(e);
        const key = e.key;
        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        let currentActiveIndex = this.openActiveIndex ?? this.selectedIndex;
        let commitValueThenClose = false;
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
                if (this.open) {
                    commitValueThenClose = true;
                } else {
                    this.open = true;
                }

                if (commitValueThenClose) {
                    this.focus();
                }
                break;
            }
            case keyEscape: {
                if (!this.open) {
                    if (this.clearable) {
                        this.clearSelect();
                        this.updateValue(true);
                        return true;
                    }

                    break;
                }

                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }

                currentActiveIndex = this.selectedIndex;
                this.focus();
                break;
            }

            default: {
                break;
            }
        }

        if (!this.open || commitValueThenClose) {
            if (this.selectedIndex !== currentActiveIndex) {
                this.selectedIndex = currentActiveIndex;
            }

            if (initialSelectedIndex !== this.selectedIndex) {
                this.updateValue(true);
            }
        }

        if (commitValueThenClose) {
            this.open = false;
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
        if (this.open) {
            this.setActiveOption(this.selectedIndex);
        }
        this.updateValue();
    }

    /**
     * @internal
     * Fork of Listbox implementation, so that the selectedIndex is not changed while the dropdown
     * is open.
     */
    public override typeaheadBufferChanged(_: string, __: string): void {
        if (this.$fastController.isConnected) {
            const typeaheadMatches = this.getTypeaheadMatches();

            if (typeaheadMatches.length) {
                const activeOptionIndex = this.options.indexOf(
                    typeaheadMatches[0] as ListOption
                );
                if (!(this.open && this.filterMode !== FilterMode.none)) {
                    this.setActiveOption(activeOptionIndex);
                }
            }

            this.typeaheadExpired = false;
        }
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

    /**
     * @internal
     */
    public override selectNextOption(): void {
        // don't call super.selectNextOption as that relies on side-effecty
        // behavior to not select disabled option (which no longer works)
        const startIndex = this.openActiveIndex ?? this.selectedIndex;
        for (let i = startIndex + 1; i < this.options.length; i++) {
            const listOption = this.options[i]!;
            if (isListOption(listOption) && isOptionSelectable(listOption)) {
                this.setActiveOption(i);
                break;
            }
        }
    }

    /**
     * @internal
     */
    public override selectPreviousOption(): void {
        // don't call super.selectPreviousOption as that relies on side-effecty
        // behavior to not select disabled option (which no longer works)
        const startIndex = this.openActiveIndex ?? this.selectedIndex;
        for (let i = startIndex - 1; i >= 0; i--) {
            const listOption = this.options[i]!;
            if (isListOption(listOption) && isOptionSelectable(listOption)) {
                this.setActiveOption(i);
                break;
            }
        }
    }

    /**
     * @internal
     */
    public override selectFirstOption(): void {
        const newActiveOptionIndex = this.options.findIndex(
            o => isListOption(o) && isOptionSelectable(o)
        );
        this.setActiveOption(newActiveOptionIndex);
    }

    /**
     * @internal
     */
    public override selectLastOption(): void {
        const newActiveOptionIndex = findLastIndex(
            this.options,
            o => isListOption(o) && isOptionSelectable(o)
        );
        this.setActiveOption(newActiveOptionIndex);
    }

    /**
     * @internal
     */
    public registerOption(option: ListOption): void {
        if (this.options.includes(option)) {
            return;
        }

        // Adding an option to the end, ultimately, isn't the correct
        // thing to do, as this will mean the option's index in the options,
        // at least temporarily, does not match the DOM order. However, it
        // is expected that a successive run of `slottedOptionsChanged` will
        // correct this order issue. See 'https://github.com/ni/nimble/issues/1915'
        // for more info.
        this.options.push(option);
    }

    protected override setSelectedOptions(): void {
        // Prevents parent classes from resetting selectedIndex to a positive
        // value while filtering, which can result in a disabled option being
        // selected.
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

    protected override getTypeaheadMatches(): ListboxOption[] {
        const matches = super.getTypeaheadMatches();
        // Don't allow placeholder to be matched
        return matches.filter(o => !o.hidden && !o.disabled);
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
            return;
        }

        const activeOption = this.options[this.openActiveIndex ?? this.selectedIndex];
        if (isListOption(activeOption)) {
            activeOption.activeOption = false;
        }
        this.openActiveIndex = undefined;
        this.filter = '';
        if (this.filterInput) {
            this.filterInput.value = '';
        }

        if (this.filterMode !== FilterMode.none) {
            this.emitFilterInputEvent();
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
            ?? Array.from(this.children).filter(o => isListOption(o));

        const optionIsSelected = (option: ListboxOption): boolean => {
            return option.hasAttribute('selected') || option.selected;
        };
        let selectedIndex = -1;
        let firstValidOptionIndex = -1;
        let placeholderIndex = -1;
        for (let i = 0; i < options?.length; i++) {
            const option = options[i]!;
            if (optionIsSelected(option) || option.value === this.value) {
                selectedIndex = i;
                break;
            } else if (placeholderIndex === -1 && isOptionPlaceholder(option)) {
                placeholderIndex = i;
            } else if (
                firstValidOptionIndex === -1
                && isOptionSelectable(option as ListOption)
            ) {
                firstValidOptionIndex = i;
            }
        }

        if (selectedIndex !== -1) {
            this.selectedIndex = selectedIndex;
        } else if (placeholderIndex !== -1) {
            this.selectedIndex = placeholderIndex;
        } else if (firstValidOptionIndex !== -1) {
            this.selectedIndex = firstValidOptionIndex;
        } else {
            this.selectedIndex = 0;
        }
    }

    private getSlottedOptions(
        slottedElements: Element[] | undefined
    ): ListboxOption[] {
        const options: ListOption[] = [];
        slottedElements?.forEach(el => {
            if (isListOption(el)) {
                options.push(el);
            } else if (isListOptionGroup(el)) {
                options.push(...this.getGroupOptions(el));
            }
        });

        return options;
    }

    private setActiveOption(newActiveIndex: number): void {
        const activeOption = this.options[newActiveIndex];
        if (this.open) {
            if (isListOption(activeOption)) {
                activeOption.activeOption = true;
            }

            const previousActiveIndex = this.openActiveIndex ?? this.selectedIndex;
            const previousActiveOption = this.options[previousActiveIndex];
            if (
                previousActiveIndex !== newActiveIndex
                && isListOption(previousActiveOption)
            ) {
                previousActiveOption.activeOption = false;
            }

            this.openActiveIndex = newActiveIndex;
            this.focusAndScrollActiveOptionIntoView();
        } else {
            this.selectedIndex = newActiveIndex;
        }

        this.ariaActiveDescendant = activeOption?.id ?? '';
    }

    private focusAndScrollActiveOptionIntoView(): void {
        const optionToFocus = this.options[this.openActiveIndex ?? this.selectedIndex];
        // Copied from FAST: To ensure that the browser handles both `focus()` and
        // `scrollIntoView()`, the timing here needs to guarantee that they happen on
        // different frames. Since this function is typically called from the `openChanged`
        // observer, `DOM.queueUpdate` causes the calls to be grouped into the same frame.
        // To prevent this, `requestAnimationFrame` is used instead of `DOM.queueUpdate`.
        if (optionToFocus !== undefined && this.contains(optionToFocus)) {
            optionToFocus.focus();
            requestAnimationFrame(() => {
                optionToFocus.scrollIntoView({ block: 'nearest' });
            });
        }
    }

    private getPlaceholderOption(): ListOption | undefined {
        return this.options.find(o => o.hidden && o.disabled) as ListOption;
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

        this.availableViewportHeight = this.position === SelectPosition.above
            ? Math.trunc(currentBox.top)
            : Math.trunc(availableBottom);
    }

    private updateAdjacentSeparatorState(
        element: ListOptionGroup | ListOption
    ): void {
        const previousElement = this.getPreviousVisibleOptionOrGroup(element);
        const nextElement = this.getNextVisibleOptionOrGroup(element);

        if (isOptionOrGroupVisible(element)) {
            const topSeparatorVisible = isListOption(previousElement);
            this.setTopSeparatorState(element, topSeparatorVisible);
            const bottomSeparatorVisible = nextElement !== null;
            this.setBottomSeparatorState(element, bottomSeparatorVisible);
            this.setBottomSeparatorState(previousElement, true);
        } else {
            const nextTopSeparatorVisible = isListOption(previousElement);
            this.setTopSeparatorState(nextElement, nextTopSeparatorVisible);
            const previousBottomSeparatorVisible = nextElement !== null;
            this.setBottomSeparatorState(
                previousElement,
                previousBottomSeparatorVisible
            );
        }
    }

    private setTopSeparatorState(
        element: ListOptionGroup | ListOption | null,
        visible: boolean
    ): void {
        if (isListOptionGroup(element)) {
            element.topSeparatorVisible = visible;
        }
    }

    private setBottomSeparatorState(
        element: ListOptionGroup | ListOption | null,
        visible: boolean
    ): void {
        if (isListOptionGroup(element)) {
            element.bottomSeparatorVisible = visible;
        }
    }

    private getPreviousVisibleOptionOrGroup(
        element: HTMLElement
    ): ListOption | ListOptionGroup | null {
        let previousElement = element.previousElementSibling;
        while (previousElement) {
            if (
                (isListOption(previousElement)
                    || isListOptionGroup(previousElement))
                && isOptionOrGroupVisible(previousElement)
            ) {
                return previousElement;
            }
            previousElement = previousElement.previousElementSibling;
        }
        return null;
    }

    private getNextVisibleOptionOrGroup(
        element: HTMLElement
    ): ListOption | ListOptionGroup | null {
        let nextElement = element.nextElementSibling;
        while (nextElement) {
            if (
                (isListOption(nextElement) || isListOptionGroup(nextElement))
                && isOptionOrGroupVisible(nextElement)
            ) {
                return nextElement;
            }
            nextElement = nextElement.nextElementSibling;
        }
        return null;
    }

    private isOptionHiddenOrFilteredOut(option: ListOption): boolean {
        if (option.hidden) {
            return true;
        }
        return this.filterMode === FilterMode.standard
            ? !this.filterMatchesText(option.text)
            : false;
    }

    private filterMatchesText(text: string): boolean {
        const filter = this.filter.toLowerCase();
        const normalizedFilter = diacriticInsensitiveStringNormalizer(filter);
        return diacriticInsensitiveStringNormalizer(text).includes(
            normalizedFilter
        );
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    private filterOptions(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        const filteredOptions: ListOption[] = [];
        for (const element of this.slottedOptions) {
            if (isListOptionGroup(element)) {
                if (element.hidden) {
                    continue; // no need to process hidden groups
                }
                const groupOptions = this.getGroupOptions(element);
                const groupMatchesFilter = this.filterMatchesText(
                    element.labelContent
                );
                groupOptions.forEach(option => {
                    option.visuallyHidden = groupMatchesFilter
                        ? false
                        : this.isOptionHiddenOrFilteredOut(option);
                    if (!option.visuallyHidden) {
                        filteredOptions.push(option);
                    }
                });
            } else if (isListOption(element)) {
                element.visuallyHidden = this.isOptionHiddenOrFilteredOut(element);
                if (!element.visuallyHidden) {
                    filteredOptions.push(element);
                }
            }
        }

        this.filteredOptions = filteredOptions;
    }

    private getGroupOptions(group: ListOptionGroup): ListOption[] {
        return Array.from(group.children)
            .filter(el => isListOption(el))
            .map(el => {
                if (group.hidden && isListOption(el)) {
                    el.visuallyHidden = true;
                }

                return el;
            }) as ListOption[];
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

    private clearSelect(): void {
        const placeholder = this.getPlaceholderOption();
        this.selectedIndex = placeholder
            ? this.options.indexOf(placeholder)
            : -1;
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

    private filterChanged(): void {
        this.filterOptions();
    }

    private emitFilterInputEvent(): void {
        const eventDetail: SelectFilterInputEventDetail = {
            filterText: this.filter
        };

        this.$emit('filter-input', eventDetail, { bubbles: true });
    }

    private initializeOpenState(): void {
        this.setActiveOption(this.selectedIndex);
        this.ariaControls = this.listboxId;
        this.ariaExpanded = 'true';

        this.setPositioning();
        this.focusAndScrollOptionIntoView();
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
