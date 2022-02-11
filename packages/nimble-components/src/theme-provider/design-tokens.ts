import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black7,
    Black15,
    Black30,
    Black75,
    Black80,
    Black85,
    Black88,
    Black91,
    White,
    Enterprise,
    Selection100,
    SlLegacyBlue,
    Fail100LightUi,
    SmallDelay,
    MediumDelay,
    Fail100DarkUi,
    BodyFamily,
    BodySize,
    ControlLabel1Family,
    ControlLabel1Size,
    Warning100LightUi,
    Warning100DarkUi,
    Pass100LightUi,
    Pass100DarkUi,
    Title2Size,
    Title2Family,
    GroupLabel1Family,
    GroupLabel1Size,
    Headline2Size,
    Headline2Family,
    Headline1Size,
    Headline1Family,
    Title3Size,
    Title3Family,
    Title1Size,
    Title1Family,
    Subtitle2Size,
    Subtitle2Family,
    Subtitle1Size,
    Subtitle1Family,
    LinkLightUiSize,
    LinkLightUiFamily,
    PlaceholderSize,
    PlaceholderFamily,
    BodyEmphasizedSize,
    BodyEmphasizedFamily,
    ButtonLabel1Size,
    ButtonLabel1Family,
    TooltipCaptionSize,
    TooltipCaptionFamily
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from './types';
import { tokenNames, styleNameFromTokenName } from './design-token-names';
import { theme } from '.';

// Color Tokens
export const actionColorRgbPartial = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.actionColorRgbPartial)
).withDefault((element: HTMLElement) => hexToRgbPartial(
    getColorForTheme(element, Black91, Black15, White, SlLegacyBlue)
));
export const backgroundLevel3Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.backgroundLevel3Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black30, Black91, Enterprise, White));

export const backgroundLevel2Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.backgroundLevel2Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black7, Black80, Enterprise, White));

export const backgroundLevel1Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.backgroundLevel1Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, Enterprise, White));

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
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    Selection100,
    Selection100,
    White,
    hexToRgbaCssColor(SlLegacyBlue, 0.9)
));

export const highlightEnterpriseColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.highlightEnterpriseColor)
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    Selection100,
    Selection100,
    White,
    hexToRgbaCssColor(SlLegacyBlue, 0.9)
));

// Component Color Tokens
export const iconColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, Black88));

export const popupBoxShadowColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBoxShadowColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(
    getColorForTheme(element, Black75, Black85, Black85, Black75),
    0.3
));

export const popupBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBorderColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(
    getColorForTheme(element, Black91, Black15, White, Black91),
    0.3
));

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
).withDefault(`400 ${Headline2Size}/40px ${Headline2Family}, serif`);
export const headline1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline1Font)
).withDefault(`400 ${Headline1Size}/32px ${Headline1Family}, serif`);
export const title3Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3Font)
).withDefault(`400 ${Title3Size}/32px ${Title3Family}, sans-serif`);
export const title2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3Font)
).withDefault(`400 ${Title2Size}/28px ${Title2Family}, sans-serif`);
export const title1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title1Font)
).withDefault(`400 ${Title1Size}/24px ${Title1Family}, sans-serif`);
export const subtitle2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle2Font)
).withDefault(`300 ${Subtitle2Size}/20px ${Subtitle2Family}, sans-serif`);
export const subtitle1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle1Font)
).withDefault(`300 ${Subtitle1Size}/16px ${Subtitle1Family}, sans-serif`);
export const linkStandard1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.linkStandard1Font)
).withDefault(`400 ${LinkLightUiSize}/18px ${LinkLightUiFamily}, sans-serif`);
export const placeholderFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.placeholderFont)
).withDefault(`400 ${PlaceholderSize}/18px ${PlaceholderFamily}, sans-serif`);
export const bodyEmphasizedFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyEmphasizedFont)
).withDefault(
    `600 ${BodyEmphasizedSize}/18px ${BodyEmphasizedFamily}, sans-serif`
);
export const bodyFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyFont)
).withDefault(`400 ${BodySize}/18px ${BodyFamily}, sans-serif`);
export const groupHeader1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1Font)
).withDefault(`400 ${GroupLabel1Size}/16px ${GroupLabel1Family}, sans-serif`);
export const controlLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlLabel1Font)
).withDefault(
    `600 ${ControlLabel1Size}/16px ${ControlLabel1Family}, sans-serif`
);
export const buttonLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonLabel1Font)
).withDefault(`400 ${ButtonLabel1Size}/16px ${ButtonLabel1Family}, sans-serif`);
export const tooltipCaptionFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipCaptionFont)
).withDefault(
    `400 ${TooltipCaptionSize}/14px ${TooltipCaptionFamily}, sans-serif`
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
).withDefault((element: HTMLElement) => getGroupLabelTextTransformForTheme(element));

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
    colorThemeColor: string,
    legacyBlueThemeColor: string
): string {
    switch (theme.getValueFor(element)) {
        case Theme.Light:
            return lightThemeColor;
        case Theme.Dark:
            return darkThemeColor;
        case Theme.Color:
            return colorThemeColor;
        case Theme.LegacyBlue:
            return legacyBlueThemeColor;
        default:
            return lightThemeColor;
    }
}

function getWarningColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Warning100LightUi,
        Warning100DarkUi,
        Warning100DarkUi,
        Warning100LightUi
    );
}

function getFailColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Fail100LightUi,
        Fail100DarkUi,
        Fail100DarkUi,
        Fail100LightUi
    );
}

function getPassColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Pass100LightUi,
        Pass100DarkUi,
        Pass100DarkUi,
        Pass100LightUi
    );
}

function getDefaultLineColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White, Black91);
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White, Black75);
}

function getFillColorSelectedForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Selection100,
        Selection100,
        White,
        SlLegacyBlue
    );
}

function getFillColorHoverForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White, SlLegacyBlue);
}

function getGroupLabelTextTransformForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return 'none';
        default:
            return 'uppercase';
    }
}
