import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Picker as FoundationPicker,
    pickerTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-picker': Picker;
    }
}

/**
 * A nimble-styled HTML Picker
 */
export class Picker extends FoundationPicker {
    /**
     * Whether the Picker is read-only.
     *
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: 'readonly', mode: 'boolean' })
    public readOnly = false;

    public override handleItemInvoke(e: Event): boolean {
        if (this.readOnly) {
            return false;
        }

        return super.handleItemInvoke(e);
    }
}

const nimblePicker = Picker.compose({
    baseName: 'picker',
    baseClass: FoundationPicker,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimblePicker());
