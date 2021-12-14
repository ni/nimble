import {
    DesignSystem,
    DesignToken,
    DesignTokenValue,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr, css } from '@microsoft/fast-element';
import { template } from './template';
import { theme } from './design-tokens';
import type { NimbleTheme } from './themes';

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
 * The NimbleThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
class NimbleThemeProvider extends FoundationElement {
    @attr({
        attribute: 'theme'
    })
    @designToken(theme)
    public theme: NimbleTheme;
}

const styles = css`
    :host {
        display: contents;
    }
`;

const nimbleDesignSystemProvider = NimbleThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
