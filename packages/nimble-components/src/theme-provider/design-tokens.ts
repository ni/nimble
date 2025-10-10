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
    failColor: createThemeColor(Fail100LightUi, Fail100DarkUi, White),
    lineColor: createThemeColor(Black91, Black15, White),
    fillSelectedColor: createThemeColor(DigitalGreenLight, PowerGreen, White),
    fillHoverColor: createThemeColor(Black91, Black15, White),
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
    fillDownColor: hexToRgbaCssThemeColor(createThemeColor(Black91, Black15, White), 0.15, 0.15, 0.15),
    borderColor: alias.lineColor,
    borderRgbPartialColor: hexToRgbPartialThemeColor(alias.lineColor),
    failColor: alias.failColor,
    warningColor: createThemeColor(Warning100LightUi, Warning100DarkUi, White),
    passColor: createThemeColor(Pass100LightUi, Pass100DarkUi, White),
    informationColor: createThemeColor(Information100LightUi, Information100DarkUi, White),
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
    elevation1BoxShadow: createThemeColor(
        `0px 1px 4px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 1px 4px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 1px 4px ${hexToRgbaCssColor(Black, 0.16)}`
    ),
    elevation2BoxShadow: createThemeColor(
        `0px 2px 4px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 2px 4px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 2px 4px ${hexToRgbaCssColor(Black, 0.16)}`
    ),
    elevation3BoxShadow: createThemeColor(
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.16)}`,
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.16)}`
    ),
    ...createFont(
        'headline',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Headline1Family,
        Headline1Weight,
        Headline1Size,
        Headline1LineHeight
    ),
    ...createFont(
        'headlinePlus1',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Headline2Family,
        Headline2Weight,
        Headline2Size,
        Headline2LineHeight
    ),
    ...createFont(
        'titlePlus2',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Title3Family,
        Title3Weight,
        Title3Size,
        Title3LineHeight
    ),
    ...createFont(
        'titlePlus1',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Title2Family,
        Title2Weight,
        Title2Size,
        Title2LineHeight
    ),
    ...createFont(
        'title',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Title1Family,
        Title1Weight,
        Title1Size,
        Title1LineHeight
    ),
    ...createFont(
        'subtitlePlus1',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Subtitle2Family,
        Subtitle2Weight,
        Subtitle2Size,
        Subtitle2LineHeight
    ),
    ...createFont(
        'subtitle',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Subtitle1Family,
        Subtitle1Weight,
        Subtitle1Size,
        Subtitle1LineHeight
    ),
    ...createFont(
        'link',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        LinkLightUiFamily,
        LinkLightUiWeight,
        LinkLightUiSize,
        LinkLineHeight
    ),
    ...createFont(
        'linkActive',
        createThemeColor(DigitalGreenLight, DigitalGreenLight, hexToRgbaCssColor(White, 0.75)),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        LinkLightUiFamily,
        LinkLightUiWeight,
        LinkLightUiSize,
        LinkLineHeight
    ),
    ...createFont(
        'linkProminent',
        createThemeColor(DigitalGreenDark105, PowerGreen, White),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        LinkLightUiFamily,
        LinkLightUiWeight,
        LinkLightUiSize,
        LinkLineHeight
    ),
    ...createFont(
        'linkActiveProminent',
        createThemeColor(DigitalGreenLight, DigitalGreenLight, hexToRgbaCssColor(White, 0.75)),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        LinkLightUiFamily,
        LinkLightUiWeight,
        LinkLightUiSize,
        LinkLineHeight
    ),
    ...createFont(
        'placeholder',
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.6, 0.6, 0.6),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        PlaceholderFamily,
        PlaceholderWeight,
        PlaceholderSize,
        PlaceholderLineHeight
    ),
    ...createFont(
        'body',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        BodyFamily,
        BodyWeight,
        BodySize,
        BodyLineHeight
    ),
    ...createFont(
        'bodyEmphasized',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        BodyEmphasizedFamily,
        BodyEmphasizedWeight,
        BodyEmphasizedSize,
        BodyEmphasizedLineHeight
    ),
    ...createFont(
        'bodyPlus1',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        Body2Family,
        Body2Weight,
        Body2Size,
        Body2LineHeight
    ),
    ...createFont(
        'bodyPlus1Emphasized',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        BodyEmphasized2Family,
        BodyEmphasized2Weight,
        BodyEmphasized2Size,
        BodyEmphasized2LineHeight
    ),
    ...createFont(
        'groupHeader',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        GroupLabel1Family,
        GroupLabel1Weight,
        GroupLabel1Size,
        GroupLabel1LineHeight
    ),
    ...createFont(
        'controlLabel',
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.6, 0.6, 0.6),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        ControlLabel1Family,
        ControlLabel1Weight,
        ControlLabel1Size,
        ControlLabel1LineHeight
    ),
    ...createFont(
        'buttonLabel',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        ButtonLabel1Family,
        ButtonLabel1Weight,
        ButtonLabel1Size,
        ButtonLabel1LineHeight
    ),
    ...createFont(
        'tooltipCaption',
        alias.defaultFontColor,
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        TooltipCaptionFamily,
        TooltipCaptionWeight,
        TooltipCaptionSize,
        TooltipCaptionLineHeight
    ),
    ...createFont(
        'errorText',
        alias.failColor,
        hexToRgbaCssThemeColor(alias.failColor, 0.3, 0.3, 0.3),
        ErrorLightUiFamily,
        ErrorLightUiWeight,
        ErrorLightUiSize,
        TooltipCaptionLineHeight
    ),
    ...createFont(
        'tableHeader',
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.6, 0.6, 0.6),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        GridHeaderFamily,
        GridHeaderWeight,
        GridHeaderSize,
        TooltipCaptionLineHeight
    ),
    ...createFont(
        'mention',
        createThemeColor(DigitalGreenDark, PowerGreen, PowerGreen),
        hexToRgbaCssThemeColor(alias.defaultFontColor, 0.3, 0.3, 0.3),
        BodyFamily,
        BodyEmphasizedWeight,
        BodySize,
        BodyLineHeight
    ),
} as const;
// #endregion

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
).withDefault((element: HTMLElement) => getColorForTheme(element, tokenValues.elevation1BoxShadow));

export const elevation2BoxShadow = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.elevation2BoxShadow)
).withDefault((element: HTMLElement) => getColorForTheme(element, tokenValues.elevation2BoxShadow));

export const elevation3BoxShadow = DesignToken.create<string>(
    styleNameFromTokenName(tokenNames.elevation3BoxShadow)
).withDefault((element: HTMLElement) => getColorForTheme(element, tokenValues.elevation3BoxShadow));
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
type Font<T extends string> =
    {
        [K in `${T}Font` | `${T}FontFamily` | `${T}FontWeight` | `${T}FontSize` | `${T}FontLineHeight`]: string;
    } & {
        [K in `${T}FontColor` | `${T}DisabledFontColor`]: ThemeColor;
    };

function createFont<T extends string>(
    token: T,
    color: ThemeColor,
    disabledColor: ThemeColor,
    family: string,
    weight: string,
    size: string,
    lineHeight: string
): Font<T> {
    const familyWithFallback = `${family}, ${family} Fallback`;
    return {
        [`${token}Font`]: `${weight} ${size}/${lineHeight} ${familyWithFallback}`,
        [`${token}FontColor`]: color,
        [`${token}DisabledFontColor`]: disabledColor,
        [`${token}FontFamily`]: family,
        [`${token}FontWeight`]: weight,
        [`${token}FontSize`]: size,
        [`${token}FontLineHeight`]: lineHeight,
    } as Font<T>;
}

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
    const fontToken = DesignToken.create<string>(
        styleNameFromTokenName(fontTokenName)
    ).withDefault(font);

    const fontColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-font-color`)
    ).withDefault((element: HTMLElement) => getColorForTheme(element, fontColor));

    const fontDisabledColorToken = DesignToken.create<string>(
        styleNameFromTokenName(`${tokenPrefixWithoutFont}-disabled-font-color`)
    ).withDefault((element: HTMLElement) => getColorForTheme(element, disabledFontColor));

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

function createStringToken(tokenName: string, tokenValue: string): DesignToken<string> {
    return DesignToken.create<string>(
        styleNameFromTokenName(tokenName)
    ).withDefault(tokenValue);
}

function createThemeColorToken(tokenName: string, themeColor: ThemeColor): DesignToken<string> {
    return DesignToken.create<string>(
        styleNameFromTokenName(tokenName)
    ).withDefault((element: HTMLElement) => getColorForTheme(element, themeColor));
}

function getColorForTheme(
    element: HTMLElement,
    themeColor: { light: string, dark: string, color: string }
): string {
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
    } as const;
}
// #endregion
