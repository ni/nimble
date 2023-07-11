import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, type Subscriber } from '@microsoft/fast-element';
import { themeProviderTag } from '../../theme-provider';

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase
    extends FoundationElement
    implements Subscriber {
    protected abstract readonly supportedLabels: {
        [P in keyof LabelProviderBase]?: DesignToken<string>;
    };

    private propertyNotifier?: Notifier;
    private themeProvider?: HTMLElement;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeThemeProvider();
        this.propertyNotifier = Observable.getNotifier(this);
        this.propertyNotifier.subscribe(this);
    }

    public override disconnectedCallback(): void {
        this.propertyNotifier?.unsubscribe(this);
        if (this.themeProvider) {
            for (const token of Object.values(this.supportedLabels)) {
                token.deleteValueFor(this.themeProvider);
            }
            this.themeProvider = undefined;
        }
    }

    public handleChange(
        _element: LabelProviderBase,
        property: keyof LabelProviderBase
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
                const value = this[property as keyof LabelProviderBase];
                if (value === null || value === undefined) {
                    token.deleteValueFor(this.themeProvider);
                } else {
                    token.setValueFor(this.themeProvider, value as string);
                }
            }
        }
    }
}
