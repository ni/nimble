import type { TextFieldAppearance } from '@microsoft/fast-components';
import { attr } from '@microsoft/fast-element';
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
class TextField extends FoundationTextField {
    /**
     * The appearance the text field should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance!: TextFieldAppearance;
}

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    baseClass: FoundationTextField,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: statusAlarmActive16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
