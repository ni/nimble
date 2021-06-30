import { DesignSystem, DesignToken, DesignTokenValue, FoundationElement } from '@microsoft/fast-foundation';
import {
    attr,
    css,
    html,
} from '@microsoft/fast-element';

import * as tokens from './design-tokens';
import { NimbleTheme } from './themes';

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

/**
 * The NimbleThemeProvider implementation
 * @internal
 */
class NimbleThemeProvider extends FoundationElement {
    @attr({
        attribute: 'theme',
    })
    @designToken(tokens.theme)
    public theme: NimbleTheme;
}

const styles = css`
    :host {
        display: inline-block;
    }`;

const template = html`
    <slot></slot>
    `;

/**
A function that returns a registration for configuring the component with a DesignSystem. *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-design-system-provider\>
 */
const nimbleDesignSystemProvider = NimbleThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDesignSystemProvider());