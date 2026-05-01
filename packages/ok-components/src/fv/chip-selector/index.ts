import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-chip-selector': FvChipSelector;
    }
}

let chipSelectorId = 0;

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

    @observable
    public filterText = '';

    @observable
    public activeOptionValue = '';

    public readonly inputId = `ok-fv-chip-selector-input-${chipSelectorId += 1}`;

    public readonly labelId = `ok-fv-chip-selector-label-${chipSelectorId}`;

    public readonly menuId = `ok-fv-chip-selector-menu-${chipSelectorId}`;

    private inputElement: HTMLInputElement | null = null;

    private menuButtonElement: (HTMLElement & { checked?: boolean }) | null = null;

    public disabledChanged(): void {
        if (this.disabled) {
            this.filterText = '';
            this.open = false;
            this.activeOptionValue = '';
        }
    }

    public openChanged(): void {
        this.syncMenuButtonState();

        if (this.open) {
            this.syncActiveOptionValue();
            return;
        }

        this.activeOptionValue = '';
    }

    public filterTextChanged(): void {
        if (this.open) {
            this.syncActiveOptionValue();
        }
    }

    public optionsChanged(): void {
        if (this.open) {
            this.syncActiveOptionValue();
        }
    }

    public allowCustomValuesChanged(): void {
        if (this.open) {
            this.syncActiveOptionValue();
        }
    }

    public selectedValuesChanged(): void {
        if (this.open) {
            this.syncActiveOptionValue();
        }
    }

    public activeOptionValueChanged(): void {
        if (this.open && this.activeOptionValue.length > 0) {
            this.scrollActiveOptionIntoView();
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.documentClickHandler);
    }

    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        super.disconnectedCallback();
    }

    public captureInputRef(input: HTMLInputElement | null): void {
        this.inputElement = input;
    }

    public captureMenuButtonRef(menuButton: (HTMLElement & { checked?: boolean }) | null): void {
        this.menuButtonElement = menuButton;
        this.syncMenuButtonState();
    }

    public get selectedValueList(): string[] {
        return Array.from(new Set(
            this.selectedValues
                .split(',')
                .map(value => value.trim())
                .filter(value => value.length > 0)
        ));
    }

    public get optionList(): string[] {
        return Array.from(new Set(
            this.options
                .split(',')
                .map(option => option.trim())
                .filter(option => option.length > 0)
        ));
    }

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

    public get createOptionLabel(): string {
        return `Add '${this.customValueCandidate}'`;
    }

    public get showEmptyState(): boolean {
        return this.visibleOptionList.length === 0 && this.customValueCandidate.length === 0;
    }

    public get activeOptionId(): string | undefined {
        if (this.activeOptionValue.length === 0) {
            return undefined;
        }

        return this.activeOptionValue === this.customValueCandidate
            ? this.getCreateOptionId()
            : this.getOptionId(this.activeOptionValue);
    }

    public getOptionId(value: string): string {
        const optionIndex = this.optionList.indexOf(value);
        return `${this.menuId}-option-${optionIndex >= 0 ? optionIndex : 0}`;
    }

    public getCreateOptionId(): string {
        return `${this.menuId}-option-create`;
    }

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

    public handleMenuButtonClick(event: Event): void {
        event.stopImmediatePropagation();

        if (this.disabled) {
            return;
        }

        this.inputElement?.focus();
    }

    public handleMenuButtonChange(event: Event): void {
        event.stopImmediatePropagation();

        if (this.disabled) {
            return;
        }

        const target = event.currentTarget as HTMLElement & { checked?: boolean };
        this.setOpen(!!target.checked);
        this.inputElement?.focus();
    }

    public handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.filterText = input.value;
        this.setOpen(true);
    }

    public handleInputFocus(): void {
        if (!this.disabled) {
            this.setOpen(true);
        }
    }

    public handleInputKeydown(event: KeyboardEvent): boolean {
        if (this.disabled) {
            return true;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!this.open) {
                this.setOpen(true);
                return false;
            }

            this.moveActiveOption(1);
            return false;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!this.open) {
                this.setOpen(true);
                this.moveActiveOption(-1);
                return false;
            }

            this.moveActiveOption(-1);
            return false;
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

        if (event.key === 'Enter') {
            if (this.activeOptionValue.length > 0) {
                event.preventDefault();
                this.addValue(this.activeOptionValue);
                return false;
            }
        }

        return true;
    }

    public handleChipRemove(event: Event): void {
        const chip = event.composedPath().find(
            element => element instanceof HTMLElement && element.tagName.toLowerCase() === chipTag
        ) as HTMLElement | undefined;

        const value = chip?.getAttribute('data-chip-value')?.trim();
        if (value) {
            this.removeValue(value);
        }
    }

    public handleOptionClick(event: Event): void {
        const option = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-option-value]');
        const value = option?.getAttribute('data-option-value')?.trim();

        if (value) {
            this.addValue(value);
        }
    }

    public handleOptionPointerEnter(event: Event): void {
        const option = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-option-value]');
        const value = option?.getAttribute('data-option-value')?.trim();

        if (value) {
            this.activeOptionValue = value;
        }
    }

    private readonly documentClickHandler = (event: Event): void => {
        if (this.open && !event.composedPath().includes(this)) {
            this.setOpen(false);
        }
    };

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
    }

    private syncMenuButtonState(): void {
        if (this.menuButtonElement) {
            this.menuButtonElement.checked = this.open;
        }
    }

    private moveActiveOption(direction: 1 | -1): void {
        const visibleOptions = this.getNavigableOptionValues();
        if (visibleOptions.length === 0) {
            this.activeOptionValue = '';
            return;
        }

        const currentIndex = this.activeOptionValue.length > 0
            ? visibleOptions.indexOf(this.activeOptionValue)
            : -1;
        const fallbackIndex = direction > 0 ? -1 : 0;
        const normalizedIndex = currentIndex >= 0 ? currentIndex : fallbackIndex;
        const nextIndex = (normalizedIndex + direction + visibleOptions.length) % visibleOptions.length;
        this.activeOptionValue = visibleOptions[nextIndex] ?? '';
    }

    private syncActiveOptionValue(): void {
        const visibleOptions = this.getNavigableOptionValues();
        if (visibleOptions.length === 0) {
            this.activeOptionValue = '';
            return;
        }

        if (!visibleOptions.includes(this.activeOptionValue)) {
            this.activeOptionValue = visibleOptions[0] ?? '';
        }
    }

    private scrollActiveOptionIntoView(): void {
        const activeOptionId = this.activeOptionId;
        const activeOption = activeOptionId
            ? this.shadowRoot?.getElementById(activeOptionId)
            : null;
        activeOption?.scrollIntoView({ block: 'nearest' });
    }

    private getNavigableOptionValues(): string[] {
        const customValueCandidate = this.customValueCandidate;

        return customValueCandidate.length > 0
            ? [...this.visibleOptionList, customValueCandidate]
            : this.visibleOptionList;
    }
}

const okFvChipSelector = FvChipSelector.compose({
    baseName: 'fv-chip-selector',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvChipSelector());
export const fvChipSelectorTag = 'ok-fv-chip-selector';