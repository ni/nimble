import { attr } from '@microsoft/fast-element';
import { DesignSystem, DesignToken } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '../base';
import {
    popupDismissLabel,
    numericDecrementLabel,
    numericIncrementLabel
} from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-core': LabelProviderCore;
    }
}

/**
 * Core label provider for Nimble
 */
export class LabelProviderCore extends LabelProviderBase {
    @attr({ attribute: 'popup-dismiss' })
    public popupDismiss?: string;

    @attr({ attribute: 'numeric-decrement' })
    public numericDecrement?: string;

    @attr({ attribute: 'numeric-increment' })
    public numericIncrement?: string;

    protected override readonly supportedLabels: {
        [P in keyof LabelProviderCore]?: DesignToken<string>;
    } = {
            popupDismiss: popupDismissLabel,
            numericDecrement: numericDecrementLabel,
            numericIncrement: numericIncrementLabel
        };
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName: 'label-provider-core'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderCore());
export const labelProviderCoreTag = DesignSystem.tagFor(LabelProviderCore);
