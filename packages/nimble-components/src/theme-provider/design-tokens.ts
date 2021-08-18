import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black91,
    Black85,
    Black15,
    White,
    Enterprise,
    Selection100,
    BodyFamily,
    OverlineCapitalizedFamily
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { NimbleTheme } from './themes';

function rgbString(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function hexToRgba(hexValue: string, alpha: number): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const { create } = DesignToken;

export const theme = create<NimbleTheme>({ name: 'theme', cssCustomPropertyName: null }).withDefault(NimbleTheme.Light);

function getColorForTheme(element: HTMLElement, lightThemeColor: string, darkThemeColor: string, colorThemeColor: string): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Light:
            return lightThemeColor;
        case NimbleTheme.Dark:
            return darkThemeColor;
        case NimbleTheme.Color:
            return colorThemeColor;
        default:
            return lightThemeColor;
    }
}

function getDefaultLineColorForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Light:
            return Black91;
        case NimbleTheme.Dark:
            return Black15;
        case NimbleTheme.Color:
            return White;
        default:
            return Black91;
    }
}

// Color Tokens
export const applicationBackgroundColor = create<string>('application-background-color').withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, Enterprise));
const fillColorSelectedTheme = (element: HTMLElement): string => getColorForTheme(element, Selection100, Selection100, White);
export const fillColorSelected = create<string>('fill-color-selected').withDefault((element: HTMLElement) => hexToRgba(fillColorSelectedTheme(element), 0.3));
export const fillColorSelectedRgb = create<string>('fill-color-selected-rgb').withDefault((element: HTMLElement) => rgbString(fillColorSelectedTheme(element)));
export const borderColor = create<string>('border-color').withDefault((element: HTMLElement) => (getDefaultLineColorForTheme(element)));
export const borderColorRgb = create<string>('border-color-rgb').withDefault((element: HTMLElement) => (rgbString(getDefaultLineColorForTheme(element))));
export const borderColorHover = create<string>('border-color-hover').withDefault((element: HTMLElement) => getColorForTheme(element, Selection100, Selection100, White));

// Component Sizing Tokens
export const controlHeight = create<string>('control-height').withDefault('32px');
export const standardPadding = create<string>('standard-padding').withDefault('16px');

// Font Family Tokens
export const fontFamily = create<string>('font-family').withDefault(BodyFamily);
export const labelFontFamily = create<string>('label-font-family').withDefault(`${OverlineCapitalizedFamily}, ${BodyFamily}`);

// Font Sizing Tokens
export const labelFontSize = create<string>('label-font-size').withDefault('11px');
export const contentFontSize = create<string>('content-font-size').withDefault('14px');

// Font Color Tokens
export const fontColor = create<string>('label-font-color').withDefault((element: HTMLElement) => (getDefaultLineColorForTheme(element)));
export const fontColorDisabled = create<string>('font-color-disabled').withDefault((element: HTMLElement) => (hexToRgba(getDefaultLineColorForTheme(element), 0.3)));
