import { attr, observable } from '@microsoft/fast-element';
import {
    applyMixins,
    ButtonOptions,
    DelegatesARIAButton,
    DesignSystem,
    StartEnd,
    Switch as FoundationSwitch
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { ButtonPattern } from '../patterns/button/types';
import { ButtonAppearance, ButtonAppearanceVariant } from './types';
import type { TabIndexOverride } from '../patterns/tab-index-override/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toggle-button': ToggleButton;
    }
}

/**
 * A nimble-styled toggle button control.
 */
export class ToggleButton
    extends FoundationSwitch
    implements ButtonPattern, TabIndexOverride {
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

    /** @internal */
    public readonly control!: HTMLElement;

    /** @internal */
    @observable
    public tabIndexOverride = 0;
}
applyMixins(ToggleButton, StartEnd, DelegatesARIAButton);
export interface ToggleButton extends StartEnd, DelegatesARIAButton {}

const nimbleToggleButton = ToggleButton.compose<ButtonOptions>({
    baseName: 'toggle-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToggleButton());
export const toggleButtonTag = 'nimble-toggle-button';
