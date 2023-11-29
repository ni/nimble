import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    DelegatesARIAButton,
    DesignSystem,
    StartEnd,
    Switch as FoundationSwitch
} from '@microsoft/fast-foundation';
import type { ButtonPattern } from '../patterns/button/types';
import { ButtonAppearance } from './types';

/**
 * A nimble-styled toggle button control.
 */
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
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    /** @internal */
    public readonly control!: HTMLElement;
}
applyMixins(ToggleButton, StartEnd, DelegatesARIAButton);
export interface ToggleButton extends StartEnd, DelegatesARIAButton {}
export const toggleButtonTag = DesignSystem.tagFor(ToggleButton);
