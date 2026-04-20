import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    FvSearchInputAppearance,
    type FvSearchInputAppearance as FvSearchInputAppearanceType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-search-input': FvSearchInput;
    }
}

/**
 * A compact search input with a built-in clear affordance.
 */
export class FvSearchInput extends FoundationElement {
    @attr
    public placeholder = '';

    @attr
    public value = '';

    @attr
    public appearance: FvSearchInputAppearanceType = FvSearchInputAppearance.outline;

    public handleInput(event: Event): boolean {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
        return true;
    }

    public handleChange(event: Event): boolean {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
        return true;
    }

    /**
     * Clears the current value, restores focus to the text input, and
     * dispatches synthetic `input` and `change` events on the host so
     * consumers observe the same event contract as a manual edit.
     * The inner <input> value is updated on the next FAST render cycle
     * via the `:value` template binding.
     */
    public clear(): boolean {
        if (this.value === '') {
            return true;
        }

        this.value = '';
        this.shadowRoot?.querySelector<HTMLInputElement>('.search-input')?.focus();
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        return true;
    }
}

const okFvSearchInput = FvSearchInput.compose({
    baseName: 'fv-search-input',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSearchInput());
export const fvSearchInputTag = 'ok-fv-search-input';