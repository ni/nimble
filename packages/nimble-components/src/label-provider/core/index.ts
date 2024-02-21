import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { DesignTokensFor, LabelProviderBase } from '../base';
import {
    popupDismissLabel,
    numericDecrementLabel,
    numericIncrementLabel,
    errorIconLabel,
    warningIconLabel,
    informationIconLabel,
    filterSearchLabel,
    filterNoResultsLabel
} from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-core': LabelProviderCore;
    }
}

const supportedLabels = {
    popupDismiss: popupDismissLabel,
    numericDecrement: numericDecrementLabel,
    numericIncrement: numericIncrementLabel,
    errorIcon: errorIconLabel,
    warningIcon: warningIconLabel,
    informationIcon: informationIconLabel,
    filterSearch: filterSearchLabel,
    filterNoResults: filterNoResultsLabel
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

    @attr({ attribute: 'filter-search' })
    public filterSearch: string | undefined;

    @attr({ attribute: 'filter-no-results' })
    public filterNoResults: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName: 'label-provider-core'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderCore());
export const labelProviderCoreTag = 'nimble-label-provider-core';
