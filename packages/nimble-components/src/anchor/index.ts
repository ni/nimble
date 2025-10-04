import { attr, customElement, nullableNumberConverter } from '@ni/fast-element';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';
import type { AnchorAppearance } from './types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const anchorTag = 'nimble-anchor';

declare global {
    interface HTMLElementTagNameMap {
        [anchorTag]: Anchor;
    }
}

/**
 * A nimble-styled anchor
 */
@customElement({
    name: anchorTag,
    template: template(elementDefinitionContextMock, {}),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
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
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

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
