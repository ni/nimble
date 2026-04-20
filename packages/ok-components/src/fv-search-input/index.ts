import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    type TextFieldOptions
} from '@ni/fast-foundation';
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
export class FvSearchInput extends FoundationTextField {
    @attr
    public appearance: FvSearchInputAppearanceType = FvSearchInputAppearance.outline;

    public override handleChange(): void {
        this.value = this.control.value;
    }

    /**
     * Clears the current value, restores focus to the text input, and
     * dispatches a synthetic `input` event on the host so consumers
     * observe the same immediate value-update contract as typing.
     * The inner <input> value is updated on the next FAST render cycle
     * via the `:value` template binding.
     */
    public clear(): boolean {
        if (this.value === '') {
            return true;
        }

        this.value = '';
        this.control.focus();
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        return true;
    }
}

const okFvSearchInput = FvSearchInput.compose<TextFieldOptions>({
    baseName: 'fv-search-input',
    baseClass: FoundationTextField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSearchInput());
export const fvSearchInputTag = 'ok-fv-search-input';