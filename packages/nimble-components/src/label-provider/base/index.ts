import { DesignToken, FoundationElement } from '@ni/fast-foundation';
import { type Notifier, Observable, type Subscriber } from '@ni/fast-element';
import { themeProviderTag } from '../../theme-provider';

export interface SupportedLabelTokens {
    [key: string]: DesignToken<string>;
}

export type DesignTokensFor<ObjectT> = {
    [key in keyof ObjectT]: string | undefined;
};

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase<
    SupportedLabels extends SupportedLabelTokens
>
    extends FoundationElement
    implements Subscriber {
    protected abstract supportedLabels: SupportedLabels;

    private readonly propertyNotifier: Notifier = Observable.getNotifier(this);
    private themeProvider?: HTMLElement;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeThemeProvider();
        this.propertyNotifier.subscribe(this);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.propertyNotifier.unsubscribe(this);
        if (this.themeProvider) {
            for (const token of Object.values(this.supportedLabels)) {
                token.deleteValueFor(this.themeProvider);
            }
            this.themeProvider = undefined;
        }
    }

    public handleChange(
        _element: LabelProviderBase<SupportedLabels>,
        property: keyof SupportedLabels & string
    ): void {
        if (this.isSupportedLabel(property)) {
            const token = this.supportedLabels[property];
            const value = this[property];
            if (this.themeProvider) {
                if (value === null || value === undefined) {
                    token.deleteValueFor(this.themeProvider);
                } else {
                    token.setValueFor(this.themeProvider, value);
                }
            }
        }
    }

    private isSupportedLabel<Property extends keyof SupportedLabels & string>(
        property: Property
    ): this is this
    & DesignTokensFor<SupportedLabels>
    & { supportedLabels: Pick<SupportedLabelTokens, Property> } {
        return this.supportedLabels[property] !== undefined;
    }

    private initializeThemeProvider(): void {
        this.themeProvider = this.closest(themeProviderTag) ?? undefined;
        if (this.themeProvider) {
            for (const [property, token] of Object.entries(
                this.supportedLabels
            )) {
                if (this.isSupportedLabel(property)) {
                    const value = this[property];
                    if (value === null || value === undefined) {
                        token.deleteValueFor(this.themeProvider);
                    } else {
                        token.setValueFor(this.themeProvider, value);
                    }
                }
            }
        }
    }
}
