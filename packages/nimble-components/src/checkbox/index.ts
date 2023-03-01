import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';
import { check16X16, minus16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-checkbox': Checkbox;
    }
}

/**
 * A nimble-styled checkbox control.
 */
export class Checkbox extends FoundationCheckbox {}

const nimbleCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    baseClass: FoundationCheckbox,
    template,
    styles,
    checkedIndicator: check16X16.data,
    indeterminateIndicator: minus16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
export const checkboxTag = DesignSystem.tagFor(Checkbox);
