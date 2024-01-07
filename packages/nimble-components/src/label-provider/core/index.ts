import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { DesignTokensFor, LabelProviderBase } from '../base';
import {
    popupDismissLabel,
    numericDecrementLabel,
    numericIncrementLabel,
    errorIconLabel,
    warningIconLabel,
    informationIconLabel
} from './label-tokens';

const baseName = 'label-provider-core';
export const labelProviderCoreTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [labelProviderCoreTag]: LabelProviderCore;
    }
}

const supportedLabels = {
    popupDismiss: popupDismissLabel,
    numericDecrement: numericDecrementLabel,
    numericIncrement: numericIncrementLabel,
    errorIcon: errorIconLabel,
    warningIcon: warningIconLabel,
    informationIcon: informationIconLabel
} as const;

/**
 * Core label provider for Nimble
 */
export class LabelProviderCore
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'popup-dismiss' })
    public popupDismiss: string | undefined;

    @attr({ attribute: 'numeric-decrement' })
    public numericDecrement: string | undefined;

    @attr({ attribute: 'numeric-increment' })
    public numericIncrement: string | undefined;

    @attr({ attribute: 'error-icon' })
    public errorIcon: string | undefined;

    @attr({ attribute: 'warning-icon' })
    public warningIcon: string | undefined;

    @attr({ attribute: 'information-icon' })
    public informationIcon: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleLabelProviderCore());
