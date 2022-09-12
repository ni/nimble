import {
    Black,
    LargeDelay
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { hexToRgbaCssColor } from '../utilities/style/colors';

/**
 * Static tokens to use for styling the `::backdrop` pseduo-element of an HTML dialog, which
 * does not have access to CSS custom properties.
 *
 * See https://github.com/whatwg/fullscreen/issues/124
 */

export const modalBackdropColorThemeLightStatic = hexToRgbaCssColor(Black, 0.3);
export const modalBackdropColorThemeDarkStatic = hexToRgbaCssColor(Black, 0.6);
export const modalBackdropColorThemeColorStatic = hexToRgbaCssColor(Black, 0.6);

export const largeDelayStatic = LargeDelay;
