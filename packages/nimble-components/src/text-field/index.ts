import { DesignSystem, TextField as FoundationTextField, textFieldTemplate as template } from '@microsoft/fast-foundation';
import { textFieldStyles as styles } from '@microsoft/fast-components';

const nimbleTextField = FoundationTextField.compose({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
