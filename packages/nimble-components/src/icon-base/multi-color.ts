import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { Icon } from '.';

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
 * registerIcon('icon-circle-partial-broken', IconCirclePartialBroken, multiColorTemplate, circlePartialBrokenStyles);
 * ```
 */
export class MultiColorIcon extends Icon {
    public constructor(icon: NimbleIcon) {
        super(icon);
    }
}
