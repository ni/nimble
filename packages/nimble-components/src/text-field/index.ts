import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { alarmActive16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

/**
 * A nimble-styed HTML text input
 */
type TextField = FoundationTextField;

export type { TextField };

const nimbleTextField = FoundationTextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: `${alarmActive16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
