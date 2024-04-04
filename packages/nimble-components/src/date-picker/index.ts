import {
    DesignSystem, FoundationElement
} from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-date-picker': DatePicker;
    }
}

/**
 * A nimble-styled HTML button
 */
export class DatePicker
    extends FoundationElement {
    @observable
    public value: string;

    @observable
    public locale: string;

    public constructor() {
        super();
        const dateString = new Date(Date.now()).toISOString();
        const removeIndex = dateString.indexOf('T');
        this.value = dateString.substring(0, removeIndex);

        this.locale = 'en-US';
    }
}

/**
 * A function that returns a nimble-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
const nimbleDatePicker = DatePicker.compose({
    baseName: 'date-picker',
    baseClass: FoundationElement,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDatePicker());
export const datePickerTag = 'nimble-date-picker';
