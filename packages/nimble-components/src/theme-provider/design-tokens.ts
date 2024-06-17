import { CSSDesignToken, DesignToken } from '@microsoft/fast-foundation';
import { parseColorHexRGB } from '@microsoft/fast-colors';
import {
    Black,
    Black7,
    Black15,
    Black80,
    Black85,
    Black88,
    Black91,
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
    Body2Family,
    Body2Size,
    Body2Weight,
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
    BodyEmphasized2Size,
    BodyEmphasized2Family,
    BodyEmphasized2Weight,
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
    BodyEmphasized2LineHeight,
    BodyLineHeight,
    Body2LineHeight,
    GroupLabel1LineHeight,
    ControlLabel1LineHeight,
    ButtonLabel1LineHeight,
    TooltipCaptionLineHeight,
    Information100LightUi,
    Information100DarkUi,
    DigitalGreenDark,
    PowerGreen,
    GridHeaderFamily,
    GridHeaderWeight,
    GridHeaderSize,
    DigitalGreenDark105,
    NiFern,
    NiFernDark1,
    NiHoneyLight,
    NiIndigo,
    NiIndigoDark2,
    NiPlumDark1,
    NiScarlet,
    NiScarletDark1,
    NiScarletDark3,
    NiSea,
    NiSeaLight,
    NiSeaDark2,
    NiSky,
    NiTulip
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

export const fillHoverRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverRgbPartialColor)
).withDefault((element: HTMLElement) => hexToRgbPartial(getFillHoverColorForTheme(element)));

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
).withDefault((element: HTMLElement) => getColorForTheme(element, DigitalGreenLight, PowerGreen, White));

// Component Color Tokens
export const iconColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White));

export const modalBackdropColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.modalBackdropColor)
).withDefault((element: HTMLElement) => getModalBackdropForTheme(element));

export const popupBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBorderColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.3));

export const cardBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.cardBorderColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.1));

export const graphGridlineColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphGridlineColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.2));

export const graphTrace1Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace1Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiIndigoDark2, NiSky, White));

export const graphTrace2Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace2Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiScarletDark1, NiScarlet, White));

export const graphTrace3Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace3Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiFernDark1, NiFern, White));

export const graphTrace4Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace4Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiPlumDark1, NiSeaLight, White));

export const graphTrace5Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace5Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiSeaDark2, NiSea, White));

export const graphTrace6Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace6Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiTulip, NiTulip, White));

export const graphTrace7Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace7Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiScarletDark3, NiHoneyLight, White));

export const graphTrace8Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace8Color)
).withDefault((element: HTMLElement) => getColorForTheme(element, NiIndigo, NiIndigo, White));

export const tooltipBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black85, ForestGreen));

export const tableRowBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tableRowBorderColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black80, ForestGreen));

export const tagFillColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tagFillColor)
).withDefault((element: HTMLElement) => hexToRgbaCssColor(getColorForTheme(element, Black91, Black15, White), 0.1));

export const buttonFillPrimaryColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonFillPrimaryColor)
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    hexToRgbaCssColor(Black91, 0.75),
    hexToRgbaCssColor(Black15, 0.3),
    hexToRgbaCssColor(White, 0.3)
));

export const buttonPrimaryFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonPrimaryFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, Black15, Black15, White));

export const buttonFillAccentColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonFillAccentColor)
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    DigitalGreenDark,
    DigitalGreenLight,
    hexToRgbaCssColor(White, 0.1)
));

export const buttonAccentBlockFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonAccentBlockFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black15, White));

export const buttonAccentOutlineFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonAccentOutlineFontColor)
).withDefault((element: HTMLElement) => getColorForTheme(element, DigitalGreenDark105, PowerGreen, White));

export const buttonBorderAccentOutlineColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonBorderAccentOutlineColor)
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    DigitalGreenLight,
    PowerGreen,
    hexToRgbaCssColor(White, 0.3)
));

// Component Sizing Tokens
export const controlHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlHeight)
).withDefault('32px');
export const controlSlimHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.controlSlimHeight)
).withDefault('24px');
export const smallPadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallPadding)
).withDefault('4px');
export const mediumPadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.mediumPadding)
).withDefault('8px');
export const standardPadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.standardPadding)
).withDefault('16px');
export const largePadding = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.largePadding)
).withDefault('24px');
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
export const dialogSmallWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogSmallWidth)
).withDefault('400px');
export const dialogSmallHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogSmallHeight)
).withDefault('fit-content');
export const dialogSmallMaxHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogSmallMaxHeight)
).withDefault('600px');
export const dialogLargeWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogLargeWidth)
).withDefault('1024px');
export const dialogLargeHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogLargeHeight)
).withDefault('680px');
export const dialogLargeMaxHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dialogLargeMaxHeight)
).withDefault('680px');
export const menuMinWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.menuMinWidth)
).withDefault('176px');
export const bannerGapSize = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.bannerGapSize)
).withDefault('1px');

export const spinnerSmallHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.spinnerSmallHeight)
).withDefault('16px');
export const spinnerMediumHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.spinnerMediumHeight)
).withDefault('32px');
export const spinnerLargeHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.spinnerLargeHeight)
).withDefault('64px');

// Drop Shadow Tokens
export const elevation1BoxShadow = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.elevation1BoxShadow)
).withDefault(
    (element: HTMLElement) => `0px 1px 4px ${hexToRgbaCssColor(
        getColorForTheme(element, Black, Black, Black),
        0.16
    )}`
);

export const elevation2BoxShadow = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.elevation2BoxShadow)
).withDefault(
    (element: HTMLElement) => `0px 2px 4px ${hexToRgbaCssColor(
        getColorForTheme(element, Black, Black, Black),
        0.16
    )}`
);

export const elevation3BoxShadow = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.elevation3BoxShadow)
).withDefault(
    (element: HTMLElement) => `0px 4px 8px ${hexToRgbaCssColor(
        getColorForTheme(element, Black, Black, Black),
        0.3
    )}`
);

// Font Tokens
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Headline1Family,
    Headline1Weight,
    Headline1Size,
    Headline1LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Headline2Family,
    Headline2Weight,
    Headline2Size,
    Headline2LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title3Family,
    Title3Weight,
    Title3Size,
    Title3LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title2Family,
    Title2Weight,
    Title2Size,
    Title2LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Title1Family,
    Title1Weight,
    Title1Size,
    Title1LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Subtitle2Family,
    Subtitle2Weight,
    Subtitle2Size,
    Subtitle2LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Subtitle1Family,
    Subtitle1Weight,
    Subtitle1Size,
    Subtitle1LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    LinkLightUiFamily,
    LinkLightUiWeight,
    LinkLightUiSize,
    LinkLineHeight
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
    (element: HTMLElement) => getColorForTheme(
        element,
        DigitalGreenLight,
        DigitalGreenLight,
        hexToRgbaCssColor(White, 0.75)
    ),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    LinkLightUiFamily,
    LinkLightUiWeight,
    LinkLightUiSize,
    LinkLineHeight
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
    (element: HTMLElement) => getColorForTheme(element, DigitalGreenDark105, PowerGreen, White),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    LinkLightUiFamily,
    LinkLightUiWeight,
    LinkLightUiSize,
    LinkLineHeight
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
    (element: HTMLElement) => getColorForTheme(
        element,
        DigitalGreenLight,
        DigitalGreenLight,
        hexToRgbaCssColor(White, 0.75)
    ),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    LinkLightUiFamily,
    LinkLightUiWeight,
    LinkLightUiSize,
    LinkLineHeight
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
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    PlaceholderFamily,
    PlaceholderWeight,
    PlaceholderSize,
    PlaceholderLineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyFamily,
    BodyWeight,
    BodySize,
    BodyLineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyEmphasizedFamily,
    BodyEmphasizedWeight,
    BodyEmphasizedSize,
    BodyEmphasizedLineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    Body2Family,
    Body2Weight,
    Body2Size,
    Body2LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyEmphasized2Family,
    BodyEmphasized2Weight,
    BodyEmphasized2Size,
    BodyEmphasized2LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    GroupLabel1Family,
    GroupLabel1Weight,
    GroupLabel1Size,
    GroupLabel1LineHeight
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
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    ControlLabel1Family,
    ControlLabel1Weight,
    ControlLabel1Size,
    ControlLabel1LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    ButtonLabel1Family,
    ButtonLabel1Weight,
    ButtonLabel1Size,
    ButtonLabel1LineHeight
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
    (element: HTMLElement) => getDefaultFontColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    TooltipCaptionFamily,
    TooltipCaptionWeight,
    TooltipCaptionSize,
    TooltipCaptionLineHeight
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
    (element: HTMLElement) => getFailColorForTheme(element),
    (element: HTMLElement) => hexToRgbaCssColor(getFailColorForTheme(element), 0.3),
    ErrorLightUiFamily,
    ErrorLightUiWeight,
    ErrorLightUiSize,
    TooltipCaptionLineHeight
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
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.6),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    GridHeaderFamily,
    GridHeaderWeight,
    GridHeaderSize,
    TooltipCaptionLineHeight
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
    (element: HTMLElement) => getColorForTheme(element, DigitalGreenDark, PowerGreen, PowerGreen),
    (element: HTMLElement) => hexToRgbaCssColor(getDefaultFontColorForTheme(element), 0.3),
    BodyFamily,
    BodyEmphasizedWeight,
    BodySize,
    BodyLineHeight
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
    const { r, g, b } = parseColorHexRGB(hexValue)!;
    return `${r * 255}, ${g * 255}, ${b * 255}`;
}

function createFontTokens(
    fontTokenName: string,
    colorFunction: (element: HTMLElement) => string,
    disabledColorFunction: (element: HTMLElement) => string,
    family: string,
    weight: string,
    size: string,
    lineHeight: string
): readonly [
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
    ) {
        throw new Error(
            'createFontTokens parameter unexpectedly set to empty string'
        );
    }

    const familyWithFallback = `${family}, ${family} Fallback`;
    const fontToken = DesignToken.create<string>(
        styleNameFromTokenName(fontTokenName)
    ).withDefault(`${weight} ${size}/${lineHeight} ${familyWithFallback}`);

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
    ).withDefault(familyWithFallback);

    const fontWeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-weight`)
    ).withDefault(weight);

    const fontSizeToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-size`)
    ).withDefault(size);

    const fontLineHeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-line-height`)
    ).withDefault(lineHeight);

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
    return getColorForTheme(element, DigitalGreenLight, PowerGreen, White);
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
