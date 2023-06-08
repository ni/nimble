import { DesignToken, DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { InternationalizationBase } from '../i18n-base';
import { styles } from '../styles';
import { template } from '../template';

const bannerDismissLabelDefault = 'Close' as const;
const numberFieldIncrementLabelDefault = 'Increment' as const;
const numberFieldDecrementLabelDefault = 'Decrement' as const;

export const bannerDismissLabel = DesignToken.create<string>({
    name: 'banner-dismiss-label',
    cssCustomPropertyName: null
}).withDefault(bannerDismissLabelDefault);

export const numberFieldIncrementLabel = DesignToken.create<string>({
    name: 'number-field-increment-label',
    cssCustomPropertyName: null
}).withDefault(numberFieldIncrementLabelDefault);

export const numberFieldDecrementLabel = DesignToken.create<string>({
    name: 'number-field-decrement-label',
    cssCustomPropertyName: null
}).withDefault(numberFieldDecrementLabelDefault);

/**
 * i18n provider: Core (non-NimbleTable related strings)
 */
export class InternationalizationCore extends InternationalizationBase {
    @attr({
        attribute: 'banner-dismiss',
        mode: 'fromView'
    })
    public bannerDismiss: string = bannerDismissLabelDefault;

    @attr({
        attribute: 'number-field-increment',
        mode: 'fromView'
    })
    public numberFieldIncrement: string = numberFieldIncrementLabelDefault;

    @attr({
        attribute: 'number-field-decrement',
        mode: 'fromView'
    })
    public numberFieldDecrement: string = numberFieldDecrementLabelDefault;

    protected bannerDismissChanged(_prev: string | undefined, next: string | undefined): void {
        this.handleTokenChanged(bannerDismissLabel, next);
    }

    protected numberFieldIncrementChanged(_prev: string | undefined, next: string | undefined): void {
        this.handleTokenChanged(numberFieldIncrementLabel, next);
    }

    protected numberFieldDecrementChanged(_prev: string | undefined, next: string | undefined): void {
        this.handleTokenChanged(numberFieldDecrementLabel, next);
    }
}

const nimbleInternationalizationCore = InternationalizationCore.compose({
    baseName: 'i18n-core',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleInternationalizationCore());
export const i18nCoreTag = DesignSystem.tagFor(InternationalizationCore);
