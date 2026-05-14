/* eslint-disable @typescript-eslint/member-ordering */
// Based on: https://github.com/microsoft/fast/blob/%40microsoft/fast-foundation_v2.49.5/packages/web-components/fast-foundation/src/select/select.ts
import { attr, html, observable, Observable, volatile } from '@ni/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    type SelectOptions,
    SelectPosition,
    applyMixins,
    StartEnd,
    DelegatesARIASelect
} from '@ni/fast-foundation';
import {
    uniqueId
} from '@ni/fast-web-utilities';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import {
    DropdownAppearance
} from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import { mixinErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import type { ListOption } from '../list-option';
import { FilterMode, type SelectFilterInputEventDetail, type SelectVirtualizedOption } from './types';
import { diacriticInsensitiveStringNormalizer } from '../utilities/models/string-normalizers';
import { FormAssociatedSelectVirtualized } from './models/select-form-associated';
import { slotTextContent } from '../utilities/models/slot-text-content';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select-virtualized': SelectVirtualized;
    }
}

// Used in overrides of base class methods
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type BooleanOrVoid = boolean | void;

/**
 * A nimble-styled HTML select that virtualizes its options for improved performance with large numbers of options.
 */
export class SelectVirtualized
    extends mixinErrorPattern(mixinRequiredVisiblePattern(FormAssociatedSelectVirtualized)) {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    @attr({ attribute: 'appearance-readonly', mode: 'boolean' })
    public appearanceReadOnly = false;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;

    /**
     * Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: 'position' })
    public positionAttribute?: SelectPosition;

    @attr({ attribute: 'filter-mode' })
    public filterMode: FilterMode = FilterMode.none;

    @attr({ attribute: 'clearable', mode: 'boolean' })
    public clearable = false;

    @attr({ attribute: 'loading-visible', mode: 'boolean' })
    public loadingVisible = false;

    @attr
    public placeholder = '';

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
     * The index of the currently selected option within allUnfilteredOptions.
     */
    @observable
    public selectedIndex = -1;

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
    public filter = '';

    /**
     * The space available in the viewport for the listbox when opened.
     *
     * @internal
     */
    @observable
    public availableViewportHeight = 0;

    /** @internal */
    public labelSlot!: HTMLSlotElement;

    /** @internal */
    @volatile
    public get labelContent(): string {
        if (!this.$fastController.isConnected) {
            return '';
        }

        return slotTextContent(this.labelSlot);
    }

    private _value = '';
    private forcedPosition = false;
    private openActiveIndex?: number;
    private readonly selectedOptionObserver? = new MutationObserver(() => {
        this.updateDisplayValue();
    });

    private _allUnfilteredOptions?: SelectVirtualizedOption[];

    private get allUnfilteredOptions(): SelectVirtualizedOption[] {
        return this._allUnfilteredOptions ?? [];
    }

    private set allUnfilteredOptions(value: SelectVirtualizedOption[]) {
        this._allUnfilteredOptions = value;
    }

    @observable
    public filteredOptions: SelectVirtualizedOption[] = [];

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.proxy.multiple = false;
        this.forcedPosition = !!this.positionAttribute;
        if (this.open) {
            this.initializeOpenState();
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.selectedOptionObserver?.disconnect();
    }

    public setOptions(newData: readonly SelectVirtualizedOption[]): void {
        this.allUnfilteredOptions = newData.map(option => ({ ...option }));
        this.handleNewOptions();
    }

    public override get value(): string {
        Observable.track(this, 'value');
        return this._value;
    }

    public override set value(next: string) {
        const prev = this._value;
        let newValue = next;

        if (this.allUnfilteredOptions.length > 0) {
            const newValueIndex = this.allUnfilteredOptions.findIndex(
                o => o.value === newValue
            );
            const prevSelectedValue = this.allUnfilteredOptions[this.selectedIndex]?.value ?? null;
            const nextSelectedValue = this.allUnfilteredOptions[newValueIndex]?.value ?? null;

            if (
                newValueIndex === -1
                || prevSelectedValue !== nextSelectedValue
            ) {
                newValue = '';
                this.selectedIndex = newValueIndex;
            }

            // mkreis TODO
            // newValue = this.firstSelectedOption?.value ?? newValue;
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
        return this.allUnfilteredOptions[this.selectedIndex]?.displayText ?? '';
    }

    /**
     * @internal
     */
    public anchoredRegionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.anchoredRegion !== undefined && this.control !== undefined) {
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
        if (this.anchoredRegion !== undefined && this.control !== undefined) {
            this.anchoredRegion.anchorElement = this.control;
        }
    }

    // /**
    //  * @internal
    //  */
    // public override slottedOptionsChanged(
    //     prev: Element[] | undefined,
    //     next: Element[] | undefined
    // ): void {
    private handleNewOptions(): void {
        const value = this.value;
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
    public clickHandler(e: MouseEvent): BooleanOrVoid {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.composedPath().find(node => {
                return node instanceof HTMLElement
                    && node.matches('option,[role=option]');
            }) as ListOption | undefined);

            if (captured?.disabled) {
                return;
            }

            if (captured) {
                const previousSelectedIndex = this.selectedIndex;
                this.selectedIndex = this.allUnfilteredOptions.findIndex(o => {
                    return o.value === captured.value;
                });
                if (this.selectedIndex !== previousSelectedIndex) {
                    this.updateValue(true);
                }
            }
        }

        this.open = !this.open;
    }

    /**
     * @internal
     */
    public mousedownHandler(_e: MouseEvent): BooleanOrVoid {
        return true;
    }

    /**
     * @internal
     */
    public regionLoadedHandler(): void {
        // this.focusAndScrollOptionIntoView();
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
        // const placeholderOption = this.getPlaceholderOption();
        // if (
        //     placeholderOption
        //     && this.firstSelectedOption === placeholderOption
        // ) {
        //     this.displayPlaceholder = true;
        // } else {
        //     this.displayPlaceholder = false;
        // }

        // Observable.notify(this, 'displayValue');
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

            const enabledOptions = this.allUnfilteredOptions.filter(
                o => !o.disabled
            );
            let activeOptionIndex = this.filter !== ''
                ? (this.openActiveIndex ?? this.selectedIndex)
                : this.selectedIndex;

            if (
                enabledOptions.length > 0
                && !enabledOptions.find(
                    o => o === this.allUnfilteredOptions[activeOptionIndex]
                )
            ) {
                activeOptionIndex = this.allUnfilteredOptions.indexOf(enabledOptions[0]!);
            } else if (enabledOptions.length === 0) {
                activeOptionIndex = -1;
            }
            // this.setActiveOption(activeOptionIndex);
        }

        if (this.filterMode !== FilterMode.none) {
            this.emitFilterInputEvent();
        }

        if (e.inputType.includes('deleteContent') || this.filter.length === 0) {
            return true;
        }

        e.stopPropagation();
        return true;
    }

    /**
     * @internal
     */
    public focusoutHandler(e: FocusEvent): BooleanOrVoid {
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
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    public selectedIndexChanged(
        _: number | undefined,
        __: number
    ): void {
        // Don't call super.selectedIndexChanged as this will disallow disabled options
        // from being valid initial selected values. Our setDefaultSelectedOption
        // implementation handles skipping non-selected disabled options for the initial
        // selected value.
        // if (this.open) {
        //     this.setActiveOption(this.selectedIndex);
        // }
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
        this.selectedIndex = 0;
    }

    protected positionChanged(
        _: SelectPosition | undefined,
        next: SelectPosition | undefined
    ): void {
        this.positionAttribute = next;
        this.setPositioning();
    }

    protected openChanged(): void {
        if (this.open) {
            this.initializeOpenState();
            return;
        }

        this.openActiveIndex = undefined;
        this.filter = '';
        if (this.filterInput) {
            this.filterInput.value = '';
        }

        if (this.filterMode !== FilterMode.none) {
            this.emitFilterInputEvent();
        }
        this.ariaExpanded = 'false';
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

    private isOptionHiddenOrFilteredOut(option: SelectVirtualizedOption): boolean {
        if (option.hidden) {
            return true;
        }
        return this.filterMode === FilterMode.standard
            ? !this.filterMatchesText(option.displayText)
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

        const filteredOptions: SelectVirtualizedOption[] = [];
        for (const option of this.allUnfilteredOptions) {
            if (!this.isOptionHiddenOrFilteredOut(option)) {
                filteredOptions.push(option);
            }
        }

        this.filteredOptions = filteredOptions;
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
            this.value = this.allUnfilteredOptions[this.selectedIndex]?.value ?? '';
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
        this.selectedIndex = -1;
        // const placeholder = this.getPlaceholderOption();
        // this.selectedIndex = placeholder
        //     ? this.options.indexOf(placeholder)
        //     : -1;
    }

    /**
     * Resets and fills the proxy to match the component's options.
     *
     * @internal
     */
    private setProxyOptions(): void {
        if (this.proxy instanceof HTMLSelectElement && this.allUnfilteredOptions !== null) {
            this.proxy.options.length = 0;
            // this.allUnfilteredOptions.forEach(option => {
            //     const proxyOption = new HTMLOptionElement();
            //     proxyOption.value = option.value;
            //     proxyOption.text = option.displayText;

            //     if (proxyOption !== null) {
            //         this.proxy.options.add(proxyOption);
            //     }
            // });
        }
    }

    private emitFilterInputEvent(): void {
        const eventDetail: SelectFilterInputEventDetail = {
            filterText: this.filter
        };

        this.$emit('filter-input', eventDetail, { bubbles: true });
    }

    private initializeOpenState(): void {
        // this.setActiveOption(this.selectedIndex);
        this.ariaExpanded = 'true';

        this.setPositioning();
        // this.focusAndScrollOptionIntoView();
    }
}

const nimbleSelectVirtualized = SelectVirtualized.compose<SelectOptions>({
    baseName: 'select-virtualized',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data,
    end: html<SelectVirtualized>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

applyMixins(SelectVirtualized, StartEnd, DelegatesARIASelect);
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelectVirtualized());
export const selectVirtualizedTag = 'nimble-select-virtualized';
