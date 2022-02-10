import { DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black91,
    Black88,
    Black85,
    Black15,
    Black75,
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
    LegacyContentFamily,
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

export const applicationBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.applicationBackgroundColor)
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
// $ni-nimble-headline2-font
export const headline2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline2Font)
).withDefault(`400 ${Headline2Size}/40px ${Headline2Family}, serif`);
// $ni-nimble-headline1-font
export const headline1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headline1Font)
).withDefault(`400 ${Headline1Size}/32px ${Headline1Family}, serif`);
// $ni-nimble-title3-font
export const title3Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3Font)
).withDefault(`400 ${Title3Size}/32px ${Title3Family}, sans-serif`);
// $ni-nimble-title2-font
export const title2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title3Font)
).withDefault(`400 ${Title2Size}/28px ${Title2Family}, sans-serif`);
// $ni-nimble-title1-font
export const title1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.title1Font)
).withDefault(`400 ${Title1Size}/24px ${Title1Family}, sans-serif`);
// $ni-nimble-subtitle2-font
export const subtitle2Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle2Font)
).withDefault(`300 ${Subtitle2Size}/20px ${Subtitle2Family}, sans-serif`);
// $ni-nimble-subtitle1-font
export const subtitle1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.subtitle1Font)
).withDefault(`300 ${Subtitle1Size}/16px ${Subtitle1Family}, sans-serif`);
// $ni-nimble-link-standard1-font
export const linkStandard1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.linkStandard1Font)
).withDefault(`400 ${LinkLightUiSize}/18px ${LinkLightUiFamily}, sans-serif`);
// $ni-nimble-placeholder-font
export const placeholderFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.placeholderFont)
).withDefault(`400 ${PlaceholderSize}/18px ${PlaceholderFamily}, sans-serif`);
// $ni-nimble-body-emphasized-large-font
// $ni-nimble-body-large-font
// $ni-nimble-body-emphasized-font
export const bodyEmphasizedFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyEmphasizedFont)
).withDefault(
    `600 ${BodyEmphasizedSize}/18px ${BodyEmphasizedFamily}, sans-serif`
);
// $ni-nimble-body-font
export const bodyFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bodyFont)
).withDefault(`400 ${BodySize}/18px ${BodyFamily}, sans-serif`);
// $ni-nimble-group-header1-font
export const groupHeader1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeader1Font)
).withDefault(`400 ${GroupLabel1Size}/16px ${GroupLabel1Family}, sans-serif`);
// $ni-nimble-control-label1-font
export const controlLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlLabel1Font)
).withDefault(
    `600 ${ControlLabel1Size}/16px ${ControlLabel1Family}, sans-serif`
);
// $ni-nimble-button-label1-font
export const buttonLabel1Font = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonLabel1Font)
).withDefault(`400 ${ButtonLabel1Size}/16px ${ButtonLabel1Family}, sans-serif`);
// $ni-nimble-tooltip-caption-font
export const tooltipCaptionFont = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipCaptionFont)
).withDefault(
    `400 ${TooltipCaptionSize}/14px ${TooltipCaptionFamily}, sans-serif`
);

// Font Family Tokens
export const fontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fontFamily)
).withDefault((element: HTMLElement) => getFontForTheme(element));
export const labelFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontFamily)
).withDefault((element: HTMLElement) => getLabelFontForTheme(element));
export const groupLabelFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelFontFamily)
).withDefault((element: HTMLElement) => getGroupLabelFontForTheme(element));
export const drawerHeaderFontFamily = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.drawerHeaderFontFamily)
).withDefault(Title2Family);

// Font Sizing Tokens
export const labelFontSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontSize)
).withDefault((element: HTMLElement) => getLabelTextSizeForTheme(element));
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
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, Black88));

export const buttonContentFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonContentFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, SlLegacyBlue));

export const labelFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getDefaultLineColorForTheme(element), 0.3));

export const labelTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.labelTextTransform)
).withDefault((element: HTMLElement) => getLabelTextTransformForTheme(element));

export const groupLabelTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupLabelTextTransform)
).withDefault((element: HTMLElement) => getGroupLabelTextTransformForTheme(element));

export const contentFontColorDisabled = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.contentFontColorDisabled)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(
    getColorForTheme(element, Black91, Black15, White, Black88),
    0.3
));

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

function getFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${BodyFamily}`;
    }
}

function getLabelFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${ControlLabel1Family}, ${BodyFamily}`;
    }
}

function getGroupLabelFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${GroupLabel1Family}, ${BodyFamily}`;
    }
}

function getGroupLabelTextTransformForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return 'none';
        default:
            return 'uppercase';
    }
}

function getLabelTextTransformForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return 'none';
        default:
            return 'none';
    }
}

function getLabelTextSizeForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.LegacyBlue:
            return '13px';
        default:
            return ControlLabel1Size;
    }
}
