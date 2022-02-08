import { attr, html, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    Switch as FoundationSwitch,
    SwitchOptions
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
    public appearance!: ButtonAppearance;

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

    public readonly control!: HTMLElement;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }
    }
}

const nimbleToggleButton = ToggleButton.compose<SwitchOptions>({
    baseName: 'toggle-button',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToggleButton());
