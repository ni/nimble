import { attr, customElement, nullableNumberConverter } from '@ni/fast-element';
import {
    Button as FoundationButton,
} from '@ni/fast-foundation';
import type {
    ButtonPattern,
    ButtonAppearanceVariantPattern
} from '../patterns/button/types';
import { styles } from './styles';
import { template } from './template';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const buttonTag = 'nimble-button';

declare global {
    interface HTMLElementTagNameMap {
        [buttonTag]: Button;
    }
}

/**
 * A nimble-styled HTML button
 */
@customElement({
    name: buttonTag,
    template: template(elementDefinitionContextMock, {}),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
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

    /**
     * @public
     * @remarks
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;
}
