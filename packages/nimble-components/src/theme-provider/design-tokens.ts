import { type CSSDesignToken, DesignToken } from '@ni/fast-foundation';
import { Theme } from './types';
import { tokenNames, styleNameFromTokenName } from './design-token-names';
import { theme } from '.';
import { tokenValues, type ThemeColor } from './design-token-values';

// #region color tokens
export const actionRgbPartialColor = createThemeColorToken(tokenNames.actionRgbPartialColor, tokenValues.actionRgbPartialColor);
export const applicationBackgroundColor = createThemeColorToken(tokenNames.applicationBackgroundColor, tokenValues.applicationBackgroundColor);
export const headerBackgroundColor = createThemeColorToken(tokenNames.headerBackgroundColor, tokenValues.headerBackgroundColor);
export const sectionBackgroundColor = createThemeColorToken(tokenNames.sectionBackgroundColor, tokenValues.sectionBackgroundColor);
export const sectionBackgroundImage = createThemeColorToken(tokenNames.sectionBackgroundImage, tokenValues.sectionBackgroundImage);
export const dividerBackgroundColor = createThemeColorToken(tokenNames.dividerBackgroundColor, tokenValues.dividerBackgroundColor);
export const fillSelectedColor = createThemeColorToken(tokenNames.fillSelectedColor, tokenValues.fillSelectedColor);
export const fillSelectedRgbPartialColor = createThemeColorToken(tokenNames.fillSelectedRgbPartialColor, tokenValues.fillSelectedRgbPartialColor);
export const fillHoverSelectedColor = createThemeColorToken(tokenNames.fillHoverSelectedColor, tokenValues.fillHoverSelectedColor);
export const fillHoverColor = createThemeColorToken(tokenNames.fillHoverColor, tokenValues.fillHoverColor);
export const fillHoverRgbPartialColor = createThemeColorToken(tokenNames.fillHoverRgbPartialColor, tokenValues.fillHoverRgbPartialColor);
export const fillDownColor = createThemeColorToken(tokenNames.fillDownColor, tokenValues.fillDownColor);
export const borderColor = createThemeColorToken(tokenNames.borderColor, tokenValues.borderColor);
export const borderRgbPartialColor = createThemeColorToken(tokenNames.borderRgbPartialColor, tokenValues.borderRgbPartialColor);
export const failColor = createThemeColorToken(tokenNames.failColor, tokenValues.failColor);
export const warningColor = createThemeColorToken(tokenNames.warningColor, tokenValues.warningColor);
export const passColor = createThemeColorToken(tokenNames.passColor, tokenValues.passColor);
export const informationColor = createThemeColorToken(tokenNames.informationColor, tokenValues.informationColor);
export const borderHoverColor = createThemeColorToken(tokenNames.borderHoverColor, tokenValues.borderHoverColor);
// #endregion

// #region component color tokens
export const iconColor = createThemeColorToken(tokenNames.iconColor, tokenValues.iconColor);
export const modalBackdropColor = createThemeColorToken(tokenNames.modalBackdropColor, tokenValues.modalBackdropColor);
export const popupBorderColor = createThemeColorToken(tokenNames.popupBorderColor, tokenValues.popupBorderColor);
export const cardBorderColor = createThemeColorToken(tokenNames.cardBorderColor, tokenValues.cardBorderColor);
export const graphGridlineColor = createThemeColorToken(tokenNames.graphGridlineColor, tokenValues.graphGridlineColor);
export const graphTrace1Color = createThemeColorToken(tokenNames.graphTrace1Color, tokenValues.graphTrace1Color);
export const graphTrace2Color = createThemeColorToken(tokenNames.graphTrace2Color, tokenValues.graphTrace2Color);
export const graphTrace3Color = createThemeColorToken(tokenNames.graphTrace3Color, tokenValues.graphTrace3Color);
export const graphTrace4Color = createThemeColorToken(tokenNames.graphTrace4Color, tokenValues.graphTrace4Color);
export const graphTrace5Color = createThemeColorToken(tokenNames.graphTrace5Color, tokenValues.graphTrace5Color);
export const graphTrace6Color = createThemeColorToken(tokenNames.graphTrace6Color, tokenValues.graphTrace6Color);
export const graphTrace7Color = createThemeColorToken(tokenNames.graphTrace7Color, tokenValues.graphTrace7Color);
export const graphTrace8Color = createThemeColorToken(tokenNames.graphTrace8Color, tokenValues.graphTrace8Color);
export const tooltipBackgroundColor = createThemeColorToken(tokenNames.tooltipBackgroundColor, tokenValues.tooltipBackgroundColor);
export const tableRowBorderColor = createThemeColorToken(tokenNames.tableRowBorderColor, tokenValues.tableRowBorderColor);
export const tagFillColor = createThemeColorToken(tokenNames.tagFillColor, tokenValues.tagFillColor);
export const buttonFillPrimaryColor = createThemeColorToken(tokenNames.buttonFillPrimaryColor, tokenValues.buttonFillPrimaryColor);
export const buttonPrimaryFontColor = createThemeColorToken(tokenNames.buttonPrimaryFontColor, tokenValues.buttonPrimaryFontColor);
export const buttonFillAccentColor = createThemeColorToken(tokenNames.buttonFillAccentColor, tokenValues.buttonFillAccentColor);
export const buttonAccentBlockFontColor = createThemeColorToken(tokenNames.buttonAccentBlockFontColor, tokenValues.buttonAccentBlockFontColor);
export const buttonAccentOutlineFontColor = createThemeColorToken(tokenNames.buttonAccentOutlineFontColor, tokenValues.buttonAccentOutlineFontColor);
export const buttonBorderAccentOutlineColor = createThemeColorToken(tokenNames.buttonBorderAccentOutlineColor, tokenValues.buttonBorderAccentOutlineColor);
export const calendarEventBackgroundStaticColor = createThemeColorToken(tokenNames.calendarEventBackgroundStaticColor, tokenValues.calendarEventBackgroundStaticColor);
export const calendarEventBackgroundDynamicColor = createThemeColorToken(tokenNames.calendarEventBackgroundDynamicColor, tokenValues.calendarEventBackgroundDynamicColor);
export const calendarEventBackgroundTransientColor = createThemeColorToken(tokenNames.calendarEventBackgroundTransientColor, tokenValues.calendarEventBackgroundTransientColor);
export const calendarEventBorderStaticColor = createThemeColorToken(tokenNames.calendarEventBorderStaticColor, tokenValues.calendarEventBorderStaticColor);
export const calendarEventBorderTransientColor = createThemeColorToken(tokenNames.calendarEventBorderTransientColor, tokenValues.calendarEventBorderTransientColor);
export const calendarEventStaticFontColor = createThemeColorToken(tokenNames.calendarEventStaticFontColor, tokenValues.calendarEventStaticFontColor);
export const calendarEventDynamicFontColor = createThemeColorToken(tokenNames.calendarEventDynamicFontColor, tokenValues.calendarEventDynamicFontColor);
export const calendarEventTransientFontColor = createThemeColorToken(tokenNames.calendarEventTransientFontColor, tokenValues.calendarEventTransientFontColor);
export const calendarEventBackgroundHoverStaticColor = createThemeColorToken(tokenNames.calendarEventBackgroundHoverStaticColor, tokenValues.calendarEventBackgroundHoverStaticColor);
export const calendarEventBackgroundHoverDynamicColor = createThemeColorToken(tokenNames.calendarEventBackgroundHoverDynamicColor, tokenValues.calendarEventBackgroundHoverDynamicColor);
export const calendarEventBackgroundHoverTransientColor = createThemeColorToken(tokenNames.calendarEventBackgroundHoverTransientColor, tokenValues.calendarEventBackgroundHoverTransientColor);
export const calendarEventOuterBorderHighlightedColor = createThemeColorToken(tokenNames.calendarEventOuterBorderHighlightedColor, tokenValues.calendarEventOuterBorderHighlightedColor);
export const calendarRowBackgroundSelectedColor = createThemeColorToken(tokenNames.calendarRowBackgroundSelectedColor, tokenValues.calendarRowBackgroundSelectedColor);
export const calendarRowBackgroundConflictColor = createThemeColorToken(tokenNames.calendarRowBackgroundConflictColor, tokenValues.calendarRowBackgroundConflictColor);
export const calendarEventFillBlockedColor = createThemeColorToken(tokenNames.calendarEventFillBlockedColor, tokenValues.calendarEventFillBlockedColor);
export const calendarGrabHandleBackgroundColor = createThemeColorToken(tokenNames.calendarGrabHandleBackgroundColor, tokenValues.calendarGrabHandleBackgroundColor);
export const calendarGridBorderColor = createThemeColorToken(tokenNames.calendarGridBorderColor, tokenValues.calendarGridBorderColor);
export const calendarGroupHeaderBackgroundColor = createThemeColorToken(tokenNames.calendarGroupHeaderBackgroundColor, tokenValues.calendarGroupHeaderBackgroundColor);
// #endregion

// #region size tokens
export const controlHeight = createStringToken(tokenNames.controlHeight, tokenValues.controlHeight);
export const controlSlimHeight = createStringToken(tokenNames.controlSlimHeight, tokenValues.controlSlimHeight);
export const smallPadding = createStringToken(tokenNames.smallPadding, tokenValues.smallPadding);
export const mediumPadding = createStringToken(tokenNames.mediumPadding, tokenValues.mediumPadding);
export const standardPadding = createStringToken(tokenNames.standardPadding, tokenValues.standardPadding);
export const largePadding = createStringToken(tokenNames.largePadding, tokenValues.largePadding);
export const labelHeight = createStringToken(tokenNames.labelHeight, tokenValues.labelHeight);
export const borderWidth = createStringToken(tokenNames.borderWidth, tokenValues.borderWidth);
export const dividerWidth = createStringToken(tokenNames.dividerWidth, tokenValues.dividerWidth);
export const iconSize = createStringToken(tokenNames.iconSize, tokenValues.iconSize);
export const drawerWidth = createStringToken(tokenNames.drawerWidth, tokenValues.drawerWidth);
export const dialogSmallWidth = createStringToken(tokenNames.dialogSmallWidth, tokenValues.dialogSmallWidth);
export const dialogSmallHeight = createStringToken(tokenNames.dialogSmallHeight, tokenValues.dialogSmallHeight);
export const dialogSmallMaxHeight = createStringToken(tokenNames.dialogSmallMaxHeight, tokenValues.dialogSmallMaxHeight);
export const dialogLargeWidth = createStringToken(tokenNames.dialogLargeWidth, tokenValues.dialogLargeWidth);
export const dialogLargeHeight = createStringToken(tokenNames.dialogLargeHeight, tokenValues.dialogLargeHeight);
export const dialogLargeMaxHeight = createStringToken(tokenNames.dialogLargeMaxHeight, tokenValues.dialogLargeMaxHeight);
export const menuMinWidth = createStringToken(tokenNames.menuMinWidth, tokenValues.menuMinWidth);
export const bannerGapSize = createStringToken(tokenNames.bannerGapSize, tokenValues.bannerGapSize);
export const spinnerSmallHeight = createStringToken(tokenNames.spinnerSmallHeight, tokenValues.spinnerSmallHeight);
export const spinnerMediumHeight = createStringToken(tokenNames.spinnerMediumHeight, tokenValues.spinnerMediumHeight);
export const spinnerLargeHeight = createStringToken(tokenNames.spinnerLargeHeight, tokenValues.spinnerLargeHeight);
export const tableFitRowsHeight = createStringToken(tokenNames.tableFitRowsHeight, tokenValues.tableFitRowsHeight);
// #endregion

// #region drop shadow tokens
export const elevation1BoxShadow = createThemeColorToken(tokenNames.elevation1BoxShadow, tokenValues.elevation1BoxShadow);
export const elevation2BoxShadow = createThemeColorToken(tokenNames.elevation2BoxShadow, tokenValues.elevation2BoxShadow);
export const elevation3BoxShadow = createThemeColorToken(tokenNames.elevation3BoxShadow, tokenValues.elevation3BoxShadow);
// #endregion

// #region font tokens
export const [
    headlineFont,
    headlineFontColor,
    headlineDisabledFontColor,
    headlineFontFamily,
    headlineFontWeight,
    headlineFontSize,
    headlineFontLineHeight
] = createFontTokens(
    tokenNames.headlineFont,
    tokenValues.headlineFont,
    tokenValues.headlineFontColor,
    tokenValues.headlineDisabledFontColor,
    tokenValues.headlineFontFamily,
    tokenValues.headlineFontWeight,
    tokenValues.headlineFontSize,
    tokenValues.headlineFontLineHeight
);

export const [
    headlinePlus1Font,
    headlinePlus1FontColor,
    headlinePlus1DisabledFontColor,
    headlinePlus1FontFamily,
    headlinePlus1FontWeight,
    headlinePlus1FontSize,
    headlinePlus1FontLineHeight
] = createFontTokens(
    tokenNames.headlinePlus1Font,
    tokenValues.headlinePlus1Font,
    tokenValues.headlinePlus1FontColor,
    tokenValues.headlinePlus1DisabledFontColor,
    tokenValues.headlinePlus1FontFamily,
    tokenValues.headlinePlus1FontWeight,
    tokenValues.headlinePlus1FontSize,
    tokenValues.headlinePlus1FontLineHeight
);

export const [
    titlePlus2Font,
    titlePlus2FontColor,
    titlePlus2DisabledFontColor,
    titlePlus2FontFamily,
    titlePlus2FontWeight,
    titlePlus2FontSize,
    titlePlus2FontLineHeight
] = createFontTokens(
    tokenNames.titlePlus2Font,
    tokenValues.titlePlus2Font,
    tokenValues.titlePlus2FontColor,
    tokenValues.titlePlus2DisabledFontColor,
    tokenValues.titlePlus2FontFamily,
    tokenValues.titlePlus2FontWeight,
    tokenValues.titlePlus2FontSize,
    tokenValues.titlePlus2FontLineHeight
);

export const [
    titlePlus1Font,
    titlePlus1FontColor,
    titlePlus1DisabledFontColor,
    titlePlus1FontFamily,
    titlePlus1FontWeight,
    titlePlus1FontSize,
    titlePlus1FontLineHeight
] = createFontTokens(
    tokenNames.titlePlus1Font,
    tokenValues.titlePlus1Font,
    tokenValues.titlePlus1FontColor,
    tokenValues.titlePlus1DisabledFontColor,
    tokenValues.titlePlus1FontFamily,
    tokenValues.titlePlus1FontWeight,
    tokenValues.titlePlus1FontSize,
    tokenValues.titlePlus1FontLineHeight
);

export const [
    titleFont,
    titleFontColor,
    titleDisabledFontColor,
    titleFontFamily,
    titleFontWeight,
    titleFontSize,
    titleFontLineHeight
] = createFontTokens(
    tokenNames.titleFont,
    tokenValues.titleFont,
    tokenValues.titleFontColor,
    tokenValues.titleDisabledFontColor,
    tokenValues.titleFontFamily,
    tokenValues.titleFontWeight,
    tokenValues.titleFontSize,
    tokenValues.titleFontLineHeight
);

export const [
    subtitlePlus1Font,
    subtitlePlus1FontColor,
    subtitlePlus1DisabledFontColor,
    subtitlePlus1FontFamily,
    subtitlePlus1FontWeight,
    subtitlePlus1FontSize,
    subtitlePlus1FontLineHeight
] = createFontTokens(
    tokenNames.subtitlePlus1Font,
    tokenValues.subtitlePlus1Font,
    tokenValues.subtitlePlus1FontColor,
    tokenValues.subtitlePlus1DisabledFontColor,
    tokenValues.subtitlePlus1FontFamily,
    tokenValues.subtitlePlus1FontWeight,
    tokenValues.subtitlePlus1FontSize,
    tokenValues.subtitlePlus1FontLineHeight
);

export const [
    subtitleFont,
    subtitleFontColor,
    subtitleDisabledFontColor,
    subtitleFontFamily,
    subtitleFontWeight,
    subtitleFontSize,
    subtitleFontLineHeight
] = createFontTokens(
    tokenNames.subtitleFont,
    tokenValues.subtitleFont,
    tokenValues.subtitleFontColor,
    tokenValues.subtitleDisabledFontColor,
    tokenValues.subtitleFontFamily,
    tokenValues.subtitleFontWeight,
    tokenValues.subtitleFontSize,
    tokenValues.subtitleFontLineHeight
);

export const [
    linkFont,
    linkFontColor,
    linkDisabledFontColor,
    linkFontFamily,
    linkFontWeight,
    linkFontSize,
    linkFontLineHeight
] = createFontTokens(
    tokenNames.linkFont,
    tokenValues.linkFont,
    tokenValues.linkFontColor,
    tokenValues.linkDisabledFontColor,
    tokenValues.linkFontFamily,
    tokenValues.linkFontWeight,
    tokenValues.linkFontSize,
    tokenValues.linkFontLineHeight
);

export const [
    linkActiveFont,
    linkActiveFontColor,
    linkActiveDisabledFontColor,
    linkActiveFontFamily,
    linkActiveFontWeight,
    linkActiveFontSize,
    linkActiveFontLineHeight
] = createFontTokens(
    tokenNames.linkActiveFont,
    tokenValues.linkActiveFont,
    tokenValues.linkActiveFontColor,
    tokenValues.linkActiveDisabledFontColor,
    tokenValues.linkActiveFontFamily,
    tokenValues.linkActiveFontWeight,
    tokenValues.linkActiveFontSize,
    tokenValues.linkActiveFontLineHeight
);

export const [
    linkProminentFont,
    linkProminentFontColor,
    linkProminentDisabledFontColor,
    linkProminentFontFamily,
    linkProminentFontWeight,
    linkProminentFontSize,
    linkProminentFontLineHeight
] = createFontTokens(
    tokenNames.linkProminentFont,
    tokenValues.linkProminentFont,
    tokenValues.linkProminentFontColor,
    tokenValues.linkProminentDisabledFontColor,
    tokenValues.linkProminentFontFamily,
    tokenValues.linkProminentFontWeight,
    tokenValues.linkProminentFontSize,
    tokenValues.linkProminentFontLineHeight
);

export const [
    linkActiveProminentFont,
    linkActiveProminentFontColor,
    linkActiveProminentDisabledFontColor,
    linkActiveProminentFontFamily,
    linkActiveProminentFontWeight,
    linkActiveProminentFontSize,
    linkActiveProminentFontLineHeight
] = createFontTokens(
    tokenNames.linkActiveProminentFont,
    tokenValues.linkActiveProminentFont,
    tokenValues.linkActiveProminentFontColor,
    tokenValues.linkActiveProminentDisabledFontColor,
    tokenValues.linkActiveProminentFontFamily,
    tokenValues.linkActiveProminentFontWeight,
    tokenValues.linkActiveProminentFontSize,
    tokenValues.linkActiveProminentFontLineHeight
);

export const [
    placeholderFont,
    placeholderFontColor,
    placeholderDisabledFontColor,
    placeholderFontFamily,
    placeholderFontWeight,
    placeholderFontSize,
    placeholderFontLineHeight
] = createFontTokens(
    tokenNames.placeholderFont,
    tokenValues.placeholderFont,
    tokenValues.placeholderFontColor,
    tokenValues.placeholderDisabledFontColor,
    tokenValues.placeholderFontFamily,
    tokenValues.placeholderFontWeight,
    tokenValues.placeholderFontSize,
    tokenValues.placeholderFontLineHeight
);

export const [
    bodyFont,
    bodyFontColor,
    bodyDisabledFontColor,
    bodyFontFamily,
    bodyFontWeight,
    bodyFontSize,
    bodyFontLineHeight
] = createFontTokens(
    tokenNames.bodyFont,
    tokenValues.bodyFont,
    tokenValues.bodyFontColor,
    tokenValues.bodyDisabledFontColor,
    tokenValues.bodyFontFamily,
    tokenValues.bodyFontWeight,
    tokenValues.bodyFontSize,
    tokenValues.bodyFontLineHeight
);

export const [
    bodyEmphasizedFont,
    bodyEmphasizedFontColor,
    bodyEmphasizedDisabledFontColor,
    bodyEmphasizedFontFamily,
    bodyEmphasizedFontWeight,
    bodyEmphasizedFontSize,
    bodyEmphasizedFontLineHeight
] = createFontTokens(
    tokenNames.bodyEmphasizedFont,
    tokenValues.bodyEmphasizedFont,
    tokenValues.bodyEmphasizedFontColor,
    tokenValues.bodyEmphasizedDisabledFontColor,
    tokenValues.bodyEmphasizedFontFamily,
    tokenValues.bodyEmphasizedFontWeight,
    tokenValues.bodyEmphasizedFontSize,
    tokenValues.bodyEmphasizedFontLineHeight
);

export const [
    bodyPlus1Font,
    bodyPlus1FontColor,
    bodyPlus1DisabledFontColor,
    bodyPlus1FontFamily,
    bodyPlus1FontWeight,
    bodyPlus1FontSize,
    bodyPlus1FontLineHeight
] = createFontTokens(
    tokenNames.bodyPlus1Font,
    tokenValues.bodyPlus1Font,
    tokenValues.bodyPlus1FontColor,
    tokenValues.bodyPlus1DisabledFontColor,
    tokenValues.bodyPlus1FontFamily,
    tokenValues.bodyPlus1FontWeight,
    tokenValues.bodyPlus1FontSize,
    tokenValues.bodyPlus1FontLineHeight
);

export const [
    bodyPlus1EmphasizedFont,
    bodyPlus1EmphasizedFontColor,
    bodyPlus1EmphasizedDisabledFontColor,
    bodyPlus1EmphasizedFontFamily,
    bodyPlus1EmphasizedFontWeight,
    bodyPlus1EmphasizedFontSize,
    bodyPlus1EmphasizedFontLineHeight
] = createFontTokens(
    tokenNames.bodyPlus1EmphasizedFont,
    tokenValues.bodyPlus1EmphasizedFont,
    tokenValues.bodyPlus1EmphasizedFontColor,
    tokenValues.bodyPlus1EmphasizedDisabledFontColor,
    tokenValues.bodyPlus1EmphasizedFontFamily,
    tokenValues.bodyPlus1EmphasizedFontWeight,
    tokenValues.bodyPlus1EmphasizedFontSize,
    tokenValues.bodyPlus1EmphasizedFontLineHeight
);

export const [
    groupHeaderFont,
    groupHeaderFontColor,
    groupHeaderDisabledFontColor,
    groupHeaderFontFamily,
    groupHeaderFontWeight,
    groupHeaderFontSize,
    groupHeaderFontLineHeight
] = createFontTokens(
    tokenNames.groupHeaderFont,
    tokenValues.groupHeaderFont,
    tokenValues.groupHeaderFontColor,
    tokenValues.groupHeaderDisabledFontColor,
    tokenValues.groupHeaderFontFamily,
    tokenValues.groupHeaderFontWeight,
    tokenValues.groupHeaderFontSize,
    tokenValues.groupHeaderFontLineHeight
);

export const [
    controlLabelFont,
    controlLabelFontColor,
    controlLabelDisabledFontColor,
    controlLabelFontFamily,
    controlLabelFontWeight,
    controlLabelFontSize,
    controlLabelFontLineHeight
] = createFontTokens(
    tokenNames.controlLabelFont,
    tokenValues.controlLabelFont,
    tokenValues.controlLabelFontColor,
    tokenValues.controlLabelDisabledFontColor,
    tokenValues.controlLabelFontFamily,
    tokenValues.controlLabelFontWeight,
    tokenValues.controlLabelFontSize,
    tokenValues.controlLabelFontLineHeight
);

export const [
    buttonLabelFont,
    buttonLabelFontColor,
    buttonLabelDisabledFontColor,
    buttonLabelFontFamily,
    buttonLabelFontWeight,
    buttonLabelFontSize,
    buttonLabelFontLineHeight
] = createFontTokens(
    tokenNames.buttonLabelFont,
    tokenValues.buttonLabelFont,
    tokenValues.buttonLabelFontColor,
    tokenValues.buttonLabelDisabledFontColor,
    tokenValues.buttonLabelFontFamily,
    tokenValues.buttonLabelFontWeight,
    tokenValues.buttonLabelFontSize,
    tokenValues.buttonLabelFontLineHeight
);

export const [
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    tooltipCaptionDisabledFontColor,
    tooltipCaptionFontFamily,
    tooltipCaptionFontWeight,
    tooltipCaptionFontSize,
    tooltipCaptionFontLineHeight
] = createFontTokens(
    tokenNames.tooltipCaptionFont,
    tokenValues.tooltipCaptionFont,
    tokenValues.tooltipCaptionFontColor,
    tokenValues.tooltipCaptionDisabledFontColor,
    tokenValues.tooltipCaptionFontFamily,
    tokenValues.tooltipCaptionFontWeight,
    tokenValues.tooltipCaptionFontSize,
    tokenValues.tooltipCaptionFontLineHeight
);

export const [
    errorTextFont,
    errorTextFontColor,
    errorTextDisabledFontColor,
    errorTextFontFamily,
    errorTextFontWeight,
    errorTextFontSize,
    errorTextFontLineHeight
] = createFontTokens(
    tokenNames.errorTextFont,
    tokenValues.errorTextFont,
    tokenValues.errorTextFontColor,
    tokenValues.errorTextDisabledFontColor,
    tokenValues.errorTextFontFamily,
    tokenValues.errorTextFontWeight,
    tokenValues.errorTextFontSize,
    tokenValues.errorTextFontLineHeight
);

export const [
    tableHeaderFont,
    tableHeaderFontColor,
    tableHeaderDisabledFontColor,
    tableHeaderFontFamily,
    tableHeaderFontWeight,
    tableHeaderFontSize,
    tableHeaderFontLineHeight
] = createFontTokens(
    tokenNames.tableHeaderFont,
    tokenValues.tableHeaderFont,
    tokenValues.tableHeaderFontColor,
    tokenValues.tableHeaderDisabledFontColor,
    tokenValues.tableHeaderFontFamily,
    tokenValues.tableHeaderFontWeight,
    tokenValues.tableHeaderFontSize,
    tokenValues.tableHeaderFontLineHeight
);

export const [
    mentionFont,
    mentionFontColor,
    mentionDisabledFontColor,
    mentionFontFamily,
    mentionFontWeight,
    mentionFontSize,
    mentionFontLineHeight
] = createFontTokens(
    tokenNames.mentionFont,
    tokenValues.mentionFont,
    tokenValues.mentionFontColor,
    tokenValues.mentionDisabledFontColor,
    tokenValues.mentionFontFamily,
    tokenValues.mentionFontWeight,
    tokenValues.mentionFontSize,
    tokenValues.mentionFontLineHeight
);
// #endregion

// #region text transform tokens
export const groupHeaderTextTransform = createStringToken(tokenNames.groupHeaderTextTransform, tokenValues.groupHeaderTextTransform);
// #endregion

// #region animation tokens
export const smallDelay = createStringToken(tokenNames.smallDelay, tokenValues.smallDelay);
export const mediumDelay = createStringToken(tokenNames.mediumDelay, tokenValues.mediumDelay);
export const largeDelay = createStringToken(tokenNames.largeDelay, tokenValues.largeDelay);
// #endregion

// #region helpers
function createFontTokens(
    fontTokenName: string,
    font: string,
    fontColor: ThemeColor,
    disabledFontColor: ThemeColor,
    fontFamily: string,
    fontWeight: string,
    fontSize: string,
    fontLineHeight: string
): readonly [
    CSSDesignToken<string>,
    CSSDesignToken<string>,
    CSSDesignToken<string>,
    CSSDesignToken<string>,
    CSSDesignToken<string>,
    CSSDesignToken<string>,
    CSSDesignToken<string>
] {
    const fontNameParts = fontTokenName.split('-font');
    const tokenPrefixWithoutFont = fontNameParts[0];
    const fontFamilyWithFallback = `${fontFamily}, ${fontFamily} Fallback`;
    const fontToken = createStringToken(fontTokenName, font);
    const fontColorToken = createThemeColorToken(`${tokenPrefixWithoutFont}-font-color`, fontColor);
    const fontDisabledColorToken = createThemeColorToken(`${tokenPrefixWithoutFont}-disabled-font-color`, disabledFontColor);
    const fontFamilyToken = createStringToken(`${tokenPrefixWithoutFont}-font-family`, fontFamilyWithFallback);
    const fontWeightToken = createStringToken(`${tokenPrefixWithoutFont}-font-weight`, fontWeight);
    const fontSizeToken = createStringToken(`${tokenPrefixWithoutFont}-font-size`, fontSize);
    const fontLineHeightToken = createStringToken(`${tokenPrefixWithoutFont}-font-line-height`, fontLineHeight);

    return [
        fontToken,
        fontColorToken,
        fontDisabledColorToken,
        fontFamilyToken,
        fontWeightToken,
        fontSizeToken,
        fontLineHeightToken
    ] as const;
}

function createStringToken(tokenName: string, tokenValue: string): CSSDesignToken<string> {
    return DesignToken.create<string>(
        styleNameFromTokenName(tokenName)
    ).withDefault(tokenValue);
}

function createThemeColorToken(tokenName: string, themeColor: ThemeColor): CSSDesignToken<string> {
    return DesignToken.create<string>(
        styleNameFromTokenName(tokenName)
    ).withDefault((element: HTMLElement) => {
        switch (theme.getValueFor(element)) {
            case Theme.light:
                return themeColor.light;
            case Theme.dark:
                return themeColor.dark;
            case Theme.color:
                return themeColor.color;
            default:
                return themeColor.light;
        }
    });
}
// #endregion
