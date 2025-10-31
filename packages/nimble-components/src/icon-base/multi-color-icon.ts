import type { CSSDesignToken } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { Icon } from '.';

/**
 * Configuration for a single layer in a multi-color icon
 */
export interface LayerConfig {
    /** CSS class name used in the SVG (e.g., 'cls-1', 'cls-2') */
    layerClass: string;
    /** Design token to use for this layer's color */
    colorToken: CSSDesignToken<string>;
}

/**
 * Base class for multi-color icons with theme-aware layers.
 *
 * Multi-color icons have different regions that use different theme colors.
 * Each layer corresponds to a CSS class in the icon's SVG (cls-1, cls-2, etc.)
 * and is mapped to a design token for theming.
 *
 * @example
 * ```ts
 * export class IconCirclePartialBroken extends MultiColorIcon {
 *     public constructor() {
 *         super(circlePartialBroken16X16, [
 *             { layerClass: 'cls-1', colorToken: graphGridlineColor },
 *             { layerClass: 'cls-2', colorToken: warningColor }
 *         ]);
 *     }
 * }
 * ```
 */
export class MultiColorIcon extends Icon {
    /** @internal */
    protected readonly layers: LayerConfig[] = [];

    /**
     * @param icon - The icon SVG data from nimble-tokens
     * @param layers - Array of layer configurations mapping SVG classes to design tokens
     */
    public constructor(icon: NimbleIcon, layers: LayerConfig[]) {
        super(icon);
        this.layers = layers;
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.applyLayerColors();
    }

    /**
     * Applies the configured layer colors as CSS custom properties
     * @internal
     */
    private applyLayerColors(): void {
        this.layers.forEach((layer, index) => {
            this.style.setProperty(
                `--ni-nimble-icon-layer-${index + 1}-color`,
                `var(${layer.colorToken.cssCustomProperty})`
            );
        });
    }
}
