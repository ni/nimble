import { type CSSDesignToken, DesignToken } from '@ni/fast-foundation';
import { parseColorHexRGB } from '@ni/fast-colors';
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
    NiTulip,
    DigitalGreenLight10,
    PowerGreen10,
    DigitalGreenDark110,
    Black82,
    Black22,
    PowerGreen30,
    DigitalGreenLight30,
    PowerGreenDark50
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { Theme } from './types';
import { tokenNames, styleNameFromTokenName } from './design-token-names';
import { theme } from '.';
import { hexToRgbaCssColor } from '../utilities/style/colors';

interface ThemeColor {
    light: string;
    dark: string;
    color: string;
}

// #region token values
const alias = {
    warningColor: createThemeColor(Warning100LightUi, Warning100DarkUi, White),
    failColor: createThemeColor(Fail100LightUi, Fail100DarkUi, White),
    passColor: createThemeColor(Pass100LightUi, Pass100DarkUi, White),
    informationColor: createThemeColor(Information100LightUi, Information100DarkUi, White),
    lineColor: createThemeColor(Black91, Black15, White),
    fontColor: createThemeColor(Black91, Black15, White),
    fillSelectedColor: createThemeColor(DigitalGreenLight, PowerGreen, White),
    fillHoverColor: createThemeColor(Black91, Black15, White),
    fillDownColor: createThemeColor(Black91, Black15, White),
    defaultFontColor: createThemeColor(Black91, Black15, White)
} as const;

// prettier-ignore
const tokenValues = {
    actionRgbPartialColor: hexToRgbPartialThemeColor(createThemeColor(Black91, Black15, White)),
    applicationBackgroundColor: createThemeColor(White, Black85, ForestGreen),
    headerBackgroundColor: createThemeColor(Black7, Black88, ForestGreen),
    sectionBackgroundColor: createThemeColor(Black15, Black80, ForestGreen),
    sectionBackgroundImage: createThemeColor(
        `linear-gradient(${Black15}, ${hexToRgbaCssColor(Black15, 0)})`,
        `linear-gradient(${Black82}, ${hexToRgbaCssColor(Black82, 0)})`,
        `linear-gradient(${ForestGreen}, ${hexToRgbaCssColor(ForestGreen, 0)})`,
    ),
    dividerBackgroundColor: createThemeColor(Black15, Black80, ForestGreen),
    fillSelectedColor: hexToRgbaCssThemeColor(alias.fillSelectedColor, 0.2, 0.2, 0.2),
    fillSelectedRgbPartialColor: hexToRgbPartialThemeColor(alias.fillSelectedColor),
    fillHoverSelectedColor: hexToRgbaCssThemeColor(alias.fillSelectedColor, 0.15, 0.15, 0.15),
    fillHoverColor: hexToRgbaCssThemeColor(alias.fillHoverColor, 0.1, 0.1, 0.1),
    fillHoverRgbPartialColor: hexToRgbPartialThemeColor(alias.fillHoverColor),
    fillDownColor: hexToRgbaCssThemeColor(alias.fillDownColor, 0.15, 0.15, 0.15),
    borderColor: alias.lineColor,
    borderRgbPartialColor: hexToRgbPartialThemeColor(alias.lineColor),
    failColor: alias.failColor,
    warningColor: alias.warningColor,
    passColor: alias.passColor,
    informationColor: alias.informationColor,
    borderHoverColor: createThemeColor(DigitalGreenLight, PowerGreen, White),
    iconColor: createThemeColor(Black91, Black15, White),
    modalBackdropColor: createThemeColor(hexToRgbaCssColor(Black, 0.3), hexToRgbaCssColor(Black, 0.6), hexToRgbaCssColor(Black, 0.6)),
    popupBorderColor: createThemeColor(hexToRgbaCssColor(Black91, 0.3), hexToRgbaCssColor(Black15, 0.3), hexToRgbaCssColor(White, 0.3)),
    cardBorderColor: hexToRgbaCssThemeColor(alias.lineColor, 0.1, 0.1, 0.1),
    graphGridlineColor: createThemeColor(hexToRgbaCssColor(Black91, 0.2), hexToRgbaCssColor(Black15, 0.2), hexToRgbaCssColor(White, 0.2)),
    graphTrace1Color: createThemeColor(NiIndigoDark2, NiSky, White),
    graphTrace2Color: createThemeColor(NiScarletDark1, NiScarlet, hexToRgbaCssColor(White, 0.7)),
    graphTrace3Color: createThemeColor(NiFernDark1, NiFern, hexToRgbaCssColor(White, 0.4)),
    graphTrace4Color: createThemeColor(NiPlumDark1, NiSeaLight, hexToRgbaCssColor(White, 0.25)),
    graphTrace5Color: createThemeColor(NiSeaDark2, NiSea, hexToRgbaCssColor(White, 0.55)),
    graphTrace6Color: createThemeColor(NiTulip, NiTulip, hexToRgbaCssColor(White, 0.85)),
    graphTrace7Color: createThemeColor(NiScarletDark3, NiHoneyLight, hexToRgbaCssColor(White, 0.325)),
    graphTrace8Color: createThemeColor(NiIndigo, NiIndigo, hexToRgbaCssColor(White, 0.625)),
    tooltipBackgroundColor: createThemeColor(Black15, Black85, ForestGreen),
    tableRowBorderColor: createThemeColor(Black15, Black80, ForestGreen),
    tagFillColor: hexToRgbaCssThemeColor(alias.lineColor, 0.1, 0.1, 0.1),
    buttonFillPrimaryColor: createThemeColor(hexToRgbaCssColor(Black91, 0.75), hexToRgbaCssColor(Black15, 0.3), hexToRgbaCssColor(White, 0.3)),
    buttonPrimaryFontColor: createThemeColor(Black15, Black15, White),
    buttonFillAccentColor: createThemeColor(DigitalGreenDark, DigitalGreenLight, hexToRgbaCssColor(White, 0.1)),
    buttonAccentBlockFontColor: createThemeColor(White, Black15, White),
    buttonAccentOutlineFontColor: createThemeColor(DigitalGreenDark105, PowerGreen, White),
    buttonBorderAccentOutlineColor: createThemeColor(DigitalGreenLight, PowerGreen, hexToRgbaCssColor(White, 0.3)),
    calendarEventBackgroundStaticColor: createThemeColor(DigitalGreenLight10, PowerGreen10, PowerGreen10),
    calendarEventBackgroundDynamicColor: createThemeColor(DigitalGreenDark105, DigitalGreenDark, DigitalGreenDark),
    calendarEventBackgroundTransientColor: createThemeColor(DigitalGreenDark105, DigitalGreenDark, DigitalGreenDark),
    calendarEventBorderStaticColor: createThemeColor(DigitalGreenLight, DigitalGreenLight, DigitalGreenLight),
    calendarEventBorderTransientColor: createThemeColor(DigitalGreenLight, hexToRgbaCssColor(PowerGreen, 0.85), hexToRgbaCssColor(PowerGreen, 0.85)),
    calendarEventStaticFontColor: createThemeColor(DigitalGreenDark110, PowerGreenDark50, PowerGreenDark50),
    calendarEventDynamicFontColor: createThemeColor(White, White, White),
    calendarEventTransientFontColor: createThemeColor(White, White, White),
    calendarEventBackgroundHoverStaticColor: createThemeColor(DigitalGreenLight30, PowerGreen30, PowerGreen30),
    calendarEventBackgroundHoverDynamicColor: createThemeColor(DigitalGreenDark110, DigitalGreenDark105, DigitalGreenDark105),
    calendarEventBackgroundHoverTransientColor: createThemeColor(DigitalGreenDark110, DigitalGreenDark105, DigitalGreenDark105),
    calendarEventOuterBorderHighlightedColor: createThemeColor(Black88, hexToRgbaCssColor(White, 0.85), hexToRgbaCssColor(White, 0.85)),
    calendarRowBackgroundSelectedColor: createThemeColor(hexToRgbaCssColor(DigitalGreenLight, 0.2), hexToRgbaCssColor(PowerGreen, 0.2), hexToRgbaCssColor(PowerGreen, 0.2)),
    calendarRowBackgroundConflictColor: createThemeColor(hexToRgbaCssColor(Fail100LightUi, 0.2), hexToRgbaCssColor(Fail100DarkUi, 0.2), hexToRgbaCssColor(Fail100DarkUi, 0.2)),
    calendarEventFillBlockedColor: createThemeColor(hexToRgbaCssColor(Black91, 0.07), Black82, Black82),
    calendarGrabHandleBackgroundColor: createThemeColor(DigitalGreenLight, PowerGreen, PowerGreen),
    calendarGridBorderColor: createThemeColor(Black22, Black80, Black80),
    calendarGroupHeaderBackgroundColor: createThemeColor(Black7, hexToRgbaCssColor(Black91, 0.1), hexToRgbaCssColor(Black91, 0.1)),
    // elevation1BoxShadowColor: createThemeColor(Black, Black, Black),
    // elevation2BoxShadowColor: createThemeColor(Black, Black, Black),
    // elevation3BoxShadowColor: createThemeColor(Black, Black, Black),
    linkProminentFontColor: createThemeColor(DigitalGreenDark105, PowerGreen, White),
    mentionFontColor: createThemeColor(DigitalGreenDark, PowerGreen, PowerGreen),
    ...createFontTokenValues(
        'body',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        BodyFamily,
        BodyWeight,
        BodySize,
        BodyLineHeight
    ),
} as const;
// #endregion

console.log(tokenValues);

// #region color tokens
export const actionRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.actionRgbPartialColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.actionRgbPartialColor));

export const applicationBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.applicationBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.applicationBackgroundColor));

export const headerBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.headerBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.headerBackgroundColor));

export const sectionBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.sectionBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.sectionBackgroundColor));

export const sectionBackgroundImage = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.sectionBackgroundImage)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.sectionBackgroundImage));

export const dividerBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dividerBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.dividerBackgroundColor));

export const fillSelectedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillSelectedColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillSelectedColor));

export const fillSelectedRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillSelectedRgbPartialColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillSelectedRgbPartialColor));

export const fillHoverSelectedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverSelectedColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillHoverSelectedColor));

export const fillHoverColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillHoverColor));

export const fillHoverRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillHoverRgbPartialColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillHoverRgbPartialColor));

export const fillDownColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.fillDownColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.fillDownColor));

export const borderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.borderColor));

export const borderRgbPartialColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderRgbPartialColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.borderRgbPartialColor));

export const failColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.failColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.failColor));

export const warningColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.warningColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.warningColor));

export const passColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.passColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.passColor));

export const informationColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.informationColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.informationColor));

export const borderHoverColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.borderHoverColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.borderHoverColor));
// #endregion

// #region component color tokens
export const iconColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.iconColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.iconColor));

export const modalBackdropColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.modalBackdropColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.modalBackdropColor));

export const popupBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.popupBorderColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.popupBorderColor));

export const cardBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.cardBorderColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.cardBorderColor));

export const graphGridlineColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphGridlineColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphGridlineColor));

export const graphTrace1Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace1Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace1Color));

export const graphTrace2Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace2Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace2Color));

export const graphTrace3Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace3Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace3Color));

export const graphTrace4Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace4Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace4Color));

export const graphTrace5Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace5Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace5Color));

export const graphTrace6Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace6Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace6Color));

export const graphTrace7Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace7Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace7Color));

export const graphTrace8Color = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.graphTrace8Color)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.graphTrace8Color));

export const tooltipBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tooltipBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.tooltipBackgroundColor));

export const tableRowBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tableRowBorderColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.tableRowBorderColor));

export const tagFillColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tagFillColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.tagFillColor));

export const buttonFillPrimaryColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonFillPrimaryColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonFillPrimaryColor));

export const buttonPrimaryFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonPrimaryFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonPrimaryFontColor));

export const buttonFillAccentColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonFillAccentColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonFillAccentColor));

export const buttonAccentBlockFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonAccentBlockFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonAccentBlockFontColor));

export const buttonAccentOutlineFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonAccentOutlineFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonAccentOutlineFontColor));

export const buttonBorderAccentOutlineColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.buttonBorderAccentOutlineColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.buttonBorderAccentOutlineColor));

export const calendarEventBackgroundStaticColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventBackgroundStaticColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundStaticColor));

export const calendarEventBackgroundDynamicColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventBackgroundDynamicColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundDynamicColor));

export const calendarEventBackgroundTransientColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventBackgroundTransientColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundTransientColor));

export const calendarEventBorderStaticColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventBorderStaticColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBorderStaticColor));

export const calendarEventBorderTransientColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventBorderTransientColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBorderTransientColor));

export const calendarEventStaticFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventStaticFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventStaticFontColor));

export const calendarEventDynamicFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventDynamicFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventDynamicFontColor));

export const calendarEventTransientFontColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventTransientFontColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventTransientFontColor));

export const calendarEventBackgroundHoverStaticColor = DesignToken.create<string>(
    styleNameFromTokenName(
        tokenNames.calendarEventBackgroundHoverStaticColor
    )
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundHoverStaticColor));

export const calendarEventBackgroundHoverDynamicColor = DesignToken.create<string>(
    styleNameFromTokenName(
        tokenNames.calendarEventBackgroundHoverDynamicColor
    )
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundHoverDynamicColor));

export const calendarEventBackgroundHoverTransientColor = DesignToken.create<string>(
    styleNameFromTokenName(
        tokenNames.calendarEventBackgroundHoverTransientColor
    )
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventBackgroundHoverTransientColor));

export const calendarEventOuterBorderHighlightedColor = DesignToken.create<string>(
    styleNameFromTokenName(
        tokenNames.calendarEventOuterBorderHighlightedColor
    )
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventOuterBorderHighlightedColor));

export const calendarRowBackgroundSelectedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarRowBackgroundSelectedColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarRowBackgroundSelectedColor));

export const calendarRowBackgroundConflictColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarRowBackgroundConflictColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarRowBackgroundConflictColor));

export const calendarEventFillBlockedColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarEventFillBlockedColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarEventFillBlockedColor));

export const calendarGrabHandleBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarGrabHandleBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarGrabHandleBackgroundColor));

export const calendarGridBorderColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarGridBorderColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarGridBorderColor));

export const calendarGroupHeaderBackgroundColor = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.calendarGroupHeaderBackgroundColor)
).withDefault((element: HTMLElement) => getColorForTheme2(element, tokenValues.calendarGroupHeaderBackgroundColor));
// #endregion

// #region size tokens
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
export const dividerWidth = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.dividerWidth)
).withDefault('2px');
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

// The token gets a default value of the table's default height (480px)
// but is given a calculated value in the table styles.
export const tableFitRowsHeight = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.tableFitRowsHeight)
).withDefault('480px');
// #endregion

// #region drop shadow tokens
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
] = createFontTokens2(
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
// #endregion

// #region text transform tokens
export const groupHeaderTextTransform = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.groupHeaderTextTransform)
).withDefault('uppercase');
// #endregion

// #region animation tokens
export const smallDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.smallDelay)
).withDefault(SmallDelay);
export const mediumDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.mediumDelay)
).withDefault(MediumDelay);
export const largeDelay = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.largeDelay)
).withDefault(LargeDelay);
// #endregion

// #region helpers
type FontTheme<T extends string> =
    {
        [K in `${T}Font` | `${T}FontFamily` | `${T}FontWeight` | `${T}FontSize` | `${T}FontLineHeight`]: string;
    } & {
        [K in `${T}FontColor` | `${T}DisabledFontColor`]: ThemeColor;
    };

function createFontTokenValues<T extends string>(
    token: T,
    color: ThemeColor,
    disabledColor: ThemeColor,
    family: string,
    weight: string,
    size: string,
    lineHeight: string
): FontTheme<T> {
    const familyWithFallback = `${family}, ${family} Fallback`;
    return {
        [`${token}Font`]: `${weight} ${size}/${lineHeight} ${familyWithFallback}`,
        [`${token}FontColor`]: color,
        [`${token}DisabledFontColor`]: disabledColor,
        [`${token}FontFamily`]: family,
        [`${token}FontWeight`]: weight,
        [`${token}FontSize`]: size,
        [`${token}FontLineHeight`]: lineHeight,
    } as FontTheme<T>;
}

function createFontTokens2(
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
    const fontToken = DesignToken.create<string>(
        styleNameFromTokenName(fontTokenName)
    ).withDefault(font);

    const fontColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-color`)
    ).withDefault((element: HTMLElement) => getColorForTheme2(element, fontColor));

    const fontDisabledColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-disabled-font-color`)
    ).withDefault((element: HTMLElement) => getColorForTheme2(element, disabledFontColor));

    const fontFamilyToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-family`)
    ).withDefault(fontFamilyWithFallback);

    const fontWeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-weight`)
    ).withDefault(fontWeight);

    const fontSizeToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-size`)
    ).withDefault(fontSize);

    const fontLineHeightToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-line-height`)
    ).withDefault(fontLineHeight);

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

function getColorForTheme2(
    element: HTMLElement,
    colors: { light: string, dark: string, color: string }
): string {
    switch (theme.getValueFor(element)) {
        case Theme.light:
            return colors.light;
        case Theme.dark:
            return colors.dark;
        case Theme.color:
            return colors.color;
        default:
            return colors.light;
    }
}

function getFailColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Fail100LightUi, Fail100DarkUi, White);
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White);
}

function hexToRgbaCssThemeColor(themeColor: ThemeColor, lightAlpha: number, darkAlpha: number, colorAlpha: number): ThemeColor {
    return {
        light: hexToRgbaCssColor(themeColor.light, lightAlpha),
        dark: hexToRgbaCssColor(themeColor.dark, darkAlpha),
        color: hexToRgbaCssColor(themeColor.color, colorAlpha),
    };
}

function hexToRgbPartial(hexValue: string): string {
    const { r, g, b } = parseColorHexRGB(hexValue)!;
    return `${r * 255}, ${g * 255}, ${b * 255}`;
}

function hexToRgbPartialThemeColor(themeColor: ThemeColor): ThemeColor {
    return {
        light: hexToRgbPartial(themeColor.light),
        dark: hexToRgbPartial(themeColor.dark),
        color: hexToRgbPartial(themeColor.color),
    };
}

function createThemeColor(light: string, dark: string, color: string): ThemeColor {
    return {
        light,
        dark,
        color
    };
}
// #endregion
