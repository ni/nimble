import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ButtonOptions,
    DesignSystem,
    StartEnd,
    Switch as FoundationSwitch
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ButtonAppearance } from '../patterns/button/types';

export type { ToggleButton };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toggle-button': ToggleButton;
    }
}

/**
 * A nimble-styled toggle button control.
 */
class ToggleButton extends FoundationSwitch {
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

    /** @internal */
    public readonly control!: HTMLElement;
}
applyMixins(ToggleButton, StartEnd);

const nimbleToggleButton = ToggleButton.compose<ButtonOptions>({
    baseName: 'toggle-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToggleButton());
