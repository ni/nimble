import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { themeProviderTag } from '../../theme-provider';

/**
 * Base class for label providers
 */
export abstract class LabelProviderBase extends FoundationElement {
    private readonly deferredTokenUpdates: Map<
    DesignToken<string>,
    string | undefined
    > = new Map();

    private themeProvider?: HTMLElement;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateThemeProvider();
    }

    public override disconnectedCallback(): void {
        this.themeProvider = undefined;
    }

    /**
     * Called from the [tokenPropertyName]Changed() methods to update the backing design token
     * @param token DesignToken for the label
     * @param newValue New value for the label
     */
    protected handleTokenChanged(
        token: DesignToken<string>,
        newValue: string | undefined
    ): void {
        if (this.themeProvider) {
            this.updateTokenValue(this.themeProvider, token, newValue);
        } else {
            // For Blazor this method is called before this element is in the DOM. So cache the token value sets, and
            // apply them after we're connected
            this.deferredTokenUpdates.set(token, newValue);
        }
    }

    private updateTokenValue(
        target: HTMLElement,
        token: DesignToken<string>,
        newValue: string | undefined
    ): void {
        if (newValue !== undefined && newValue !== null) {
            token.setValueFor(target, newValue);
        } else {
            token.deleteValueFor(target);
        }
    }

    private updateThemeProvider(): void {
        this.themeProvider = this.closest(themeProviderTag) ?? undefined;
        if (this.themeProvider) {
            for (const entry of this.deferredTokenUpdates.entries()) {
                this.updateTokenValue(this.themeProvider, entry[0], entry[1]);
            }
            this.deferredTokenUpdates.clear();
        }
    }
}
