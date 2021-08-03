import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
    CheckboxOptions,
    checkboxTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

const nimbleCheckbox = FoundationCheckbox.compose<CheckboxOptions>({
    baseName: 'checkbox',
    template,
    styles,
    checkedIndicator: `
        <svg
            part="checked-indicator"
            class="checked-indicator"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M16,3.0909,5.09193,14,.001,8.909,2.18236,6.72658,5.18244,9.72666,13.9091,1Z"/>
        </svg>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckbox());
