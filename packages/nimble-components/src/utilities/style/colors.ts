import hexRgb from 'hex-rgb';

/**
 * Convert a hexadecimal color string to an RGBA CSS color string
 * @param hexValue Hex color (with or without a starting '#')
 * @param alpha CSS alpha value between 0 (transparent) and 1 (opaque)
 * @returns An rgba()-formatted CSS color string
 */
export function hexToRgbaCssColor(hexValue: string, alpha: number): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
