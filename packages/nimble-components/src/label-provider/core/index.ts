import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { type DesignTokensFor, LabelProviderBase } from '../base';
import {
    popupDismissLabel,
    numericDecrementLabel,
    numericIncrementLabel,
    popupIconErrorLabel,
    popupIconWarningLabel,
    popupIconInformationLabel,
    filterSearchLabel,
    filterNoResultsLabel,
    loadingLabel,
    scrollBackwardLabel,
    scrollForwardLabel
} from './label-tokens';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-core': LabelProviderCore;
    }
}

const supportedLabels = {
    popupDismiss: popupDismissLabel,
    numericDecrement: numericDecrementLabel,
    numericIncrement: numericIncrementLabel,
    popupIconError: popupIconErrorLabel,
    popupIconWarning: popupIconWarningLabel,
    popupIconInformation: popupIconInformationLabel,
    filterSearch: filterSearchLabel,
    filterNoResults: filterNoResultsLabel,
    loading: loadingLabel,
    scrollBackward: scrollBackwardLabel,
    scrollForward: scrollForwardLabel
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

    @attr({ attribute: 'popup-icon-error' })
    public popupIconError: string | undefined;

    @attr({ attribute: 'popup-icon-warning' })
    public popupIconWarning: string | undefined;

    @attr({ attribute: 'popup-icon-information' })
    public popupIconInformation: string | undefined;

    @attr({ attribute: 'filter-search' })
    public filterSearch: string | undefined;

    @attr({ attribute: 'filter-no-results' })
    public filterNoResults: string | undefined;

    @attr({ attribute: 'loading' })
    public loading: string | undefined;

    @attr({ attribute: 'scroll-backward' })
    public scrollBackward: string | undefined;

    @attr({ attribute: 'scroll-forward' })
    public scrollForward: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName: 'label-provider-core',
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderCore());
export const labelProviderCoreTag = 'nimble-label-provider-core';
