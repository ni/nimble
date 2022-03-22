import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';
import { check16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
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
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    checkedIndicator: check16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
