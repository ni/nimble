import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions
} from '@microsoft/fast-foundation';
import { check16X16, minus16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { template } from './template';
import type { ErrorPattern } from '../patterns/error/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-checkbox': Checkbox;
    }
}

/**
 * A nimble-styled checkbox control.
 */
export class Checkbox extends FoundationCheckbox implements ErrorPattern {
    /**
     * @public
     * @remarks
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /**
     * @internal
     */
    public get resolvedTabindex(): string | undefined {
        const tabIndex = this.tabIndex ?? 0;
        return this.disabled ? undefined : `${tabIndex}`;
    }
}

const nimbleCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    baseClass: FoundationCheckbox,
    template,
    styles,
    checkedIndicator: check16X16.data,
    indeterminateIndicator: minus16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
export const checkboxTag = 'nimble-checkbox';
