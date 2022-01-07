import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { statusAlarmActive16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { TextField };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-field': TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
class TextField extends FoundationTextField {}

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    baseClass: FoundationTextField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: statusAlarmActive16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
