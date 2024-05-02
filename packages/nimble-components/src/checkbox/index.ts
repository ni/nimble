import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions
} from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { check16X16, minus16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { checkboxTemplate as template } from './template';
import type { TabIndexOverride } from '../patterns/tab-index-override/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-checkbox': Checkbox;
    }
}

/**
 * A nimble-styled checkbox control.
 */
export class Checkbox extends FoundationCheckbox implements TabIndexOverride {
    /** @internal */
    @observable
    public tabIndexOverride = 0;
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
