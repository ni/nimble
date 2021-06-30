import { DesignToken } from '@microsoft/fast-foundation';
import {
    White,
    Black85,
    Black91,
    Black15,
    Brand100,
    Brand15,
    BodyFamily,
    OverlineCapsFamily
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { NimbleTheme } from './themes';

const { create } = DesignToken;

export const theme = create<NimbleTheme>({ name: 'theme', cssCustomPropertyName: null }).withDefault(NimbleTheme.light);

// Color Tokens
export const fillColor = create<string>('fill-color').withDefault((element: HTMLElement) => (theme.getValueFor(element) === NimbleTheme.light ? White : Black85));
export const fillColorHover = create<string>('fill-color-hover').withDefault(Brand15);
export const outlineColor = create<string>('outline-color').withDefault((element: HTMLElement) => (theme.getValueFor(element) === NimbleTheme.light ? Black85 : White));
export const outlineColorHover = create<string>('outline-color-hover').withDefault(Brand100);

// Component Sizing Tokens
export const controlHeight = create<string>('control-height').withDefault('30px');
export const standardPadding = create<string>('standard-padding').withDefault('8px');

// Font Family Tokens
export const fontFamily = create<string>('font-family').withDefault(BodyFamily);
export const labelFontFamily = create<string>('label-font-family').withDefault(OverlineCapsFamily);

// Font Sizing Tokens
export const labelFontSize = create<string>('label-font-size').withDefault('11px');

// Font Color Tokens
export const fontColor = create<string>('label-font-color').withDefault((element: HTMLElement) => (theme.getValueFor(element) === NimbleTheme.light ? Black91 : Black15));
