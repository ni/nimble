import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { themeProviderTag } from '../theme-provider';

/**
 * Base class of ThemeProvider that declares string resources / labels
 * @internal
 */
export abstract class InternationalizationBase extends FoundationElement {
    private readonly deferredTokenUpdates: Map<DesignToken<string>, string | undefined> = new Map();

    public override connectedCallback(): void {
        super.connectedCallback();

        const themeProvider: HTMLElement = this.closest(themeProviderTag)!;
        if (themeProvider !== null) {
            for (const entry of this.deferredTokenUpdates.entries()) {
                const token = entry[0];
                const newValue = entry[1];
                if (newValue !== undefined && newValue !== null) {
                    token.setValueFor(themeProvider, newValue);
                } else {
                    token.deleteValueFor(themeProvider);
                }
            }
            this.deferredTokenUpdates.clear();
        }
    }

    protected handleTokenChanged(token: DesignToken<string>, newValue: string | undefined): void {
        const themeProvider: HTMLElement = this.closest(themeProviderTag)!;
        if (themeProvider !== null) {
            if (newValue !== undefined && newValue !== null) {
                token.setValueFor(themeProvider, newValue);
            } else {
                token.deleteValueFor(themeProvider);
            }
        } else {
            // For Blazor this method is called before this element is in the DOM. So cache the token value sets, and
            // apply them after we're connected
            this.deferredTokenUpdates.set(token, newValue);
        }
    }
}
