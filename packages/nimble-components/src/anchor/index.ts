import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor,
    AnchorOptions
} from '@microsoft/fast-foundation';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';
import type { AnchorAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor': Anchor;
    }
}

/**
 * A nimble-styled anchor
 */
export class Anchor extends AnchorBase {
    /**
     * @public
     * @remarks
     * HTML Attribute: underline-hidden
     */
    @attr({ attribute: 'underline-hidden', mode: 'boolean' })
    public underlineHidden = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: AnchorAppearance;
}

const nimbleAnchor = Anchor.compose<AnchorOptions>({
    baseName: 'anchor',
    baseClass: FoundationAnchor,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchor());
export const anchorTag = DesignSystem.tagFor(Anchor);
