import { attr } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    ButtonOptions,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import type { ButtonPattern } from '../patterns/button/types';
import { styles } from './styles';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-button': Button;
    }
}

/**
 * A nimble-styled HTML button
 */
export class Button extends FoundationButton implements ButtonPattern {
    /**
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.outline;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance-variant
     */
    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: ButtonAppearanceVariant;

    /**
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
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
