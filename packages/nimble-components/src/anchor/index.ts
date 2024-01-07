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

const baseName = 'anchor';
export const anchorTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [anchorTag]: Anchor;
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

    /**
     * @public
     * @remarks
     * HTML Attribute: contenteditable
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable
     *
     * Ideally, proper support for contenteditable should come from FAST.
     * I have filed bug https://github.com/microsoft/fast/issues/6870 to them.
     * If/when it is fixed, we can remove this workaround.
     */
    @attr({ attribute: 'contenteditable' })
    public override contentEditable!: string;
}

// FoundationAnchor already applies the StartEnd mixin, so we don't need to do it here.

const nimbleAnchor = Anchor.compose<AnchorOptions>({
    baseName,
    baseClass: FoundationAnchor,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchor());
