import { DesignToken, FoundationElement } from '@microsoft/fast-foundation';
import { themeProviderTag } from '../theme-provider';

/**
 * Base class of ThemeProvider that declares string resources / labels
 * @internal
 */
export abstract class InternationalizationBase extends FoundationElement {
    protected handleTokenChanged(token: DesignToken<string>, newValue: string | undefined): void {
        const themeProvider: HTMLElement = this.closest(themeProviderTag)!;
        if (themeProvider !== null) {
            if (newValue !== undefined && newValue !== null) {
                token.setValueFor(themeProvider, newValue);
            } else {
                token.deleteValueFor(themeProvider);
            }
        }
    }
}
