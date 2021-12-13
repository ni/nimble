import {
    DesignSystem,
    TextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { statusAlarmActive16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { TextField };

/**
 * A nimble-styed HTML text input
 */

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: statusAlarmActive16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
