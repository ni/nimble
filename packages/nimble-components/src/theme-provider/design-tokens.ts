import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black91,
    Black85,
    Black15,
    Black75,
    White,
    Enterprise,
    Selection100,
    Fail100LightUi,
    SmallDelay,
    MediumDelay,
    Fail100DarkUi,
    BodyFamily,
    BodySize,
    ControlLabel1Family,
    ControlLabel1Size,
    ControlLabel1Weight,
    Warning100LightUi,
    Warning100DarkUi,
    Pass100LightUi,
    Pass100DarkUi,
    Title2Size,
    Title2Family,
    GroupLabel1Family,
    GroupLabel1Size,
    GroupLabel1Weight,
    RgbNiSky,
    Information100LightUi,
    Information100DarkUi
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from './types';
import { tokenNames, styleNameFromTokenName } from './design-token-names';
import { theme } from '.';

// Color Tokens
export const actionColorRgbPartial = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.actionColorRgbPartial)
).withDefault((element: HTMLElement) => hexToRgbPartial(getColorForTheme(element, Black91, Black15, White)));

export const applicationBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.applicationBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, Enterprise));

export const fillColorSelected = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillColorSelected)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillColorSelectedForTheme(element), 0.3));

export const fillColorSelectedRgbPartial = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillColorSelectedRgbPartial)
).withDefault((element: HTMLElement) => hexToRgbPartial(getFillColorSelectedForTheme(element)));

export const fillColorSelectedHover = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillColorSelectedHover)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillColorSelectedForTheme(element), 0.15));

export const fillColorHover = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillColorHover)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillColorHoverForTheme(element), 0.1));

export const borderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderColor)
).withDefault((element: HTMLElement) => getDefaultLineColorForTheme(element));

export const borderColorRgbPartial = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderColorRgbPartial)
).withDefault((element: HTMLElement) => hexToRgbPartial(getDefaultLineColorForTheme(element)));

export const failColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.failColor)
).withDefault((element: HTMLElement) => getFailColorForTheme(element));

export const warningColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.warningColor)
).withDefault((element: HTMLElement) => getWarningColorForTheme(element));

export const passColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.passColor)
).withDefault((element: HTMLElement) => getPassColorForTheme(element));

export const hyperlinkColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.hyperlinkColor)
).withDefault((element: HTMLElement) => getHyperlinkColorForTheme(element));

export const hyperlinkColorActive = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.hyperlinkColorActive)
).withDefault((element: HTMLElement) => getHyperlinkColorActiveForTheme(element));

export const borderColorHover = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderColorHover)
).withDefault((element: HTMLElement) => getColorForTheme(element, Selection100, Selection100, White));

// Component Color Tokens
export const iconColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White));

export const popupBoxShadowColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBoxShadowColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black75, Black85, Black85), 0.3));

export const popupBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBorderColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.3));

// Component Sizing Tokens
export const controlHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlHeight)
).withDefault('32px');
export const standardPadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.standardPadding)
).withDefault('16px');
export const labelHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelHeight)
).withDefault('16px');
export const borderWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderWidth)
).withDefault('1px');
export const iconSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconSize)
).withDefault('16px');
export const drawerWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.drawerWidth)
).withDefault('784px');

// Font Family Tokens
export const fontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fontFamily)
).withDefault(BodyFamily);
export const labelFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontFamily)
).withDefault(`${ControlLabel1Family}, ${BodyFamily}`);
export const groupLabelFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelFontFamily)
).withDefault(`${GroupLabel1Family}, ${BodyFamily}`);
export const drawerHeaderFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.drawerHeaderFontFamily)
).withDefault(Title2Family);

// Font Sizing Tokens
export const labelFontSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontSize)
).withDefault(ControlLabel1Size);
export const contentFontSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.contentFontSize)
).withDefault(BodySize);
export const groupLabelFontSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelFontSize)
).withDefault(GroupLabel1Size);
export const drawerHeaderFontSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.drawerHeaderFontSize)
).withDefault(Title2Size);

// Font Weight Tokens
export const groupLabelFontWeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelFontWeight)
).withDefault(GroupLabel1Weight);

export const labelFontWeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontWeight)
).withDefault(ControlLabel1Weight);

// Font Color Tokens
export const labelFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6));

export const groupLabelFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelFontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));

export const contentFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.contentFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White));

export const buttonContentFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonContentFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White));

export const labelFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultLineColorForTheme(element), 0.3));

export const labelTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelTextTransform)
).withDefault('none');

export const groupLabelTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelTextTransform)
).withDefault('uppercase');

export const contentFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.contentFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.3));

// Animation Tokens
export const smallDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallDelay)
).withDefault(SmallDelay);
export const mediumDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.mediumDelay)
).withDefault(MediumDelay);
export const drawerAnimationDurationMs = DesignToken.create<number>(
    styleNameFromTokenName(tokenNames.drawerAnimationDurationMs)
).withDefault(250);

// Private helpers functions
function hexToRgbPartial(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function hexToRgbaCssColor(hexValue: string, alpha: number): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getColorForTheme(
    element: HTMLElement,
    lightThemeColor: string,
    darkThemeColor: string,
    colorThemeColor: string
): string {
    switch (theme.getValueFor(element)) {
        case Theme.Light:
            return lightThemeColor;
        case Theme.Dark:
            return darkThemeColor;
        case Theme.Color:
            return colorThemeColor;
        default:
            return lightThemeColor;
    }
}

function getWarningColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Warning100LightUi,
        Warning100DarkUi,
        Warning100DarkUi
    );
}

function getFailColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Fail100LightUi,
        Fail100DarkUi,
        Fail100DarkUi
    );
}

function getPassColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Pass100LightUi,
        Pass100DarkUi,
        Pass100DarkUi
    );
}

function getDefaultLineColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getHyperlinkColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, RgbNiSky, RgbNiSky, RgbNiSky);
}

function getHyperlinkColorActiveForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Information100LightUi,
        Information100DarkUi,
        Information100DarkUi
    );
}

function getFillColorSelectedForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Selection100, Selection100, White);
}

function getFillColorHoverForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}
