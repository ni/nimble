import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '../base';
import {
    alertDismissLabel,
    numberFieldDecrementLabel,
    numberFieldIncrementLabel
} from './label-tokens';
import { coreLabelDefaults } from './label-token-defaults';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-core': LabelProviderCore;
    }
}

/**
 * Core label provider for Nimble
 */
export class LabelProviderCore extends LabelProviderBase {
    @attr({
        attribute: 'alert-dismiss',
        mode: 'fromView'
    })
    public alertDismiss: string = coreLabelDefaults.alertDismissLabel;

    @attr({
        attribute: 'number-field-decrement',
        mode: 'fromView'
    })
    public numberFieldDecrement: string = coreLabelDefaults.numberFieldDecrementLabel;

    @attr({
        attribute: 'number-field-increment',
        mode: 'fromView'
    })
    public numberFieldIncrement: string = coreLabelDefaults.numberFieldIncrementLabel;

    protected alertDismissChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(alertDismissLabel, next);
    }

    protected numberFieldDecrementChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(numberFieldDecrementLabel, next);
    }

    protected numberFieldIncrementChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(numberFieldIncrementLabel, next);
    }
}

const nimbleLabelProviderCore = LabelProviderCore.compose({
    baseName: 'label-provider-core'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderCore());
export const labelProviderCoreTag = DesignSystem.tagFor(LabelProviderCore);
