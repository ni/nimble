import { attr } from '@microsoft/fast-element';
import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { AnchorBase } from '../anchor-base';
import type { AnchorAppearance } from './types';

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

export const anchorTag = DesignSystem.tagFor(Anchor);
