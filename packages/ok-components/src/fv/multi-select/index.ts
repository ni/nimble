import { attr, DOM, observable, volatile } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';
import { styles } from './styles';
import { template } from './template';
import type { FvMultiSelectOption } from './types';
import { FormAssociatedMultiSelect } from './models/form-associated';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-multi-select': FvMultiSelect;
    }
}

/**
 * A dropdown with checkbox options and optional local search.
 */
export class FvMultiSelect extends FormAssociatedMultiSelect {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    @attr
    public label = '';

    @attr
    public placeholder = '';

    @attr({ mode: 'boolean' })
    public filterable = false;

    @attr({ mode: 'boolean' })
    public clearable = false;

    @attr({ mode: 'boolean' })
    public open = false;

    @observable
    public options: FvMultiSelectOption[] = [];

    @observable
    public selectedValues: string[] = [];

    /** @internal */
    @observable
    public filter = '';

    /** @internal */
    @observable
    public activeIndex = -1;

    /** @internal */
    @observable
    public keyboardNavigation = false;

    /** @internal */
    public readonly controlId = uniqueId('ok-fv-multi-select-');

    /** @internal */
    public readonly listboxId = `${this.controlId}-listbox`;

    /** @internal */
    public control!: HTMLButtonElement;

    /** @internal */
    public controlField!: HTMLDivElement;

    /** @internal */
    public filterInput?: HTMLInputElement;

    /** @internal */
    public listbox!: HTMLDivElement;

    /** @internal */
    public region!: AnchoredRegion;

    /** @internal */
    @observable
    public formDisabled = false;

    /** @internal */
    @volatile
    public get effectiveDisabled(): boolean {
        return this.disabled || this.formDisabled;
    }

    private initialSelectedValues?: string[];

    /** @internal */
    public get visibleOptions(): FvMultiSelectOption[] {
        const filter = diacriticInsensitiveStringNormalizer(this.filter);
        return this.options.filter(option => !this.filterable
            || diacriticInsensitiveStringNormalizer(option.label).includes(filter));
    }

    /** @internal */
    public get displayValue(): string {
        return this.selectedValues
            .map(value => this.options.find(option => option.value === value)?.label ?? value)
            .join(', ');
    }

    /** @internal */
    @volatile
    public get activeOptionId(): string | null {
        return this.open && this.activeIndex >= 0
            ? `${this.listboxId}-${this.activeIndex}`
            : null;
    }

    /** @internal */
    public override connectedCallback(): void {
        this.initialSelectedValues ??= [...this.selectedValues];
        super.connectedCallback();
        this.syncFormValue();
        document.addEventListener('click', this.documentClickHandler);
        window.addEventListener('resize', this.updatePopupLayout);
        window.addEventListener('scroll', this.updatePopupLayout, true);
        this.resetActiveOption();
        if (this.open) {
            void this.openChanged();
        }
    }

    /** @internal */
    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        window.removeEventListener('resize', this.updatePopupLayout);
        window.removeEventListener('scroll', this.updatePopupLayout, true);
        super.disconnectedCallback();
    }

    /** @internal */
    public override disabledChanged(previous: boolean, next: boolean): void {
        super.disabledChanged?.(previous, next);
        if (this.disabled) {
            this.open = false;
        }
        this.syncFormValue();
    }

    /** @internal */
    public override formDisabledCallback(disabled: boolean): void {
        this.formDisabled = disabled;
        if (disabled) {
            this.open = false;
        }
        this.syncFormValue();
    }

    /** @internal */
    public selectedValuesChanged(): void {
        this.syncFormValue();
    }

    /** @internal */
    public override nameChanged(previous: string, next: string): void {
        super.nameChanged?.(previous, next);
        this.syncFormValue();
    }

    /** @internal */
    public override valueChanged(): void {
        this.syncFormValue();
    }

    /** @internal */
    public override validate(): void {
        if (this.effectiveDisabled) {
            this.setValidity({});
        } else {
            super.validate(this.control);
        }
    }

    /** @internal */
    public override formResetCallback(): void {
        this.open = false;
        this.selectedValues = [...(this.initialSelectedValues ?? [])];
    }

    /** @internal */
    public async openChanged(): Promise<void> {
        if (this.open && this.effectiveDisabled) {
            this.open = false;
            return;
        }
        if (!this.open) {
            if (this.$fastController.isConnected) {
                // Rebinding on opening waits for a fresh anchored-region layout.
                this.region.anchorElement = null;
            }
            this.filter = '';
            this.activeIndex = -1;
            this.keyboardNavigation = false;
            return;
        }
        if (!this.$fastController.isConnected) {
            return;
        }
        this.region.anchorElement = this.controlField;
        this.updatePopupLayout();
        this.resetActiveOption();
        await DOM.nextUpdate();
        this.focusPopup();
    }

    /** @internal */
    public focusPopup(): void {
        if (this.open && this.isConnected) {
            (this.filterable ? this.filterInput : this.listbox)?.focus();
            this.scrollActiveOptionIntoView();
        }
    }

    /** @internal */
    public optionsChanged(): void {
        this.resetActiveOption();
    }

    /** @internal */
    public filterChanged(): void {
        this.resetActiveOption();
    }

    /** @internal */
    public async filterableChanged(): Promise<void> {
        this.filter = '';
        if (this.open) {
            this.resetActiveOption();
            if (!this.filterable) {
                this.listbox?.focus();
                return;
            }
            await DOM.nextUpdate();
            this.focusPopup();
        }
    }

    /** @internal */
    public toggleOption(option: FvMultiSelectOption): void {
        if (this.effectiveDisabled || option.disabled) {
            return;
        }
        this.selectedValues = this.selectedValues.includes(option.value)
            ? this.selectedValues.filter(value => value !== option.value)
            : [...this.selectedValues, option.value];
        this.$emit('input');
        this.$emit('change');
    }

    /** @internal */
    public clearSelection(): void {
        if (this.effectiveDisabled || !this.clearable || this.selectedValues.length === 0) {
            return;
        }
        this.open = false;
        this.selectedValues = [];
        this.control.focus();
        this.$emit('input');
        this.$emit('change');
    }

    /** @internal */
    public handleInput(event: Event): void {
        this.filter = (event.target as HTMLInputElement).value;
        event.stopPropagation();
    }

    /** @internal */
    public handleControlKeydown(event: KeyboardEvent): boolean {
        this.keyboardNavigation = true;
        if (event.key === 'Escape' && !this.open) {
            this.clearSelection();
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            this.open = !this.effectiveDisabled;
            if (event.key === 'ArrowUp') {
                this.moveActiveOption(-1, true);
            }
            return false;
        }
        return true;
    }

    /** @internal */
    public handlePopupKeydown(event: KeyboardEvent): boolean {
        if (event.isComposing) {
            return true;
        }
        if (event.key === 'Escape' || event.key === 'Tab') {
            this.open = false;
            // Hide the popup before the browser chooses the next native Tab stop.
            DOM.processUpdates();
            this.control.focus();
            return event.key === 'Tab';
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            this.keyboardNavigation = true;
            this.moveActiveOption(event.key === 'ArrowDown' ? 1 : -1);
            return false;
        }
        const inSearch = event.target === this.filterInput;
        if (!inSearch && (event.key === 'Home' || event.key === 'End')) {
            this.keyboardNavigation = true;
            this.moveActiveOption(event.key === 'Home' ? 1 : -1, true);
            return false;
        }
        if (event.key === 'Enter' || (!inSearch && event.key === ' ')) {
            const option = this.visibleOptions[this.activeIndex];
            if (option) {
                this.toggleOption(option);
            }
            return false;
        }
        return true;
    }

    /** @internal */
    public handleFocusout(event: FocusEvent): void {
        const next = event.relatedTarget;
        if (!(next instanceof Node)) {
            requestAnimationFrame(() => {
                if (document.activeElement !== this && !this.shadowRoot?.activeElement) {
                    this.open = false;
                }
            });
        } else if (!this.contains(next) && !this.shadowRoot?.contains(next)) {
            this.open = false;
        }
    }

    private resetActiveOption(): void {
        if (this.$fastController.isConnected) {
            this.activeIndex = this.visibleOptions.findIndex(option => !option.disabled);
            this.scrollActiveOptionIntoView();
        }
    }

    private scrollActiveOptionIntoView(): void {
        requestAnimationFrame(() => {
            if (this.open && this.isConnected) {
                this.shadowRoot?.getElementById(this.activeOptionId ?? '')?.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    private readonly updatePopupLayout = (): void => {
        if (this.open && this.isConnected) {
            const bounds = this.controlField.getBoundingClientRect();
            const availableHeight = Math.max(0, bounds.top, window.innerHeight - bounds.bottom);
            this.style.setProperty('--ok-fv-multi-select-available-height', `${availableHeight}px`);
            this.region.update();
        }
    };

    private syncFormValue(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.proxy.required = this.required;
        this.proxy.disabled = this.effectiveDisabled;
        this.proxy.replaceChildren(...this.selectedValues.map(value => new Option(value, value, false, true)));
        const data = new FormData();
        if (this.name) {
            for (const value of this.selectedValues) {
                data.append(this.name, value);
            }
        }
        this.setFormValue(this.effectiveDisabled ? null : data);
        this.validate();
    }

    private moveActiveOption(direction: number, fromEdge = false): void {
        const options = this.visibleOptions;
        let index = this.activeIndex;
        if (fromEdge) {
            index = direction > 0 ? -1 : options.length;
        }
        for (index += direction; index >= 0 && index < options.length; index += direction) {
            if (!options[index]!.disabled) {
                this.activeIndex = index;
                this.scrollActiveOptionIntoView();
                break;
            }
        }
    }

    private readonly documentClickHandler = (event: MouseEvent): void => {
        if (this.open && !event.composedPath().includes(this)) {
            this.open = false;
        }
    };
}

const okFvMultiSelect = FvMultiSelect.compose({
    baseName: 'fv-multi-select',
    baseClass: FormAssociatedMultiSelect,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvMultiSelect());
export const fvMultiSelectTag = 'ok-fv-multi-select';
