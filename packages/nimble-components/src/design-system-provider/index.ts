import { DesignToken, DesignTokenValue, FoundationElement } from '@microsoft/fast-foundation';
import {
    css,
    html,
} from '@microsoft/fast-element';

import * as tokens from './design-tokens';

function designToken<T>(token: DesignToken<T>) {
    return (source: DesignSystemProvider, key: string): void => {
        source[`${key}Changed`] = function keyChanged(
            this: DesignSystemProvider,
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
 * The nimble DesignSystemProvider implementation
 * @internal
 */
class DesignSystemProvider extends FoundationElement {
    @designToken(tokens.fillColor)
    public fillColor: string;

    @designToken(tokens.fillColorHover)
    public fillColorHover: string;

    @designToken(tokens.outlineColor)
    public outlineColor: string;

    @designToken(tokens.outlineColorHover)
    public outlineColorHover: string;

    @designToken(tokens.controlHeight)
    public controlHeight: string;

    @designToken(tokens.standardPadding)
    public standardPadding: string;

    @designToken(tokens.fontFamily)
    public fontFamily: string;

    @designToken(tokens.labelFontFamily)
    public labelFontFamily: string;

    @designToken(tokens.labelFontSize)
    public labelFontSize: string;

    @designToken(tokens.fontColor)
    public fontColor: string;
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
export const nimbleDesignSystemProvider = DesignSystemProvider.compose({
    baseName: 'design-system-provider',
    styles,
    template
});