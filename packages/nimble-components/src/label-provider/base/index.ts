import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, type Subscriber } from '@microsoft/fast-element';
import { themeProviderTag } from '../../theme-provider';

export type DesignTokensFor<ObjectT> = {
    [key in keyof ObjectT]: string | undefined;
};

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase<
    SupportedLabels extends { [key: string]: DesignToken<string> }
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
        property: keyof LabelProviderBase<SupportedLabels>
    ): void {
        if (this.supportedLabels[property]) {
            const token = this.supportedLabels[property]!;
            const value = this[property];
            if (this.themeProvider) {
                if (value === null || value === undefined) {
                    token.deleteValueFor(this.themeProvider);
                } else {
                    token.setValueFor(this.themeProvider, value as string);
                }
            }
        }
    }

    private initializeThemeProvider(): void {
        this.themeProvider = this.closest(themeProviderTag) ?? undefined;
        if (this.themeProvider) {
            for (const [property, token] of Object.entries(
                this.supportedLabels
            )) {
                const value = this[property as keyof LabelProviderBase<SupportedLabels>];
                if (value === null || value === undefined) {
                    token.deleteValueFor(this.themeProvider);
                } else {
                    token.setValueFor(this.themeProvider, value as string);
                }
            }
        }
    }
}
