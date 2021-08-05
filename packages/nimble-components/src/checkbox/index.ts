import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';
import { nimbleIconNames } from '../shared/icon-font';

import { styles } from './styles';

const nimbleCheckbox = FoundationCheckbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    template,
    styles,
    checkedIndicator: `
        <i class="checked-indicator ${nimbleIconNames.Succeeded16x16}"></i>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
