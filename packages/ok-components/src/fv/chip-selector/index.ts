import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-chip-selector': FvChipSelector;
    }
}

/**
 * A chip picker with inline text entry, removable chips, and a dropdown option list.
 */
export class FvChipSelector extends FoundationElement {
    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public open = false;

    @attr
    public label = '';

    @attr({ attribute: 'selected-values' })
    public selectedValues = '';

    @attr
    public options = '';

    @attr
    public placeholder = 'Select values';

    @attr({ attribute: 'allow-custom-values', mode: 'boolean' })
    public allowCustomValues = false;

    /** @internal */
    @observable
    public filterText = '';

    /** @internal */
    @observable
    public activeOptionIndex = -1;

    /** @internal */
    @observable
    public activeOptionId: string | null = null;

    /** @internal */
    public readonly inputId = uniqueId('ok-fv-chip-selector-input');

    /** @internal */
    public readonly labelId = uniqueId('ok-fv-chip-selector-label');

    /** @internal */
    public readonly menuId = uniqueId('ok-fv-chip-selector-menu');

    /** @internal */
    @observable
    public readonly region?: AnchoredRegion;

    /** @internal */
    @observable
    public readonly field?: HTMLElement;

    private inputElement: HTMLInputElement | null = null;

    private menuButtonElement: (HTMLElement & { checked?: boolean }) | null = null;

    /** @internal */
    public disabledChanged(): void {
        if (this.disabled) {
            this.filterText = '';
            this.open = false;
        }
    }

    /** @internal */
    public openChanged(): void {
        this.syncMenuButtonState();
        if (!this.open) {
            this.activeOptionIndex = -1;
        }
    }

    /** @internal */
    public activeOptionIndexChanged(): void {
        this.syncActiveOption();
    }

    /** @internal */
    public filterTextChanged(): void {
        this.activeOptionIndex = -1;
    }

    /** @internal */
    public optionsChanged(): void {}

    /** @internal */
    public allowCustomValuesChanged(): void {}

    /** @internal */
    public selectedValuesChanged(): void {}

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.documentClickHandler);
    }

    /** @internal */
    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        super.disconnectedCallback();
    }

    /** @internal */
    public captureInputRef(input: HTMLInputElement | null): void {
        this.inputElement = input;
    }

    /** @internal */
    public captureMenuButtonRef(menuButton: (HTMLElement & { checked?: boolean }) | null): void {
        this.menuButtonElement = menuButton;
        this.syncMenuButtonState();
    }

    /** @internal */
    public regionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.region && this.field) {
            this.region.anchorElement = this.field;
        }
    }

    /** @internal */
    public fieldChanged(
        _prev: HTMLElement | undefined,
        _next: HTMLElement | undefined
    ): void {
        if (this.region) {
            this.region.anchorElement = this.field ?? null;
        }
    }

    /** @internal */
    public get selectedValueList(): string[] {
        return Array.from(new Set(
            this.selectedValues
                .split(',')
                .map(value => value.trim())
                .filter(value => value.length > 0)
        ));
    }

    /** @internal */
    public get optionList(): string[] {
        return Array.from(new Set(
            this.options
                .split(',')
                .map(option => option.trim())
                .filter(option => option.length > 0)
        ));
    }

    /** @internal */
    public get visibleOptionList(): string[] {
        const selectedValues = new Set(this.selectedValueList);
        const normalizedFilter = diacriticInsensitiveStringNormalizer(this.filterText.trim());

        return this.optionList.filter(option => {
            if (selectedValues.has(option)) {
                return false;
            }

            return normalizedFilter.length === 0
                || diacriticInsensitiveStringNormalizer(option).includes(normalizedFilter);
        });
    }

    /** @internal */
    public get customValueCandidate(): string {
        const trimmedFilterText = this.filterText.trim();

        if (!this.allowCustomValues || trimmedFilterText.length === 0 || trimmedFilterText.includes(',')) {
            return '';
        }

        if (this.optionList.includes(trimmedFilterText) || this.selectedValueList.includes(trimmedFilterText)) {
            return '';
        }

        return trimmedFilterText;
    }

    /** @internal */
    public get createOptionLabel(): string {
        return `Add '${this.customValueCandidate}'`;
    }

    /** @internal */
    public get showEmptyState(): boolean {
        return this.visibleOptionList.length === 0 && this.customValueCandidate.length === 0;
    }

    /** @internal */
    public handleFieldClick(event: Event): void {
        if (this.disabled) {
            return;
        }

        const target = event.target as HTMLElement | null;
        if (target?.closest(chipTag) || target?.closest('.chip-selector-menu-button')) {
            return;
        }

        this.setOpen(true);
        this.inputElement?.focus();
    }

    /** @internal */
    public handleMenuButtonClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        if (this.disabled) {
            return;
        }

        this.setOpen(!this.open);
        this.inputElement?.focus();
    }

    /** @internal */
    public handleMenuButtonChange(event: Event): void {
        // Prevent internal toggle-button change events from surfacing as chip-selector selection changes.
        event.stopPropagation();
        this.syncMenuButtonState();
    }

    /** @internal */
    public handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.filterText = input.value;
        this.setOpen(true);
    }

    /** @internal */
    public handleInputFocus(): void {
        if (!this.disabled) {
            this.setOpen(true);
        }
    }

    /** @internal */
    public handleInputKeydown(event: KeyboardEvent): boolean {
        if (this.disabled) {
            return true;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!this.open) {
                this.setOpen(true);
            }
            const maxIndex = this.visibleOptionList.length + (this.customValueCandidate ? 1 : 0) - 1;
            if (maxIndex < 0) {
                return false;
            }
            if (event.key === 'ArrowDown') {
                this.activeOptionIndex = Math.min(this.activeOptionIndex + 1, maxIndex);
            } else {
                this.activeOptionIndex = Math.max(this.activeOptionIndex - 1, 0);
            }
            return false;
        }

        if (event.key === 'Enter') {
            if (this.open && this.activeOptionIndex >= 0) {
                event.preventDefault();
                this.commitActiveOption();
                return false;
            }
            return true;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            this.filterText = '';
            this.setOpen(false);
            return false;
        }

        if (event.key === 'Backspace' && this.filterText.length === 0) {
            const selectedValues = this.selectedValueList;
            const lastValue = selectedValues[selectedValues.length - 1];
            if (lastValue) {
                event.preventDefault();
                this.removeValue(lastValue);
            }
            return false;
        }

        return true;
    }

    /** @internal */
    public handleChipRemove(event: Event): void {
        const chip = event.composedPath().find(
            element => element instanceof HTMLElement && element.tagName.toLowerCase() === chipTag
        ) as HTMLElement | undefined;

        const value = chip?.getAttribute('data-chip-value')?.trim();
        if (value) {
            this.removeValue(value);
        }
    }

    /** @internal */
    public handleMenuClick(event: Event): void {
        const optionEl = event.composedPath().find(
            el => el instanceof HTMLElement && el.hasAttribute('data-option-value')
        ) as HTMLElement | undefined;
        const value = optionEl?.getAttribute('data-option-value')?.trim();
        if (value) {
            this.addValue(value);
        }
    }

    /** @internal */
    public handleMenuItemChange(event: Event): void {
        event.stopPropagation();
        const menuItem = event.composedPath().find(
            pathItem => pathItem instanceof HTMLElement && pathItem.hasAttribute('data-option-value')
        ) as HTMLElement | undefined;
        const value = menuItem?.getAttribute('data-option-value')?.trim();
        if (value) {
            this.addValue(value);
        }
    }

    private readonly documentClickHandler = (event: Event): void => {
        if (this.open && !event.composedPath().includes(this)) {
            this.setOpen(false);
        }
    };

    private syncActiveOption(): void {
        const options = Array.from(
            this.shadowRoot?.querySelectorAll<HTMLElement>('.chip-selector-option') ?? []
        );
        options.forEach((option, index) => {
            option.setAttribute('aria-selected', String(index === this.activeOptionIndex));
        });

        if (this.activeOptionIndex < 0) {
            this.activeOptionId = null;
        } else if (
            this.customValueCandidate.length > 0
            && this.activeOptionIndex === this.visibleOptionList.length
        ) {
            this.activeOptionId = `${this.menuId}-option-create`;
        } else {
            this.activeOptionId = `${this.menuId}-option-${this.activeOptionIndex}`;
        }
    }

    private commitActiveOption(): void {
        const allOptions = [
            ...this.visibleOptionList,
            ...(this.customValueCandidate ? [this.customValueCandidate] : [])
        ];
        const value = allOptions[this.activeOptionIndex];
        if (value !== undefined) {
            this.addValue(value);
        }
    }

    private addValue(value: string): void {
        if (this.disabled) {
            return;
        }

        const nextValues = this.selectedValueList;
        if (nextValues.includes(value)) {
            return;
        }

        nextValues.push(value);
        this.commitSelection(nextValues);
        this.filterText = '';
        this.setOpen(true);
        this.inputElement?.focus();
    }

    private removeValue(value: string): void {
        if (this.disabled) {
            return;
        }

        const nextValues = this.selectedValueList.filter(selectedValue => selectedValue !== value);
        this.commitSelection(nextValues);
        this.inputElement?.focus();
    }

    private commitSelection(nextValues: string[]): void {
        this.selectedValues = nextValues.join(',');
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { selectedValues: nextValues }
        }));
    }

    private setOpen(nextOpen: boolean): void {
        this.open = this.disabled ? false : nextOpen;
        this.syncMenuButtonState();
    }

    private syncMenuButtonState(): void {
        if (this.menuButtonElement) {
            this.menuButtonElement.checked = this.open;
        }
    }
}

const okFvChipSelector = FvChipSelector.compose({
    baseName: 'fv-chip-selector',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvChipSelector());
export const fvChipSelectorTag = 'ok-fv-chip-selector';