import { attr, customElement } from '@ni/fast-element';
import { AnchorBase } from '../anchor-base';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    type ButtonPattern,
    type ButtonAppearanceVariantPattern
} from '../patterns/button/types';
import { styles } from './styles';
import { template } from './template';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const anchorButtonTag = 'nimble-anchor-button';

declare global {
    interface HTMLElementTagNameMap {
        [anchorButtonTag]: AnchorButton;
    }
}

/**
 * A nimble-styled anchor button
 */
@customElement({
    name: anchorButtonTag,
    template: template(elementDefinitionContextMock, {}),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
export class AnchorButton
    extends AnchorBase
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
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;
}
