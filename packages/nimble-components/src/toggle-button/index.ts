import { attr, customElement, nullableNumberConverter } from '@ni/fast-element';
import {
    applyMixins,
    DelegatesARIAButton,
    StartEnd,
    Switch as FoundationSwitch
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { ButtonPattern } from '../patterns/button/types';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const toggleButtonTag = 'nimble-toggle-button';

declare global {
    interface HTMLElementTagNameMap {
        [toggleButtonTag]: ToggleButton;
    }
}

/**
 * A nimble-styled toggle button control.
 */
@customElement({
    name: toggleButtonTag,
    template: template(elementDefinitionContextMock, {}),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
export class ToggleButton extends FoundationSwitch implements ButtonPattern {
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

    /** @internal */
    public readonly control!: HTMLElement;

    /**
     * @internal
     */
    public get resolvedTabindex(): string | undefined {
        const tabIndex = this.tabIndex ?? 0;
        return this.disabled ? undefined : `${tabIndex}`;
    }
}
applyMixins(ToggleButton, StartEnd, DelegatesARIAButton);
export interface ToggleButton extends StartEnd, DelegatesARIAButton {}
