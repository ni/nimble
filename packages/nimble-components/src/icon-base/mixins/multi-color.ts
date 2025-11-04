import type { CSSDesignToken } from '@ni/fast-foundation';
import type { Icon } from '..';

export const MAX_ICON_LAYERS = 6;

export interface MultiColorIcon {
    layerColors: readonly CSSDesignToken<string>[];
}

// Pick just the relevant property the mixin depends on
type IconBase = Pick<Icon, 'icon'>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconConstructor = abstract new (...args: any[]) => IconBase;

/**
 * Mixin to add multi-color support to icon components.
 * This allows icons to use multiple theme colors for different visual regions
 * instead of a single severity-based color.
 *
 * @example
 * ```ts
 * export class IconCirclePartialBroken extends mixinMultiColorIcon(Icon) {
 *     public constructor() {
 *         super(circlePartialBroken16X16);
 *         this.layerColors = [graphGridlineColor, warningColor];
 *     }
 * }
 * ```
 *
 * As the returned class is internal to the function, we can't write a signature
 * that uses it directly, so rely on inference.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinMultiColorIcon<TBase extends IconConstructor>(
    base: TBase
) {
    /**
     * The mixin class that adds multi-color icon support
     */
    abstract class MultiColorIconElement
        extends base
        implements MultiColorIcon {
        /**
         * The design tokens to use for each color layer in the icon.
         * The array index corresponds to the cls-N class in the SVG (0-indexed).
         */
        public layerColors: readonly CSSDesignToken<string>[] = [];
    }

    return MultiColorIconElement;
}
