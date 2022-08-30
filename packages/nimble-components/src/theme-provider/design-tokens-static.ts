import { DesignToken } from '@microsoft/fast-foundation';
import { Black } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { hexToRgbaCssColor } from '../utilities/style/colors';

export const modalBackdropColorThemeLight = DesignToken.create<string>(
    'modal-backdrop-color-theme-light'
).withDefault(hexToRgbaCssColor(Black, 0.3));
export const modalBackdropColorThemeDark = DesignToken.create<string>(
    'modal-backdrop-color-theme-dark'
).withDefault(hexToRgbaCssColor(Black, 0.6));
export const modalBackdropColorThemeColor = DesignToken.create<string>(
    'modal-backdrop-color-theme-color'
).withDefault(hexToRgbaCssColor(Black, 0.6));
