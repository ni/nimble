import {
    DesignSystem,
    DesignToken,
    DesignTokenValue,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { theme } from './design-tokens';
import type { NimbleTheme } from './types';

function designToken<T>(token: DesignToken<T>) {
    return (source: NimbleThemeProvider, key: string): void => {
        source[`${key}Changed`] = function keyChanged(
            this: NimbleThemeProvider,
            _prev: T | undefined,
            next: T | undefined
        ): void {
            if (next !== undefined && next !== null) {
                token.setValueFor(this, next as DesignTokenValue<T>);
            } else {
                token.deleteValueFor(this);
            }
        };
    };
}

export type { NimbleThemeProvider };
/**
 * The NimbleThemeProvider implementation
 * @internal
 */
class NimbleThemeProvider extends FoundationElement {
    @attr({
        attribute: 'theme'
    })
    @designToken(theme)
    public theme: NimbleTheme;
}

const nimbleDesignSystemProvider = NimbleThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
