import { attr, html, ref } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    ButtonOptions,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
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

    public icon: HTMLSlotElement;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }
    }

    public handleIconContentChange(): void {
        this.startContainer.classList.toggle(
            'icon',
            this.icon.assignedNodes().length > 0
        );
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
const nimbleButton = Button.compose<ButtonOptions>({
    baseName: 'button',
    template,
    start: html<Button>`
        <span part="icon"}>
            <slot
                name="icon"
                ${ref('icon')}
                @slotchange="${(x): void => x.handleIconContentChange()}"
            >
            </slot>
        </span>
    `,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
