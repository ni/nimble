import { attr } from '@microsoft/fast-element';
import { DesignSystem, DesignToken } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '../base';
import {
    alertDismissLabel,
    numberFieldDecrementLabel,
    numberFieldIncrementLabel
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
    @attr({ attribute: 'alert-dismiss' })
    public alertDismiss?: string;

    @attr({ attribute: 'number-field-decrement' })
    public numberFieldDecrement?: string;

    @attr({ attribute: 'number-field-increment' })
    public numberFieldIncrement?: string;

    public constructor() {
        const supportedLabels: {
            [P in keyof LabelProviderCore]?: DesignToken<string>;
        } = {
            alertDismiss: alertDismissLabel,
            numberFieldDecrement: numberFieldDecrementLabel,
            numberFieldIncrement: numberFieldIncrementLabel
        };
        super(supportedLabels);
    }
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName: 'label-provider-core'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderCore());
export const labelProviderCoreTag = DesignSystem.tagFor(LabelProviderCore);
