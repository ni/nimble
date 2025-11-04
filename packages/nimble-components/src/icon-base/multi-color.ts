import type { CSSDesignToken } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { css, type ElementStyles } from '@ni/fast-element';
import { Icon } from '.';

export const MAX_ICON_LAYERS = 6;

/**
 * Creates styles for a multi-color icon by setting CSS custom properties
 * for each layer color on the :host element.
 * @param layerColors - The design tokens to use for each color layer
 * @returns ElementStyles that can be composed with the icon
 * @internal
 */
export function createMultiColorIconStyles(
    layerColors: readonly CSSDesignToken<string>[]
): ElementStyles {
    const colors = layerColors.slice(0, MAX_ICON_LAYERS);
    const layerStyles = colors
        .map(
            (token, i) => `--ni-nimble-icon-layer-${i + 1}-color: var(${token.cssCustomProperty});`
        )
        .join(' ');

    return css`
        :host {
            ${layerStyles}
        }
    `;
}

/**
 * Base class for multi-color icon components.
 *
 * @public
 * @remarks
 * This allows icons to use multiple theme colors for different visual regions
 * instead of a single severity-based color.
 *
 * @example
 * ```ts
 * export class IconCirclePartialBroken extends MultiColorIcon {
 *     protected layerColors = [graphGridlineColor, warningColor];
 *
 *     public constructor() {
 *         super(circlePartialBroken16X16);
 *     }
 * }
 *
 * const iconStyles = createMultiColorIconStyles([graphGridlineColor, warningColor]);
 * registerIcon('icon-circle-partial-broken', IconCirclePartialBroken, multiColorTemplate, iconStyles);
 * ```
 */
export abstract class MultiColorIcon extends Icon {
    /**
     * The design tokens to use for each color layer in the icon.
     * The array index corresponds to the cls-N class in the SVG (0-indexed).
     * Child classes should define this as a protected property.
     */
    protected abstract layerColors: readonly CSSDesignToken<string>[];

    public constructor(icon: NimbleIcon) {
        super(icon);
    }
}
