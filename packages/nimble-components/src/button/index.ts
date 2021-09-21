import { attr } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ButtonAppearance } from './types';
import { appendIconSlotElement } from '../icons/icon-helpers';

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

    private iconSlotContainerElement: HTMLElement;
    private iconSlotElement: HTMLSlotElement;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }

        const slotElements = appendIconSlotElement(this.start);
        this.iconSlotContainerElement = slotElements.container;
        this.iconSlotElement = slotElements.slot;

        this.iconSlotElement.addEventListener('slotchange', this.iconChanged);
        this.iconChanged();
    }

    public disconnectedCallback(): void {
        this.iconSlotElement.removeEventListener(
            'slotchange',
            this.iconChanged
        );
    }

    private readonly iconChanged = (): void => {
        if (this.iconSlotElement.assignedNodes().length > 0) {
            this.iconSlotContainerElement.classList.add('iconContent');
        } else {
            this.iconSlotContainerElement.classList.remove('iconContent');
        }

        this.updateContentState();
    };

    private updateContentState(): void {
        if (this.iconSlotElement.assignedNodes().length > 0) {
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
const nimbleButton = Button.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
