import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { alarmActive16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

class TextField extends FoundationTextField {
    /**
     * Whether or not the text field is in an invalid state.
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

        // https://github.com/microsoft/fast/issues/5116
        // Will hopefully be able to set this to the end slot in compose in the future
        this.end.innerHTML = `${alarmActive16X16.data}`;
    }
}

const nimbleTextField = TextField.compose({
    baseName: 'text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
