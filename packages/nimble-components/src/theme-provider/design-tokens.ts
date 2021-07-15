import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black91,
    Black85,
    Black15,
    White,
    Brand100,
    Selection100,
    BodyFamily,
    OverlineCapsFamily
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { NimbleTheme } from './themes';

function rgbString(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function rgba(hexValue: string, alpha: number): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const { create } = DesignToken;

export const theme = create<NimbleTheme>({ name: 'theme', cssCustomPropertyName: null }).withDefault(NimbleTheme.Light);

// Color Tokens
export const applicationBackgroundColor = create<string>('application-background-color').withDefault((element: HTMLElement) => ((theme.getValueFor(element) === NimbleTheme.Light ? White : Black85)) as string);
export const fillColorSelected = create<string>('fill-color-selected').withDefault(rgba(Selection100, 0.3));
export const fillColorSelectedRgb = create<string>('fill-color-selected-rgb').withDefault(rgbString(Selection100));
export const borderColor = create<string>('border-color').withDefault((element: HTMLElement) => ((theme.getValueFor(element) === NimbleTheme.Light ? Black91 : Black15)) as string);
export const borderColorRgb = create<string>('border-color-rgb').withDefault((element: HTMLElement) => (rgbString(theme.getValueFor(element) === NimbleTheme.Light ? Black91 : Black15)));
export const borderColorHover = create<string>('border-color-hover').withDefault(Brand100);

// Component Sizing Tokens
export const controlHeight = create<string>('control-height').withDefault('32px');
export const standardPadding = create<string>('standard-padding').withDefault('16px');

// Font Family Tokens
export const fontFamily = create<string>('font-family').withDefault(BodyFamily);
export const labelFontFamily = create<string>('label-font-family').withDefault(`${OverlineCapsFamily as string}, ${BodyFamily as string}`);

// Font Sizing Tokens
export const labelFontSize = create<string>('label-font-size').withDefault('11px');
export const contentFontSize = create<string>('content-font-size').withDefault('14px');

// Font Color Tokens
export const fontColor = create<string>('label-font-color').withDefault((element: HTMLElement) => ((theme.getValueFor(element) === NimbleTheme.Light ? Black91 : Black15)) as string);
