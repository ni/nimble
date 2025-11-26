import type { ElementStyles } from '@ni/fast-element';
import { Icon, registerIcon, type NimbleIcon } from '.';
import { multiColorStyles } from './multi-color-styles';

// Note: This constant is duplicated in packages/nimble-tokens/build/validate-icons.cjs
// Please ensure both are updated if this value changes.
export const MAX_ICON_LAYERS = 6;

/**
 * Base class for multi-color icon components.
 *
 * @public
 * @remarks
 * Multi-color icons use multiple theme colors for different visual regions
 * instead of a single severity-based color. Each icon defines its own
 * static styles that set CSS custom properties for layer colors.
 *
 * @example
 * ```ts
 * export class IconCirclePartialBroken extends MultiColorIcon {
 *     public constructor() {
 *         super(circlePartialBroken16X16);
 *     }
 * }
 *
 * export const circlePartialBrokenStyles = css`
 *     :host {
 *         --ni-nimble-icon-layer-1-color: ${graphGridlineColor};
 *         --ni-nimble-icon-layer-2-color: ${warningColor};
 *     }
 * `;
 *
 * registerMultiColorIcon('icon-circle-partial-broken', IconCirclePartialBroken, circlePartialBrokenStyles);
 * ```
 */
export class MultiColorIcon extends Icon {
    public constructor(icon: NimbleIcon) {
        super(icon);
    }
}

/**
 * Register a multi-color icon component
 *
 * @param baseName - The base name for the icon element (e.g., 'icon-check')
 * @param iconClass - The Icon class to register
 * @param additionalStyles - Optional additional styles to compose with the base styles
 */
export const registerMultiColorIcon = (
    baseName: string,
    iconClass: typeof MultiColorIcon,
    additionalStyles?: ElementStyles
): void => {
    const styles = additionalStyles
        ? [multiColorStyles, additionalStyles]
        : multiColorStyles;
    registerIcon(baseName, iconClass, undefined, styles);
};
