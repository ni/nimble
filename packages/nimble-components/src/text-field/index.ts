import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { alarmActive16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { TextField };

/**
 * A nimble-styed HTML text input
 */
class TextField extends FoundationTextField {
    /**
     * When set to true, changes the appearance of the text field to indicate its contents are invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: invalid
     */
    @attr({ mode: 'boolean' })
    public invalid: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.invalid) {
            this.invalid = false;
        }
    }
}

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: `${alarmActive16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
