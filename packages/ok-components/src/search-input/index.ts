import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    SearchInputAppearance,
    type SearchInputAppearance as SearchInputAppearanceType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-search-input': SearchInput;
    }
}

/**
 * A compact search input with a built-in clear affordance.
 */
export class SearchInput extends FoundationElement {
    @attr
    public placeholder = 'Search';

    @attr
    public value = '';

    @attr
    public appearance: SearchInputAppearanceType = SearchInputAppearance.outline;

    private inputElement: HTMLInputElement | null = null;

    public handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
    }

    public handleChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
    }

    public captureInputRef(element: HTMLInputElement | null): void {
        this.inputElement = element;
    }

    public clear(): void {
        if (this.value === '') {
            return;
        }

        this.value = '';
        this.inputElement?.focus();
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
}

const okSearchInput = SearchInput.compose({
    baseName: 'search-input',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okSearchInput());
export const searchInputTag = 'ok-search-input';