import { attr, html } from '@microsoft/fast-element';
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

    private iconSlotElement: HTMLSlotElement | undefined | null;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }

        this.iconSlotElement = this.shadowRoot?.querySelector<HTMLSlotElement>('[name="icon"]');
        this.iconSlotElement?.addEventListener('slotchange', this.iconChanged);
    }

    public disconnectedCallback(): void {
        this.iconSlotElement?.removeEventListener('slotchange', this.iconChanged);
    }

    private readonly iconChanged = (): void => {
        this.updateContentState();
    };

    private updateContentState(): void {
        if (this.iconSlotElement && this.iconSlotElement.assignedNodes().length > 0) {
            const buttonContentElement = this.shadowRoot?.querySelector('.content');
            if (buttonContentElement) {
                if (this.defaultSlottedContent.length === 0) {
                    buttonContentElement.classList.add(
                        'iconWithNoButtonContent'
                    );
                } else {
                    buttonContentElement.classList.remove(
                        'iconWithNoButtonContent'
                    );
                }
            }
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
const nimbleButton = Button.compose<ButtonOptions>({
    baseName: 'button',
    template,
    start: html`<span part='icon'><slot name='icon'></slot></slot>`,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
