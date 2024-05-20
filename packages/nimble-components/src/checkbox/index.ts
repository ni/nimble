import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions
} from '@microsoft/fast-foundation';
import { check16X16, minus16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-checkbox': Checkbox;
    }
}

/**
 * A nimble-styled checkbox control.
 */
export class Checkbox extends FoundationCheckbox {
    /**
     * @public
     * @remarks
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * @internal
     */
    public getEffectiveTabIndex(): number | null {
        // prettier-ignore
        return this.disabled ? null : (this.tabIndex ?? 0);
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
