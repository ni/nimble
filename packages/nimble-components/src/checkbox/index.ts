import {
    DesignSystem,
    Checkbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';
import { controlsCheckboxCheck16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { Checkbox };

const nimbleCheckbox = Checkbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    template,
    styles,
    checkedIndicator: controlsCheckboxCheck16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
