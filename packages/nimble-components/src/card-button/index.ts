import { attr, observable } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-card-button': CardButton;
    }
}

/**
 * A nimble-styled card button
 */
export class CardButton extends FoundationButton {
    /**
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: 'boolean' })
    public selected = false;

    public selectedChanged(_prev: boolean | undefined, next: boolean): void {
        this.ariaCurrent = next ? 'true' : 'false';
    }
}

/**
 * A function that returns a nimble-card-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-card-button\>
 *
 */
const nimbleCardButton = CardButton.compose({
    baseName: 'card-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCardButton());
