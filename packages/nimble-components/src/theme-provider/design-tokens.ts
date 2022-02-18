import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black7,
    Black91,
    Black85,
    Black15,
    Black30,
    Black75,
    Black80,
    White,
    Enterprise,
    Selection100,
    Fail100LightUi,
    SmallDelay,
    MediumDelay,
    Fail100DarkUi,
    Warning100LightUi,
    Warning100DarkUi,
    Pass100LightUi,
    Pass100DarkUi,
    BodyFamily,
    BodySize,
    BodyWeight,
    ControlLabel1Family,
    ControlLabel1Size,
    ControlLabel1Weight,
    GroupLabel1Family,
    GroupLabel1Size,
    GroupLabel1Weight,
    Headline2Size,
    Headline2Family,
    Headline2Weight,
    Headline1Size,
    Headline1Family,
    Headline1Weight,
    Title3Size,
    Title3Family,
    Title3Weight,
    Title2Size,
    Title2Family,
    Title2Weight,
    Title1Size,
    Title1Family,
    Title1Weight,
    Subtitle2Size,
    Subtitle2Family,
    Subtitle2Weight,
    Subtitle1Size,
    Subtitle1Family,
    Subtitle1Weight,
    LinkLightUiSize,
    LinkLightUiFamily,
    LinkLightUiWeight,
    PlaceholderSize,
    PlaceholderFamily,
    PlaceholderWeight,
    BodyEmphasizedSize,
    BodyEmphasizedFamily,
    BodyEmphasizedWeight,
    ButtonLabel1Size,
    ButtonLabel1Family,
    ButtonLabel1Weight,
    TooltipCaptionSize,
    TooltipCaptionFamily,
    TooltipCaptionWeight,
    Headline2LineHeight,
    Headline1LineHeight,
    Title3LineHeight,
    Title2LineHeight,
    Title1LineHeight,
    Subtitle2LineHeight,
    Subtitle1LineHeight,
    LinkLineHeight,
    PlaceholderLineHeight,
    BodyEmphasizedLineHeight,
    BodyLineHeight,
    GroupLabel1LineHeight,
    ControlLabel1LineHeight,
    ButtonLabel1LineHeight,
    TooltipCaptionLineHeight
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

export const headerBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headerBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black7, Black80, Enterprise));

export const sectionBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.sectionBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black30, Black91, Enterprise));

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

// Font Tokens
export const headline2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline2Font)
).withDefault(
    `${Headline2Weight} ${Headline2Size}/${Headline2LineHeight} ${Headline2Family}, serif`
);
export const headline1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline1Font)
).withDefault(
    `${Headline1Weight} ${Headline1Size}/${Headline1LineHeight} ${Headline1Family}, serif`
);
export const title3Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3Font)
).withDefault(
    `${Title3Weight} ${Title3Size}/${Title3LineHeight} ${Title3Family}, sans-serif`
);
export const title2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title2Font)
).withDefault(
    `${Title2Weight} ${Title2Size}/${Title2LineHeight} ${Title2Family}, sans-serif`
);
export const title1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title1Font)
).withDefault(
    `${Title1Weight} ${Title1Size}/${Title1LineHeight} ${Title1Family}, sans-serif`
);
export const subtitle2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle2Font)
).withDefault(
    `${Subtitle2Weight} ${Subtitle2Size}/${Subtitle2LineHeight} ${Subtitle2Family}, sans-serif`
);
export const subtitle1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle1Font)
).withDefault(
    `${Subtitle1Weight} ${Subtitle1Size}/${Subtitle1LineHeight} ${Subtitle1Family}, sans-serif`
);
export const linkStandard1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.linkStandard1Font)
).withDefault(
    `${LinkLightUiWeight} ${LinkLightUiSize}/${LinkLineHeight} ${LinkLightUiFamily}, sans-serif`
);
export const placeholderFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.placeholderFont)
).withDefault(
    `${PlaceholderWeight} ${PlaceholderSize}/${PlaceholderLineHeight} ${PlaceholderFamily}, sans-serif`
);
export const bodyEmphasizedFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyEmphasizedFont)
).withDefault(
    `${BodyEmphasizedWeight} ${BodyEmphasizedSize}/${BodyEmphasizedLineHeight} ${BodyEmphasizedFamily}, sans-serif`
);
export const bodyFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyFont)
).withDefault(
    `${BodyWeight} ${BodySize}/${BodyLineHeight} ${BodyFamily}, sans-serif`
);
export const groupHeader1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1Font)
).withDefault(
    `${GroupLabel1Weight} ${GroupLabel1Size}/${GroupLabel1LineHeight} ${GroupLabel1Family}, sans-serif`
);
export const controlLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlLabel1Font)
).withDefault(
    `${ControlLabel1Weight} ${ControlLabel1Size}/${ControlLabel1LineHeight} ${ControlLabel1Family}, sans-serif`
);
export const buttonLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonLabel1Font)
).withDefault(
    `${ButtonLabel1Weight} ${ButtonLabel1Size}/${ButtonLabel1LineHeight} ${ButtonLabel1Family}, sans-serif`
);
export const tooltipCaptionFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipCaptionFont)
).withDefault(
    `${TooltipCaptionWeight} ${TooltipCaptionSize}/${TooltipCaptionLineHeight} ${TooltipCaptionFamily}, sans-serif`
);

// Font Color Tokens

export const headline2FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline2FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const headline1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const title3FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const title2FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title2FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const title1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const subtitle2FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle2FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const subtitle1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const standard1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.standard1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const placeholderFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.placeholderFontColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6));
export const bodyEmphasizedFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyEmphasizedFontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const bodyFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyFontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const groupHeader1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const controlLabel1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlLabel1FontColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6));
export const buttonLabel1FontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonLabel1FontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const tooltipCaptionFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipCaptionFontColor)
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));
export const headline2FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline2FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const headline1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const title3FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const title2FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title2FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const title1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const subtitle2FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle2FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const subtitle1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const standard1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.standard1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const placeholderFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.placeholderFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const bodyEmphasizedFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyEmphasizedFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const bodyFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const groupHeader1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const controlLabel1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlLabel1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const buttonLabel1FontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonLabel1FontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));
export const tooltipCaptionFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipCaptionFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3));

// Font Transform Tokens
export const groupHeader1TextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1TextTransform)
).withDefault('uppercase');

// Animation Tokens
export const smallDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallDelay)
).withDefault(SmallDelay);
export const mediumDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.mediumDelay)
).withDefault(MediumDelay);
export const largeDelay = DesignToken.create<number>(
    styleNameFromTokenName(tokenNames.largeDelay)
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

function getFillColorSelectedForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Selection100, Selection100, White);
}

function getFillColorHoverForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}
