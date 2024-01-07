import { attr } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'card-button';
export const cardButtonTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [cardButtonTag]: CardButton;
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
    baseName,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCardButton());
