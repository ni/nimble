import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';
import { statusSucceeded16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

import { styles } from './styles';

export { FoundationCheckbox as Checkbox };

const nimbleCheckbox = FoundationCheckbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    template,
    styles,
    checkedIndicator: `${statusSucceeded16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
