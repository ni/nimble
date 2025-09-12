import { attr, observable, Observable, volatile } from '@ni/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    ListboxOption,
    SelectPosition,
    applyMixins,
    StartEnd,
    DelegatesARIASelect
} from '@ni/fast-foundation';
import { uniqueId, keyEnter, keySpace } from '@ni/fast-web-utilities';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import {
    DropdownAppearance,
    type ListOptionOwner
} from '../patterns/dropdown/types';
import { isListOption, isListOptionGroup, template } from './template';
import type { ListOption } from '../list-option';
import { FilterMode } from '../select/types';
import { ListOptionGroup } from '../list-option-group';
import { diacriticInsensitiveStringNormalizer } from '../utilities/models/string-normalizers';
import { FormAssociatedSelect } from '../select/models/select-form-associated';
import { slotTextContent } from '../utilities/models/slot-text-content';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';
import { iconCheckTag } from '../icons/check';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-multiselect': Multiselect;
    }
}

// Used in overrides of base class methods
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type BooleanOrVoid = boolean | void;

// local helper type for option-like objects
type OptionLike = Partial<ListOption> & Partial<ListboxOption>;

/**
 * Multiselect component - allows multiple selection and injects a check icon
 * into selected options' start slot locally so list-option doesn't need to change.
 */
export class Multiselect
    extends mixinRequiredVisiblePattern(FormAssociatedSelect)
    implements ListOptionOwner {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    @attr({ attribute: 'appearance-readonly', mode: 'boolean' })
    public appearanceReadOnly = false;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;

    @attr({ attribute: 'position' })
    public positionAttribute?: SelectPosition;

    @attr({ attribute: 'filter-mode' })
    public filterMode: FilterMode = FilterMode.none;

    @attr({ attribute: 'clearable', mode: 'boolean' })
    public clearable = false;

    @attr({ attribute: 'loading-visible', mode: 'boolean' })
    public loadingVisible = false;

    @observable
    public displayPlaceholder = false;

    @attr({ attribute: 'open', mode: 'boolean' })
    @observable
    public open = false;

    @observable
    public position?: SelectPosition;

    @observable
    public control!: HTMLElement;

    public listbox!: HTMLDivElement;
    public listboxId: string = uniqueId('listbox-');

    @observable
    public scrollableRegion!: HTMLElement;

    @observable
    public filterInput?: HTMLInputElement;

    @observable
    public anchoredRegion!: AnchoredRegion;

    @observable
    public hasOverflow = false;

    @observable
    public filteredOptions: ListboxOption[] = [];

    @observable
    public filter = '';

    @observable
    public availableViewportHeight = 0;

    @volatile
    public get collapsible(): boolean {
        // Multiselect should always be collapsible (dropdown-enabled)
        // Unlike single-select, multiselect doesn't care about size attribute
        return !(this.disabled || typeof this.size === 'number');
    }

    public labelSlot!: HTMLSlotElement;

    @volatile
    public get labelContent(): string {
        if (!this.$fastController.isConnected) {
            return '';
        }
        return slotTextContent(this.labelSlot);
    }

    private forcedPosition = false;
    private openActiveIndex?: number;
    private readonly selectedOptionObserver?: MutationObserver = new MutationObserver(() => {
        this.updateDisplayValue();
    });

    private _value = '';

    public override connectedCallback(): void {
        super.connectedCallback();
        this.multiple = true; // Multiselect should always be multiple
        this.forcedPosition = !!this.positionAttribute;
        if (this.open) {
            this.initializeOpenState();
        }
        this.observeSelectedOptionTextContent();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.selectedOptionObserver?.disconnect();
    }

    public registerOption(option: ListOption): void {
        if (this.options.includes(option)) {
            return;
        }

        this.options.push(option);
    }

    @volatile
    public get displayValue(): string {
        Observable.track(this, 'displayValue');
        Observable.track(this, 'displayPlaceholder');
        const selected = this.selectedOptions ?? [];
        if (selected.length === 0) {
            if (this.displayPlaceholder) {
                const placeholderOption = this.getPlaceholderOption();
                return placeholderOption?.text ?? '';
            }
            return '';
        }
        if (selected.length === 1) {
            const only = selected[0];
            return (only && (only as OptionLike).text) ?? '';
        }

        return selected
            .map(s => (s ? ((s as OptionLike).text ?? '') : ''))
            .join(', ');
    }

    public override get value(): string {
        Observable.track(this, 'value');
        const selected = this.selectedOptions ?? [];
        if (selected.length === 0) {
            return '';
        }
        if (selected.length === 1) {
            return (selected[0] as OptionLike)?.value ?? '';
        }
        // For multiple selections, return comma-separated values
        return selected.map(s => (s as OptionLike)?.value ?? '').join(',');
    }

    public override set value(next: string) {
        const prev = this._value;
        const newValue = next;

        if (prev !== newValue) {
            this._value = newValue;
            super.valueChanged(prev, newValue);
            Observable.notify(this, 'value');

            // Handle setting multiple values from comma-separated string
            if (newValue) {
                const values = newValue.split(',').map(v => v.trim());
                const newSelection = this.options?.filter(option => values.includes((option as OptionLike)?.value ?? '')) ?? [];
                this.selectedOptions = newSelection;
            } else {
                // Clear selections when value is empty
                this.selectedOptions = [];
            }
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
    public override focusoutHandler(e: FocusEvent): BooleanOrVoid {
        super.focusoutHandler(e);

        if (this.open) {
            const focusTarget = e.relatedTarget as HTMLElement;
            // Check if focus is moving to an element within this component
            if (focusTarget && this.contains(focusTarget)) {
                return true;
            }
        }

        this.open = false;
        return true;
    }

    /**
     * @internal
     */
    public clearClickHandler(e: MouseEvent): void {
        this.open = false;
        try {
            // clearSelect is implemented on some select bases; call if present
            (this as unknown as { clearSelect?: () => void }).clearSelect?.();
        } catch {
            // ignore
        }
        this.updateValue(true);
        e.stopPropagation();
    }

    /**
     * Clear the current selection. If a placeholder option exists it will not
     * be selected by this operation; clearing results in no selected options
     * and the multiselect will display the placeholder (if configured).
     */
    public clearSelect(): void {
        // Clear the selected options
        this.selectedOptions = [];

        // Reset stored value and notify observers so consumers see an empty value
        const prev = this._value;
        if (prev !== '') {
            this._value = '';
            try {
                super.valueChanged(prev, '');
            } catch {
                // defensive: ignore if base doesn't implement valueChanged
            }
            Observable.notify(this, 'value');
        }

        // Emit input/change and refresh display state
        this.updateValue(true);
    }

    public override clickHandler(e: MouseEvent): BooleanOrVoid {
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest<ListOption>(
                'option,[role=option]'
            );
            const optionClicked = captured !== null;

            if (captured?.disabled) {
                return;
            }

            // For multiselect: if clicking on an option, handle selection but keep dropdown open
            if (optionClicked) {
                // Let the parent handle the selection first
                super.clickHandler(e);
                // Keep dropdown open by not returning here
                // The parent clickHandler will handle the selection logic
                return;
            }
        }

        // For all other cases, let parent handle it (this will toggle the open state)
        super.clickHandler(e);

        // Ensure the dropdown opens if it should
        if (!this.open && this.collapsible && !this.disabled) {
            this.open = true;
        }
    }

    /**
     * @internal
     */
    public regionLoadedHandler(): void {
        // Mirror Select behavior: focus and scroll active option into view when region loads
        this.focusAndScrollActiveOptionIntoView();
    }

    public inputHandler(e: InputEvent): boolean {
        this.filter = this.filterInput?.value ?? '';
        if (this.filterMode === FilterMode.standard) {
            this.filterOptions();
            const enabledOptions = this.filteredOptions.filter(
                o => !o.disabled
            );
            let activeOptionIndex = this.filter !== ''
                ? (this.openActiveIndex ?? this.selectedIndex)
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
        if (e.inputType?.includes('deleteContent') || !this.filter.length) {
            return true;
        }
        e.stopPropagation();
        return true;
    }

    /**
     * @internal
     */
    public override keydownHandler(e: KeyboardEvent): BooleanOrVoid {
        const key = e.key;

        // Handle multi-select specific keyboard behavior for Enter and Space
        if (this.open && (key === keyEnter || key === keySpace)) {
            e.preventDefault();

            const activeOption = this.options[
                this.openActiveIndex ?? this.selectedIndex
            ] as unknown as ListOption | undefined;
            if (
                activeOption
                && isListOption(activeOption)
                && !activeOption.disabled
            ) {
                // Toggle selection of the active option
                const isSelected = this.selectedOptions?.includes(activeOption) ?? false;
                if (isSelected) {
                    // Remove from selection
                    const newSelection = this.selectedOptions?.filter(
                        opt => opt !== activeOption
                    ) ?? [];
                    this.selectedOptions = newSelection;
                } else {
                    // Add to selection
                    const newSelection = [
                        ...(this.selectedOptions ?? []),
                        activeOption
                    ];
                    this.selectedOptions = newSelection;
                }

                // Update value and emit events
                this.updateValue(true);
                return true; // Event handled, don't call base handler
            }
        }

        // For all other keys, use the base implementation
        return super.keydownHandler(e);
    }

    public updateDisplayValue(): void {
        const placeholderOption = this.getPlaceholderOption();
        // Show placeholder if there are no selections or only the placeholder is selected
        const hasNoSelection = this.selectedOptions.length === 0;
        const hasOnlyPlaceholderSelected = !!placeholderOption
            && this.selectedOptions.length === 1
            && this.selectedOptions[0] === placeholderOption;

        // When disabled (with or without appearance-readonly), only show placeholder when there are truly no selections
        // This ensures selected options are displayed in disabled mode
        if (this.disabled) {
            this.displayPlaceholder = hasNoSelection;
        } else {
            this.displayPlaceholder = hasNoSelection || hasOnlyPlaceholderSelected;
        }

        Observable.notify(this, 'displayValue');
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

    protected override selectedOptionsChanged(
        _prev: ListboxOption[] | undefined,
        next: ListboxOption[]
    ): void {
        this.options?.forEach((o, i) => {
            const notifier = Observable.getNotifier(o);
            // Temporarily unsubscribe to prevent re-entrant notifications while updating
            try {
                notifier.unsubscribe(this, 'selected');
            } catch {
                // ignore if not previously subscribed
            }

            const selected = Array.isArray(next) ? next.includes(o) : false;
            // assign selected state on the ListOption when applicable
            if (isListOption(o as unknown as Element)) {
                (o as ListOption).selected = selected;
            }

            try {
                notifier.subscribe(this, 'selected');
            } catch {
                // ignore subscription errors
            }

            const proxyOption = this.proxy?.options.item(i);
            if (proxyOption) {
                // If this option is a placeholder (hidden && disabled), do not
                // reflect its selected state onto the proxy native <select> element.
                // Marking the proxy option as selected can change the native
                // select's selectedIndex/value and cause re-entrant selection
                // updates between the foundation listbox and this component.
                const isPlaceholder = (o as OptionLike).hidden && (o as OptionLike).disabled;
                proxyOption.selected = isPlaceholder ? false : selected;
            }

            // Inject or remove check icon in the option's light DOM start slot so only
            // nimble-multiselect shows the check icon without modifying list-option globally.
            try {
                const optionElement = o as unknown as HTMLElement;
                if (selected) {
                    // ensure only one check icon is present
                    if (!optionElement.querySelector(iconCheckTag)) {
                        const iconEl = document.createElement(iconCheckTag);
                        iconEl.setAttribute('slot', 'start');
                        optionElement.prepend(iconEl);
                    }
                } else {
                    const existing = optionElement.querySelectorAll(iconCheckTag);
                    existing.forEach(n => n.remove());
                }
            } catch {
                // defensive: if DOM operations fail, continue without blocking selection updates
            }
        });

        // For multiselect, selectedIndex is not used for selection state
        // It is only used for keyboard navigation when the dropdown is open
        // We don't update it based on selectedOptions to avoid loops with the base class

        // Update display value and notify observers
        this.updateDisplayValue();
    }

    protected openChanged(): void {
        if (!this.collapsible) {
            return;
        }

        if (this.open) {
            this.initializeOpenState();
            return;
        }

        // Cleanup when closing
        const activeOption = this.options[
            this.openActiveIndex ?? this.selectedIndex
        ] as unknown as ListOption | undefined;
        if (activeOption && isListOption(activeOption)) {
            (activeOption as Element).removeAttribute('active-option');
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

    private filterOptions(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        const filteredOptions: ListboxOption[] = [];

        for (const element of this.slottedOptions) {
            if (isListOptionGroup(element)) {
                const group = element as unknown as ListOptionGroup;
                if (group.hidden) {
                    continue;
                }

                const groupOptions = this.getGroupOptions(group);
                const groupMatchesFilter = this.filterMatchesText(
                    group.labelContent
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
                const listOption = element as unknown as ListOption;
                listOption.visuallyHidden = this.isOptionHiddenOrFilteredOut(listOption);
                if (!listOption.visuallyHidden) {
                    filteredOptions.push(
                        listOption as unknown as ListboxOption
                    );
                }
            }
        }

        this.filteredOptions = filteredOptions;
    }

    private isOptionHiddenOrFilteredOut(
        option: ListOption | ListboxOption
    ): boolean {
        if ((option as OptionLike).hidden) {
            return true;
        }

        const text = (option as OptionLike).text ?? '';
        return this.filterMode === FilterMode.standard
            ? !this.filterMatchesText(text)
            : false;
    }

    private filterMatchesText(text: string): boolean {
        const filter = this.filter.toLowerCase();
        const normalizedFilter = diacriticInsensitiveStringNormalizer(filter);
        return diacriticInsensitiveStringNormalizer(text).includes(
            normalizedFilter
        );
    }

    private getGroupOptions(group: ListOptionGroup): ListOption[] {
        return Array.from(group.children)
            .filter((el): el is ListOption => isListOption(el))
            .map(el => {
                if (group.hidden) {
                    el.visuallyHidden = true;
                }

                return el;
            });
    }

    private updateValue(shouldEmit?: boolean): void {
        if (this.$fastController.isConnected) {
            this.observeSelectedOptionTextContent();
        }
        if (shouldEmit) {
            this.$emit('input');
            this.$emit('change', this, {
                bubbles: true,
                composed: undefined
            });
        }
    }

    private setActiveOption(newActiveIndex: number): void {
        const activeOption = this.options[newActiveIndex] as unknown as
            | ListOption
            | undefined;
        if (this.open) {
            if (activeOption !== undefined && isListOption(activeOption)) {
                (activeOption as Element).setAttribute('active-option', '');
            }

            const previousActiveIndex = this.openActiveIndex ?? this.selectedIndex;
            const previousActiveOption = this.options[
                previousActiveIndex
            ] as unknown as ListOption | undefined;
            if (
                previousActiveIndex !== newActiveIndex
                && previousActiveOption !== undefined
            ) {
                (previousActiveOption as Element).removeAttribute(
                    'active-option'
                );
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

    private getPlaceholderOption(): ListboxOption | undefined {
        return this.options.find(o => o.hidden && o.disabled);
    }

    private setPositioning(): void {
        if (!this.$fastController.isConnected) {
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

    private setProxyOptions(): void {
        if (this.proxy instanceof HTMLSelectElement && this.options) {
            this.proxy.options.length = 0;
            this.options.forEach(option => {
                const proxyOption = (option as unknown as { proxy?: HTMLOptionElement })
                    .proxy
                    || (option instanceof HTMLOptionElement
                        ? (option.cloneNode() as HTMLOptionElement)
                        : null);
                if (proxyOption) {
                    this.proxy.options.add(proxyOption);
                }
            });
        }
    }

    private emitFilterInputEvent(): void {
        const eventDetail = {
            filterText: this.filter
        };
        this.$emit('filter-input', eventDetail, { bubbles: true });
    }

    private initializeOpenState(): void {
        this.setActiveOption(this.selectedIndex);
        this.ariaControls = this.listboxId;
        this.ariaExpanded = 'true';
        this.setPositioning();
        this.focusAndScrollActiveOptionIntoView();
    }

    private observeSelectedOptionTextContent(): void {
        this.selectedOptionObserver?.disconnect();
        if (this.selectedIndex === -1) {
            return;
        }
        const selectedOption = this.firstSelectedOption;
        if (selectedOption) {
            this.selectedOptionObserver?.observe(selectedOption, {
                characterData: true,
                subtree: true,
                childList: true
            });
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

    private updateAdjacentSeparatorState(
        element: ListOptionGroup | ListOption
    ): void {
        const previousElement = this.getPreviousVisibleOptionOrGroup(element);
        const nextElement = this.getNextVisibleOptionOrGroup(element);

        const isOptionOrGroupVisible = (
            el: ListOption | ListOptionGroup
        ): boolean => {
            return !el.visuallyHidden && !el.hidden;
        };

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
                && !previousElement.visuallyHidden
                && !previousElement.hidden
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
                && !nextElement.visuallyHidden
                && !nextElement.hidden
            ) {
                return nextElement;
            }
            nextElement = nextElement.nextElementSibling;
        }
        return null;
    }
}

const nimbleMultiselect = Multiselect.compose({
    baseName: 'multiselect',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data
});
applyMixins(Multiselect, StartEnd, DelegatesARIASelect);
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMultiselect());
export const multiselectTag = 'nimble-multiselect';
