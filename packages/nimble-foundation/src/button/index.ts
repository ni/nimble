import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Button as FoundationButton,
} from '@microsoft/fast-foundation';
import type {
    ButtonPattern,
    ButtonAppearanceVariantPattern
} from '../patterns/button/types';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';

/**
 * A nimble-styled HTML button
 */
export class Button
    extends FoundationButton
    implements ButtonPattern, ButtonAppearanceVariantPattern {
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
export const buttonTag = DesignSystem.tagFor(Button);
