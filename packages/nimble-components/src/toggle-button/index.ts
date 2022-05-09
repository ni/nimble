import { attr } from '@microsoft/fast-element';
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
import type { IButton } from '../patterns/button/types';
import { ButtonAppearance, ButtonAppearanceAttribute } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toggle-button': ToggleButton;
    }
}

/**
 * A nimble-styled toggle button control.
 */
export class ToggleButton extends FoundationSwitch implements IButton {
    /**
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearanceAttribute = ButtonAppearance.Outline;

    /**
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    /** @internal */
    public readonly control!: HTMLElement;
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
