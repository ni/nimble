import { attr, html, observable, Observable } from '@microsoft/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    ListboxOption,
    SelectOptions
} from '@microsoft/fast-foundation';
import { keyEnter, keyEscape, keySpace } from '@microsoft/fast-web-utilities';
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

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

/**
 * A nimble-styled HTML select
 */
export class Select extends FoundationSelect implements ErrorPattern {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

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
    public scrollableElement!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public searchInput?: HTMLInputElement;

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

    private committedSelectedOption: ListboxOption | undefined = undefined;

    public constructor() {
        super();
        this.addEventListener('change', this.changeValueHandler);
        this.addEventListener('focusout', this.focusoutHander);
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
        this.committedSelectedOption = value.find(option => option.selected);
        Observable.notify(this, 'options');
    }

    // See comment for 'set value' below. Despite the implementation for 'get value'
    // being an exact copy of the FAST Select one, without replicating it here, we
    // would see test errors.
    public override get value(): string {
        Observable.track(this, 'value');
        // eslint-disable-next-line @typescript-eslint/dot-notation
        return this['_value'] as string;
    }

    // This is copied directly from FAST's implemention of its Select component, with
    // one main difference: we use 'options' (the filtered set of options) vs '_options'.
    // This is needed because while the dropdown is open the current 'selectedIndex' (set
    // within this implementation) needs to be relative to the filtered options. This
    // results in the unfortunate hack where we have to set this['_value'], as '_value'
    // is private. I have filed this issue to FAST to hopefully provide a better means
    // of accomplishing this: https://github.com/microsoft/fast/issues/6896
    public override set value(next: string) {
        const prev = `${this.value}`;
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

        if (prev !== newValue) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this['_value'] = newValue;
            super.valueChanged(prev, newValue);
            Observable.notify(this, 'value');
            if (this.collapsible) {
                Observable.notify(this, 'displayValue');
            }
        }
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

    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
        this.updateListboxMaxHeightCssVariable();
    }

    // Workaround for https://github.com/microsoft/fast/issues/5773
    public override slottedOptionsChanged(
        prev: Element[],
        next: Element[]
    ): void {
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        this.filterOptions();
        if (value) {
            this.value = value;
        }
    }

    public override clickHandler(e: MouseEvent): boolean {
        this.updateSelectedIndexFromFilteredSet();
        super.clickHandler(e);
        return true;
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
        this.filter = this.searchInput?.value ?? '';
        if (!this.committedSelectedOption) {
            this.committedSelectedOption = this._options.find(
                option => option.selected
            );
        }
        this.filterOptions();
        this.clearSelection();
        if (this.committedSelectedOption) {
            this.committedSelectedOption.selected = true;
        }

        if (
            this.filteredOptions.length > 0
            && this.committedSelectedOption
            && !this.filteredOptions.includes(this.committedSelectedOption)
        ) {
            this.committedSelectedOption.selected = false;
            this.filteredOptions[0]!.selected = true;
        }

        if (e.inputType.includes('deleteContent') || !this.filter.length) {
            return true;
        }

        e.stopPropagation();
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    public override keydownHandler(e: KeyboardEvent): boolean | void {
        if (this.filterMode === FilterMode.none) {
            return super.keydownHandler(e);
        }

        const key = e.key;
        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case keySpace: {
                // when dropdown is open allow user to enter a space for filter text
                // (calling super method will close dropdown)
                if (!this.open) {
                    super.keydownHandler(e);
                }
                break;
            }

            case keyEnter: {
                this.updateSelectedIndexFromFilteredSet();
                super.keydownHandler(e);
                this.focus();
                break;
            }
            case keyEscape: {
                this.filteredOptions = [];
                if (this.committedSelectedOption) {
                    this.clearSelection();
                    this.selectedIndex = this._options.indexOf(
                        this.committedSelectedOption
                    );
                }
                super.keydownHandler(e);
                this.focus();
                break;
            }

            default: {
                super.keydownHandler(e);
            }
        }
        return true;
    }

    protected override openChanged(
        prev: boolean | undefined,
        next: boolean
    ): void {
        super.openChanged(prev, next);
        if (!this.$fastController.isConnected) {
            return;
        }

        if (this.open) {
            this.filterOptions();
            window.requestAnimationFrame(() => {
                this.searchInput?.focus();
            });
        } else {
            this.filter = '';
            if (this.searchInput) {
                this.searchInput.value = '';
            }
        }

        if (this.open && this.committedSelectedOption) {
            this.committedSelectedOption.selected = true;
        }
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

    private clearSelection(): void {
        this._options.forEach(option => {
            option.selected = false;
        });
    }

    private filterChanged(): void {
        this.filterOptions();
    }

    private maxHeightChanged(): void {
        this.updateListboxMaxHeightCssVariable();
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
        const selectedItem = this.options[this.selectedIndex]!;
        // Clear filter and re-filter options so any logic resolving against 'this.options'
        // resolves against all options, since selectedIndex should be relative to entire set.
        this.filter = '';
        this.filterOptions();
        // translate selectedIndex for filtered list to selectedIndex for all items
        this.selectedIndex = this._options.indexOf(selectedItem);
    }

    private readonly changeValueHandler = (): void => {
        this.committedSelectedOption = this.options.find(
            option => option.selected
        );
    };

    private readonly focusoutHander = (): void => {
        this.updateSelectedIndexFromFilteredSet();
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

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
export const selectTag = 'nimble-select';
