import { attr } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    ButtonOptions,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ButtonAppearance } from './types';

export type { Button };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-button': Button;
    }
}

/**
 * A nimble-styled HTML button
 */
class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance!: ButtonAppearance;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }
    }

    public defaultSlottedContentChanged(): void {
        this.checkForEmptyText();
    }

    private checkForEmptyText(): void {
        const hasTextContent = this.defaultSlottedContent.some(
            x => (x.textContent ?? '').trim().length !== 0
        );
        if (hasTextContent) {
            this.control.classList.remove('empty-text');
        } else {
            this.control.classList.add('empty-text');
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
    baseClass: FoundationButton,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
