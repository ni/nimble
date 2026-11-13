import { attr, DOM, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import { diacriticInsensitiveStringNormalizer } from '@ni/nimble-components/dist/esm/utilities/models/string-normalizers';
import { styles } from './styles';
import { template } from './template';

export type FvChipSelectorValue = string | number | boolean | null;

export interface FvChipSelectorOption {
    readonly value: FvChipSelectorValue;
    readonly label: string;
    readonly disabled?: boolean;
}

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

    @attr({ attribute: 'aria-describedby' })
    public ariaDescribedby = '';

    @observable
    public ariaDescribedbyElements?: readonly Element[];

    @attr({ attribute: 'aria-errormessage' })
    public ariaErrormessage = '';

    @observable
    public ariaErrormessageElements?: readonly Element[];

    @attr({ attribute: 'aria-invalid' })
    public override ariaInvalid = '';

    @attr({ attribute: 'selected-values' })
    public selectedValues = '';

    @attr
    public options = '';

    /** Typed, property-only options for consumers that cannot round-trip comma-separated strings. */
    @observable
    public optionItems?: readonly FvChipSelectorOption[];

    /** Typed, property-only selection used with optionItems. */
    @observable
    public selectedOptionValues?: readonly FvChipSelectorValue[];

    @attr
    public placeholder = 'Select values';

    @attr({ attribute: 'allow-custom-values', mode: 'boolean' })
    public allowCustomValues = false;

    /** Whether to filter options by their labels locally. Disable for server-filtered options. */
    @observable
    public filterLocally = true;

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

    private readonly optionsByKey = new Map<string, FvChipSelectorOption>();

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
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public activeOptionIndexChanged(): void {
        this.syncActiveOption();
    }

    /** @internal */
    public filterTextChanged(): void {
        this.activeOptionIndex = -1;
        if (this.isConnected) {
            this.dispatchEvent(new CustomEvent('filter-change', {
                bubbles: true,
                composed: true,
                detail: { filterText: this.filterText }
            }));
        }
    }

    /** @internal */
    public ariaDescribedbyChanged(): void {
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public ariaDescribedbyElementsChanged(): void {
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public ariaErrormessageChanged(): void {
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public ariaErrormessageElementsChanged(): void {
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public optionsChanged(): void {}

    /** @internal */
    public optionItemsChanged(): void {
        this.optionsByKey.clear();
        if (Array.isArray(this.optionItems)) {
            for (const option of this.optionItems as readonly unknown[]) {
                if (this.isOption(option)) {
                    const key = this.typedOptionKey(option.value);
                    if (!this.optionsByKey.has(key)) {
                        this.optionsByKey.set(key, option);
                    }
                }
            }
        }
    }

    /** @internal */
    public allowCustomValuesChanged(): void {}

    /** @internal */
    public selectedValuesChanged(): void {}

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.documentClickHandler);
        DOM.queueUpdate(() => this.syncInputAriaReferences());
    }

    /** @internal */
    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        super.disconnectedCallback();
    }

    /** @internal */
    public captureInputRef(input: HTMLInputElement | null): void {
        this.inputElement = input;
        this.syncInputAriaReferences();
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
        if (Array.isArray(this.optionItems)) {
            return (Array.isArray(this.selectedOptionValues) ? this.selectedOptionValues : [])
                .filter(value => this.isOptionValue(value))
                .map(value => this.typedOptionKey(value));
        }
        return Array.from(new Set(
            (typeof this.selectedValues === 'string' ? this.selectedValues : '')
                .split(',')
                .map(value => value.trim())
                .filter(value => value.length > 0)
        ));
    }

    /** @internal */
    public get optionList(): string[] {
        if (Array.isArray(this.optionItems)) {
            return this.optionItems
                .filter((option): option is FvChipSelectorOption => this.isOption(option))
                .map(option => this.typedOptionKey(option.value));
        }
        return Array.from(new Set(
            (typeof this.options === 'string' ? this.options : '')
                .split(',')
                .map(option => option.trim())
                .filter(option => option.length > 0)
        ));
    }

    /** @internal */
    public get visibleOptionList(): string[] {
        const selectedValues = new Set(this.selectedValueList);
        const normalizedFilter = diacriticInsensitiveStringNormalizer(
            (typeof this.filterText === 'string' ? this.filterText : '').trim()
        );

        return this.optionList.filter(option => {
            if (selectedValues.has(option)) {
                return false;
            }
            if (this.getOption(option)?.disabled) {
                return false;
            }

            return !this.filterLocally || normalizedFilter.length === 0
                || diacriticInsensitiveStringNormalizer(this.formatValue(option)).includes(normalizedFilter);
        });
    }

    /** @internal */
    public get customValueCandidate(): string {
        const trimmedFilterText = (typeof this.filterText === 'string' ? this.filterText : '').trim();

        if (Array.isArray(this.optionItems) || !this.allowCustomValues || trimmedFilterText.length === 0 || trimmedFilterText.includes(',')) {
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
    public formatValue(key: string): string {
        const option = this.getOption(key);
        if (option) {
            return option.label;
        }
        if (Array.isArray(this.optionItems) && key.startsWith('typed:')) {
            try {
                return JSON.stringify(JSON.parse(decodeURIComponent(key.slice('typed:'.length))));
            } catch {
                return key;
            }
        }
        return key;
    }

    /** @internal */
    public typedOptionKey(value: FvChipSelectorValue): string {
        return `typed:${encodeURIComponent(JSON.stringify(value))}`;
    }

    /** @internal */
    public getOptionDisabled(key: string): boolean {
        return this.getOption(key)?.disabled ?? false;
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

    private syncInputAriaReferences(): void {
        const input = (
            this.shadowRoot?.querySelector<HTMLInputElement>('.chip-selector-input') ?? this.inputElement
        ) as (HTMLInputElement & {
            ariaControlsElements?: Element[],
            ariaDescribedByElements?: Element[],
            ariaErrorMessageElements?: Element[]
        }) | null;
        if (!input) {
            return;
        }
        const list = this.shadowRoot?.getElementById(this.menuId);
        const descriptionId = this.ariaDescribedby;
        const errorMessageId = this.ariaErrormessage;
        const inputDescriptions = this.validElements([
            ...(this.ariaDescribedbyElements ?? []),
            ...this.resolveAriaIds(descriptionId)
        ], input.getRootNode());
        const inputErrors = this.validElements([
            ...(this.ariaErrormessageElements ?? []),
            ...this.resolveAriaIds(errorMessageId)
        ], input.getRootNode());
        const hostDescriptions = this.validElements(this.ariaDescribedbyElements, this.getRootNode());
        const hostErrors = this.validElements(this.ariaErrormessageElements, this.getRootNode());
        if (!descriptionId && hostDescriptions.length > 0) {
            this.ariaDescribedByElements = hostDescriptions;
        } else if (!descriptionId && (this.ariaDescribedByElements?.length ?? 0) > 0) {
            this.ariaDescribedByElements = [];
        }
        if (!errorMessageId && hostErrors.length > 0) {
            this.ariaErrorMessageElements = hostErrors;
        } else if (!errorMessageId && (this.ariaErrorMessageElements?.length ?? 0) > 0) {
            this.ariaErrorMessageElements = [];
        }
        input.ariaControlsElements = list ? [list] : [];
        input.ariaDescribedByElements = inputDescriptions;
        input.ariaErrorMessageElements = inputErrors;
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
        if (this.getOption(value)?.disabled) {
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
        const previousValues = new Map(
            (Array.isArray(this.selectedOptionValues) ? this.selectedOptionValues : [])
                .filter(value => this.isOptionValue(value))
                .map(value => [this.typedOptionKey(value), value])
        );
        const selectedOptionValues = !Array.isArray(this.optionItems)
            ? undefined
            : nextValues.map(value => {
                const option = this.getOption(value);
                return option ? option.value : previousValues.get(value);
            })
                .filter((value): value is FvChipSelectorValue => value !== undefined);
        if (selectedOptionValues !== undefined) {
            this.selectedOptionValues = selectedOptionValues;
        } else {
            this.selectedValues = nextValues.join(',');
        }
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                selectedValues: nextValues,
                ...(selectedOptionValues !== undefined ? { selectedOptionValues } : {})
            }
        }));
    }

    private getOption(key: string): FvChipSelectorOption | undefined {
        if (!Array.isArray(this.optionItems)) {
            return undefined;
        }
        return this.optionsByKey.get(key);
    }

    private isOptionValue(value: unknown): value is FvChipSelectorValue {
        return value === null || typeof value === 'string' || typeof value === 'boolean'
            || (typeof value === 'number' && Number.isFinite(value));
    }

    private isOption(value: unknown): value is FvChipSelectorOption {
        return typeof value === 'object' && value !== null
            && this.isOptionValue((value as FvChipSelectorOption).value)
            && typeof (value as FvChipSelectorOption).label === 'string'
            && ((value as FvChipSelectorOption).disabled === undefined
                || typeof (value as FvChipSelectorOption).disabled === 'boolean');
    }

    private validElements(values: readonly Element[] | undefined, root: Node): Element[] {
        const roots = new Set<Node>();
        let current = root;
        roots.add(current);
        while (current instanceof ShadowRoot) {
            current = current.host.getRootNode();
            roots.add(current);
        }
        return [...new Set(values?.filter(value => roots.has(value.getRootNode())) ?? [])];
    }

    private resolveAriaIds(ids: string): Element[] {
        const root = this.getRootNode();
        if (!(root instanceof Document || root instanceof ShadowRoot)) {
            return [];
        }
        return ids.trim().split(/\s+/)
            .map(id => root.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);
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