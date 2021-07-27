import { attr } from '@microsoft/fast-element';
import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ButtonAppearance } from './types';

export type { Button };

class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }
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
const nimbleButton = Button.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());