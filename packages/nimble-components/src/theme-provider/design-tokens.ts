import { CSSDesignToken, DesignToken } from '@microsoft/fast-foundation';
import hexRgb from 'hex-rgb';
import {
    Black7,
    Black91,
    Black85,
    Black15,
    Black75,
    Black80,
    Black88,
    White,
    ForestGreen,
    DigitalGreenLight,
    Fail100LightUi,
    SmallDelay,
    MediumDelay,
    LargeDelay,
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
    ErrorLightUiSize,
    ErrorLightUiFamily,
    ErrorLightUiWeight,
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
    TooltipCaptionLineHeight,
    Information100LightUi,
    Information100DarkUi
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    modalBackdropColorThemeColorStatic,
    modalBackdropColorThemeDarkStatic,
    modalBackdropColorThemeLightStatic
} from './design-tokens-static';
import { Theme } from './types';
import { tokenNames, styleNameFromTokenName } from './design-token-names';
import { theme } from '.';
import { hexToRgbaCssColor } from '../utilities/style/colors';

// Color Tokens
export const actionRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.actionRgbPartialColor)
).withDefault((element: HTMLElement) => hexToRgbPartial(getColorForTheme(element, Black91, Black15, White)));

export const applicationBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.applicationBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, ForestGreen));

export const headerBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headerBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black7, Black88, ForestGreen));

export const sectionBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.sectionBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black80, ForestGreen));

export const dividerBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dividerBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black80, ForestGreen));

export const fillSelectedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillSelectedColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillSelectedColorForTheme(element), 0.2));

export const fillSelectedRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillSelectedRgbPartialColor)
).withDefault((element: HTMLElement) => hexToRgbPartial(getFillSelectedColorForTheme(element)));

export const fillHoverSelectedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverSelectedColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillSelectedColorForTheme(element), 0.15));

export const fillHoverColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillHoverColorForTheme(element), 0.1));

export const fillDownColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillDownColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getFillDownColorForTheme(element), 0.15));

export const borderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderColor)
).withDefault((element: HTMLElement) => getDefaultLineColorForTheme(element));

export const borderRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderRgbPartialColor)
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

export const informationColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.informationColor)
).withDefault((element: HTMLElement) => getInformationColorForTheme(element));

export const borderHoverColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderHoverColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, DigitalGreenLight, DigitalGreenLight, White));

// Component Color Tokens
export const iconColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White));

export const modalBackdropColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.modalBackdropColor)
).withDefault((element: HTMLElement) => getModalBackdropForTheme(element));

export const popupBoxShadowColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBoxShadowColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black75, Black85, Black85), 0.3));

export const popupBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBorderColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.3));

export const tooltipBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black85, ForestGreen));

// Component Sizing Tokens
export const controlHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlHeight)
).withDefault('32px');
export const smallPadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallPadding)
).withDefault('4px');
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
export const [
    headlineFont,
    headlineFontColor,
    headlineDisabledFontColor,
    headlineFontFamily,
    headlineFontWeight,
    headlineFontSize,
    headlineFontLineHeight,
    headlineFallbackFontFamily
] = createFontTokens(
    tokenNames.headlineFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Headline1Family,
    Headline1Weight,
    Headline1Size,
    Headline1LineHeight,
    'serif'
);

export const [
    headlinePlus1Font,
    headlinePlus1FontColor,
    headlinePlus1DisabledFontColor,
    headlinePlus1FontFamily,
    headlinePlus1FontWeight,
    headlinePlus1FontSize,
    headlinePlus1FontLineHeight,
    headlinePlus1FallbackFontFamily
] = createFontTokens(
    tokenNames.headlinePlus1Font,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Headline2Family,
    Headline2Weight,
    Headline2Size,
    Headline2LineHeight,
    'serif'
);

export const [
    titlePlus2Font,
    titlePlus2FontColor,
    titlePlus2DisabledFontColor,
    titlePlus2FontFamily,
    titlePlus2FontWeight,
    titlePlus2FontSize,
    titlePlus2FontLineHeight,
    titlePlus2FallbackFontFamily
] = createFontTokens(
    tokenNames.titlePlus2Font,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title3Family,
    Title3Weight,
    Title3Size,
    Title3LineHeight,
    'sans-serif'
);

export const [
    titlePlus1Font,
    titlePlus1FontColor,
    titlePlus1DisabledFontColor,
    titlePlus1FontFamily,
    titlePlus1FontWeight,
    titlePlus1FontSize,
    titlePlus1FontLineHeight,
    titlePlus1FallbackFontFamily
] = createFontTokens(
    tokenNames.titlePlus1Font,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title2Family,
    Title2Weight,
    Title2Size,
    Title2LineHeight,
    'sans-serif'
);

export const [
    titleFont,
    titleFontColor,
    titleDisabledFontColor,
    titleFontFamily,
    titleFontWeight,
    titleFontSize,
    titleFontLineHeight,
    titleFallbackFontFamily
] = createFontTokens(
    tokenNames.titleFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title1Family,
    Title1Weight,
    Title1Size,
    Title1LineHeight,
    'sans-serif'
);

export const [
    subtitlePlus1Font,
    subtitlePlus1FontColor,
    subtitlePlus1DisabledFontColor,
    subtitlePlus1FontFamily,
    subtitlePlus1FontWeight,
    subtitlePlus1FontSize,
    subtitlePlus1FontLineHeight,
    subtitlePlus1FallbackFontFamily
] = createFontTokens(
    tokenNames.subtitlePlus1Font,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Subtitle2Family,
    Subtitle2Weight,
    Subtitle2Size,
    Subtitle2LineHeight,
    'sans-serif'
);

export const [
    subtitleFont,
    subtitleFontColor,
    subtitleDisabledFontColor,
    subtitleFontFamily,
    subtitleFontWeight,
    subtitleFontSize,
    subtitleFontLineHeight,
    subtitleFallbackFontFamily
] = createFontTokens(
    tokenNames.subtitleFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Subtitle1Family,
    Subtitle1Weight,
    Subtitle1Size,
    Subtitle1LineHeight,
    'sans-serif'
);

export const [
    linkStandardFont,
    linkStandardFontColor,
    linkStandardDisabledFontColor,
    linkStandardFontFamily,
    linkStandardFontWeight,
    linkStandardFontSize,
    linkStandardFontLineHeight,
    linkStandardFallbackFontFamily
] = createFontTokens(
    tokenNames.linkStandardFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    LinkLightUiFamily,
    LinkLightUiWeight,
    LinkLightUiSize,
    LinkLineHeight,
    'sans-serif'
);

export const [
    placeholderFont,
    placeholderFontColor,
    placeholderDisabledFontColor,
    placeholderFontFamily,
    placeholderFontWeight,
    placeholderFontSize,
    placeholderFontLineHeight,
    placeholderFallbackFontFamily
] = createFontTokens(
    tokenNames.placeholderFont,
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    PlaceholderFamily,
    PlaceholderWeight,
    PlaceholderSize,
    PlaceholderLineHeight,
    'sans-serif'
);

export const [
    bodyEmphasizedFont,
    bodyEmphasizedFontColor,
    bodyEmphasizedDisabledFontColor,
    bodyEmphasizedFontFamily,
    bodyEmphasizedFontWeight,
    bodyEmphasizedFontSize,
    bodyEmphasizedFontLineHeight,
    bodyEmphasizedFallbackFontFamily
] = createFontTokens(
    tokenNames.bodyEmphasizedFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyEmphasizedFamily,
    BodyEmphasizedWeight,
    BodyEmphasizedSize,
    BodyEmphasizedLineHeight,
    'sans-serif'
);

export const [
    bodyFont,
    bodyFontColor,
    bodyDisabledFontColor,
    bodyFontFamily,
    bodyFontWeight,
    bodyFontSize,
    bodyFontLineHeight,
    bodyFallbackFontFamily
] = createFontTokens(
    tokenNames.bodyFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyFamily,
    BodyWeight,
    BodySize,
    BodyLineHeight,
    'sans-serif'
);

export const [
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderDisabledFontColor,
    groupHeaderFontFamily,
    groupHeaderFontWeight,
    groupHeaderFontSize,
    groupHeaderFontLineHeight,
    groupHeaderFallbackFontFamily
] = createFontTokens(
    tokenNames.groupHeaderFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    GroupLabel1Family,
    GroupLabel1Weight,
    GroupLabel1Size,
    GroupLabel1LineHeight,
    'sans-serif'
);

export const [
    controlLabelFont,
    controlLabelFontColor,
    controlLabelDisabledFontColor,
    controlLabelFontFamily,
    controlLabelFontWeight,
    controlLabelFontSize,
    controlLabelFontLineHeight,
    controlLabelFallbackFontFamily
] = createFontTokens(
    tokenNames.controlLabelFont,
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    ControlLabel1Family,
    ControlLabel1Weight,
    ControlLabel1Size,
    ControlLabel1LineHeight,
    'sans-serif'
);

export const [
    buttonLabelFont,
    buttonLabelFontColor,
    buttonLabelDisabledFontColor,
    buttonLabelFontFamily,
    buttonLabelFontWeight,
    buttonLabelFontSize,
    buttonLabelFontLineHeight,
    buttonLabelFallbackFontFamily
] = createFontTokens(
    tokenNames.buttonLabelFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    ButtonLabel1Family,
    ButtonLabel1Weight,
    ButtonLabel1Size,
    ButtonLabel1LineHeight,
    'sans-serif'
);

export const [
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    tooltipCaptionDisabledFontColor,
    tooltipCaptionFontFamily,
    tooltipCaptionFontWeight,
    tooltipCaptionFontSize,
    tooltipCaptionFontLineHeight,
    tooltipCaptionFallbackFontFamily
] = createFontTokens(
    tokenNames.tooltipCaptionFont,
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    TooltipCaptionFamily,
    TooltipCaptionWeight,
    TooltipCaptionSize,
    TooltipCaptionLineHeight,
    'sans-serif'
);

export const [
    errorTextFont,
    errorTextFontColor,
    errorTextDisabledFontColor,
    errorTextFontFamily,
    errorTextFontWeight,
    errorTextFontSize,
    errorTextFontLineHeight,
    errorTextFallbackFontFamily
] = createFontTokens(
    tokenNames.errorTextFont,
    (element: HTMLElement) => getFailColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getFailColorForTheme(element), 0.3),
    ErrorLightUiFamily,
    ErrorLightUiWeight,
    ErrorLightUiSize,
    TooltipCaptionLineHeight,
    'sans-serif'
);

// Font Transform Tokens
export const groupHeaderTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeaderTextTransform)
).withDefault('uppercase');

// Animation Tokens
export const smallDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallDelay)
).withDefault(SmallDelay);
export const mediumDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.mediumDelay)
).withDefault(MediumDelay);
export const largeDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.largeDelay)
).withDefault(LargeDelay);

// Private helpers functions
function hexToRgbPartial(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function createFontTokens(
    fontTokenName: string,
    colorFunction: (element: HTMLElement) => string,
    disabledColorFunction: (element: HTMLElement) => string,
    family: string,
    weight: string,
    size: string,
    lineHeight: string,
    fallbackFamily: string
): readonly [
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>,
        CSSDesignToken<string>
    ] {
    if (
        fontTokenName === ''
        || family === ''
        || weight === ''
        || size === ''
        || lineHeight === ''
        || fallbackFamily === ''
    ) {
        throw new Error(
            'createFontTokens parameter unexpectedly set to empty string'
        );
    }

    const fontToken = DesignToken.create<string>(
        styleNameFromTokenName(fontTokenName)
    ).withDefault(
        `${weight} ${size}/${lineHeight} ${family}, ${fallbackFamily}`
    );

    const fontNameParts = fontTokenName.split('-font');
    const tokenPrefixWithoutFont = fontNameParts[0];
    if (tokenPrefixWithoutFont === undefined || fontNameParts[1] !== '') {
        throw new Error(
            `fontTokenName value of ${fontTokenName} did not have the expected '-font' suffix`
        );
    }

    const fontColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-color`)
    ).withDefault((element: HTMLElement) => colorFunction(element));

    const fontDisabledColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-disabled-font-color`)
    ).withDefault((element: HTMLElement) => disabledColorFunction(element));

    const fontFamilyToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-family`)
    ).withDefault(`${family}`);

    const fontWeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-weight`)
    ).withDefault(`${weight}`);

    const fontSizeToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-size`)
    ).withDefault(`${size}`);

    const fontLineHeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-line-height`)
    ).withDefault(`${lineHeight}`);

    const fontFallbackFamilyToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-fallback-font-family`)
    ).withDefault(`${fallbackFamily}`);

    return [
        fontToken,
        fontColorToken,
        fontDisabledColorToken,
        fontFamilyToken,
        fontWeightToken,
        fontSizeToken,
        fontLineHeightToken,
        fontFallbackFamilyToken
    ] as const;
}

function getColorForTheme(
    element: HTMLElement,
    lightThemeColor: string,
    darkThemeColor: string,
    colorThemeColor: string
): string {
    switch (theme.getValueFor(element)) {
        case Theme.light:
            return lightThemeColor;
        case Theme.dark:
            return darkThemeColor;
        case Theme.color:
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
        White
    );
}

function getFailColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Fail100LightUi, Fail100DarkUi, White);
}

function getPassColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Pass100LightUi, Pass100DarkUi, White);
}

function getInformationColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Information100LightUi,
        Information100DarkUi,
        White
    );
}

function getDefaultLineColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getFillSelectedColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        DigitalGreenLight,
        DigitalGreenLight,
        White
    );
}

function getFillHoverColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getFillDownColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function getModalBackdropForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case Theme.light:
            return modalBackdropColorThemeLightStatic;
        case Theme.dark:
            return modalBackdropColorThemeDarkStatic;
        case Theme.color:
            return modalBackdropColorThemeColorStatic;
        default:
            return modalBackdropColorThemeLightStatic;
    }
}
