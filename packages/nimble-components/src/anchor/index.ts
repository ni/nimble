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

    /**
     * @internal
     */
    public container!: HTMLElement;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateContentEditable();
    }

    /**
     * @internal
     * We want our anchor to behave like a native anchor when in a content-editable
     * region, i.e. not operable or focusable. The most reliable way to achieve this is
     * to synchronize our shadow DOM's content-editable state with that of the host.
     * We must look at the host's read-only isContentEditable property, which factors
     * in any inherited value. Unfortunately, there is no way for us to detect when its
     * value has changed, so the best we can do is to re-sync on specific events.
     * This has shortcomings, e.g. if isContentEditable goes from true to false, our
     * anchor will remain un-tabable until a mouseenter triggers a re-sync.
     */
    public updateContentEditable(): void {
        if (this.isContentEditable) {
            this.container.setAttribute('contenteditable', '');
        } else {
            this.container.removeAttribute('contenteditable');
        }
    }
}

// FoundationAnchor already applies the StartEnd mixin, so we don't need to do it here.

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
