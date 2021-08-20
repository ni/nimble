import {
    DesignSystem,
    TextField as FoundationTextField,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const nimbleTextField = FoundationTextField.compose({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
