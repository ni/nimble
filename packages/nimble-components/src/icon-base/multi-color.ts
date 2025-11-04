import type { CSSDesignToken } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { Icon } from '.';

export const MAX_ICON_LAYERS = 6;

/**
 * Base class for multi-color icon components.
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

    /**
     * Gets the layer colors for testing purposes.
     * @internal
     */
    public getLayerColors(): readonly CSSDesignToken<string>[] {
        return this.layerColors;
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateLayerColors();
    }

    /**
     * Sets CSS custom properties for each layer color on the host element.
     * @internal
     */
    private updateLayerColors(): void {
        const colors = this.layerColors.slice(0, MAX_ICON_LAYERS);
        for (let i = 0; i < colors.length; i++) {
            const token = colors[i]!;
            this.style.setProperty(
                `--ni-nimble-icon-layer-${i + 1}-color`,
                `var(${token.cssCustomProperty})`
            );
        }
    }
}
