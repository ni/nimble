import { attr } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    ButtonOptions,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ButtonAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-button': Button;
    }
}

/**
 * A nimble-styled HTML button
 */
export class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.Outline;

    /**
     * Specify as 'true' to hide the text content of the button. The button will
     * become square, and the text content will be used as the label of the button
     * for accessibility purposes.
     *
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;
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
const nimbleButton = Button.compose<ButtonOptions>({
    baseName: 'button',
    baseClass: FoundationButton,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
