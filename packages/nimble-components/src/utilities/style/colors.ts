import { parseColorHexRGB } from '@microsoft/fast-colors';

/**
 * Convert a hexadecimal color string to an RGBA CSS color string
 * Example: '#ff0102' to 'rgba(255, 1, 2, 1)'
 * @param hexValue Hex color (with a starting '#')
 * @param alpha CSS alpha value between 0 (transparent) and 1 (opaque)
 * @returns An rgba()-formatted CSS color string
 */
export function hexToRgbaCssColor(hexValue: string, alpha: number): string {
    const { r, g, b } = parseColorHexRGB(hexValue)!;
    return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${alpha})`;
}
