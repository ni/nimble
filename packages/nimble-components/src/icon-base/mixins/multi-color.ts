import type { CSSDesignToken } from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { Icon } from '..';

const MAX_ICON_LAYERS = 6;

/**
 * Base class for multi-color icons.
 * This allows icons to use multiple theme colors for different visual regions
 * instead of a single severity-based color.
 *
 * @example
 * ```ts
 * export class IconCirclePartialBroken extends MultiColorIcon {
 *     public constructor() {
 *         super(circlePartialBroken16X16, [graphGridlineColor, warningColor]);
 *     }
 * }
 * ```
 */
export abstract class MultiColorIcon extends Icon {
    protected readonly layerColors: readonly CSSDesignToken<string>[];

    protected constructor(
        icon: NimbleIcon,
        layerColors: readonly CSSDesignToken<string>[]
    ) {
        super(icon);
        this.layerColors = layerColors;

        // Warn if too many layers are specified
        if (layerColors.length > MAX_ICON_LAYERS) {
            /* eslint-disable-next-line no-console */
            console.warn(
                `Multi-color icon: ${layerColors.length} layers specified but only ${MAX_ICON_LAYERS} are supported. `
                    + 'Extra layers will be ignored.'
            );
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.applyLayerColors();

        // Warn if severity is used with multi-color icons
        if (this.severity !== undefined) {
            /* eslint-disable-next-line no-console */
            console.warn(
                `${this.tagName}: severity attribute has no effect on multi-color icons`
            );
        }
    }

    /**
     * Applies the configured layer colors as CSS custom properties
     * @internal
     */
    private applyLayerColors(): void {
        this.layerColors.forEach((token, index) => {
            if (index < MAX_ICON_LAYERS) {
                this.style.setProperty(
                    `--ni-nimble-icon-layer-${index + 1}-color`,
                    `var(${token.cssCustomProperty})`
                );
            }
        });
    }
}
