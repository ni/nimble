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
import { hexToRgbaCssColor } from '../utilities/style/colors';

export interface ThemeColor {
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

export const tokenValues = {
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
    fillDownColor: hexToRgbaCssThemeColor(alias.fillHoverColor, 0.15, 0.15, 0.15),
    borderColor: alias.lineColor,
    borderRgbPartialColor: hexToRgbPartialThemeColor(alias.lineColor),
    failColor: alias.failColor,
    warningColor: createThemeColor(Warning100LightUi, Warning100DarkUi, White),
    passColor: createThemeColor(Pass100LightUi, Pass100DarkUi, White),
    informationColor: createThemeColor(Information100LightUi, Information100DarkUi, White),
    borderHoverColor: createThemeColor(DigitalGreenLight, PowerGreen, White),
    iconColor: createThemeColor(Black91, Black15, White),
    modalBackdropColor: hexToRgbaCssThemeColor(createThemeColor(Black, Black, Black), 0.3, 0.6, 0.6),
    popupBorderColor: hexToRgbaCssThemeColor(alias.lineColor, 0.3, 0.3, 0.3),
    cardBorderColor: hexToRgbaCssThemeColor(alias.lineColor, 0.1, 0.1, 0.1),
    graphGridlineColor: hexToRgbaCssThemeColor(alias.lineColor, 0.2, 0.2, 0.2),
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
    buttonFillPrimaryColor: hexToRgbaCssThemeColor(createThemeColor(Black91, Black15, White), 0.75, 0.3, 0.3),
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
    calendarRowBackgroundSelectedColor: hexToRgbaCssThemeColor(createThemeColor(DigitalGreenLight, PowerGreen, PowerGreen), 0.2, 0.2, 0.2),
    calendarRowBackgroundConflictColor: hexToRgbaCssThemeColor(createThemeColor(Fail100LightUi, Fail100DarkUi, Fail100DarkUi), 0.2, 0.2, 0.2),
    calendarEventFillBlockedColor: createThemeColor(hexToRgbaCssColor(Black91, 0.07), Black82, Black82),
    calendarGrabHandleBackgroundColor: createThemeColor(DigitalGreenLight, PowerGreen, PowerGreen),
    calendarGridBorderColor: createThemeColor(Black22, Black80, Black80),
    calendarGroupHeaderBackgroundColor: createThemeColor(Black7, hexToRgbaCssColor(Black91, 0.1), hexToRgbaCssColor(Black91, 0.1)),
    controlHeight: '32px',
    controlSlimHeight: '24px',
    smallPadding: '4px',
    mediumPadding: '8px',
    standardPadding: '16px',
    largePadding: '24px',
    labelHeight: '16px',
    borderWidth: '1px',
    dividerWidth: '2px',
    iconSize: '16px',
    drawerWidth: '784px',
    dialogSmallWidth: '400px',
    dialogSmallHeight: 'fit-content',
    dialogSmallMaxHeight: '600px',
    dialogLargeWidth: '1024px',
    dialogLargeHeight: '680px',
    dialogLargeMaxHeight: '680px',
    menuMinWidth: '176px',
    bannerGapSize: '1px',
    spinnerSmallHeight: '16px',
    spinnerMediumHeight: '32px',
    spinnerLargeHeight: '64px',
    tableFitRowsHeight: '480px',
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
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.3)}`,
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.3)}`,
        `0px 4px 8px ${hexToRgbaCssColor(Black, 0.3)}`
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
    groupHeaderTextTransform: 'uppercase',
    smallDelay: SmallDelay,
    mediumDelay: MediumDelay,
    largeDelay: LargeDelay
} as const;
// #endregion

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
