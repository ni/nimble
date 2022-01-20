import { CSSDesignToken, DesignToken } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
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
    LegacyContentFamily
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { NimbleTheme } from './types';
import * as tokenNames from './design-token-names';

// Theme token definition that other tokens are based on.
// Not represented as a CSS custom property, instead available
// as an attribute of theme provider.
export const theme = DesignToken.create<NimbleTheme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(NimbleTheme.Light);

// Color Tokens
export const actionColorRgb = createTokenWithPrefix<string>(tokenNames.actionColorRgb).withDefault(
    (element: HTMLElement) => rgbString(
        getColorForTheme(element, Black91, Black15, White, SlLegacyBlue)
    )
);

export const applicationBackgroundColor = createTokenWithPrefix<string>(
    tokenNames.applicationBackgroundColor
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, Enterprise, White));

export const fillColorSelected = createTokenWithPrefix<string>(
    tokenNames.fillColorSelected
).withDefault((element: HTMLElement) => hexToRgba(getFillColorSelectedForTheme(element), 0.3));

export const fillColorSelectedRgb = createTokenWithPrefix<string>(
    tokenNames.fillColorSelectedRgb
).withDefault((element: HTMLElement) => rgbString(getFillColorSelectedForTheme(element)));

export const fillColorSelectedHover = createTokenWithPrefix<string>(
    tokenNames.fillColorSelectedHover
).withDefault((element: HTMLElement) => hexToRgba(getFillColorSelectedForTheme(element), 0.15));

export const fillColorHover = createTokenWithPrefix<string>(tokenNames.fillColorHover).withDefault(
    (element: HTMLElement) => hexToRgba(getFillColorHoverForTheme(element), 0.1)
);

export const borderColor = createTokenWithPrefix<string>(tokenNames.borderColor).withDefault(
    (element: HTMLElement) => getDefaultLineColorForTheme(element)
);

export const borderColorRgb = createTokenWithPrefix<string>(tokenNames.borderColorRgb).withDefault(
    (element: HTMLElement) => rgbString(getDefaultLineColorForTheme(element))
);

export const failColor = createTokenWithPrefix<string>(tokenNames.failColor).withDefault(
    (element: HTMLElement) => getFailColorForTheme(element)
);

export const warningColor = createTokenWithPrefix<string>(tokenNames.warningColor).withDefault(
    (element: HTMLElement) => getWarningColorForTheme(element)
);

export const passColor = createTokenWithPrefix<string>(tokenNames.passColor).withDefault(
    (element: HTMLElement) => getPassColorForTheme(element)
);

export const borderColorHover = createTokenWithPrefix<string>(
    tokenNames.borderColorHover
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    Selection100,
    Selection100,
    White,
    hexToRgba(SlLegacyBlue, 0.9)
));

// Component Color Tokens
export const iconColor = createTokenWithPrefix<string>(
    tokenNames.iconColor
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, Black88));

export const popupBoxShadowColor = createTokenWithPrefix<string>(
    tokenNames.popupBoxShadowColor
).withDefault((element: HTMLElement) => hexToRgba(
    getColorForTheme(element, Black75, Black85, Black85, Black75),
    0.3
));

export const popupBorderColor = createTokenWithPrefix<string>(
    tokenNames.popupBorderColor
).withDefault((element: HTMLElement) => hexToRgba(getColorForTheme(element, Black91, Black15, White, Black91), 0.3));

// Component Sizing Tokens
export const controlHeight = createTokenWithPrefix<string>(tokenNames.controlHeight).withDefault('32px');
export const standardPadding = createTokenWithPrefix<string>(tokenNames.standardPadding).withDefault('16px');
export const labelHeight = createTokenWithPrefix<string>(tokenNames.labelHeight).withDefault('16px');
export const borderWidth = createTokenWithPrefix<string>(tokenNames.borderWidth).withDefault('1px');
export const iconSize = createTokenWithPrefix<string>(tokenNames.iconSize).withDefault('16px');
export const drawerWidth = createTokenWithPrefix<string>(tokenNames.drawerWidth).withDefault('784px');

// Font Family Tokens
export const fontFamily = createTokenWithPrefix<string>(tokenNames.fontFamily).withDefault(
    (element: HTMLElement) => getFontForTheme(element)
);
export const labelFontFamily = createTokenWithPrefix<string>(tokenNames.labelFontFamily).withDefault(
    (element: HTMLElement) => getLabelFontForTheme(element)
);
export const groupLabelFontFamily = createTokenWithPrefix<string>(
    tokenNames.groupLabelFontFamily
).withDefault((element: HTMLElement) => getGroupLabelFontForTheme(element));
export const drawerHeaderFontFamily = createTokenWithPrefix<string>(
    tokenNames.drawerHeaderFontFamily
).withDefault(Title2Family);

// Font Sizing Tokens
export const labelFontSize = createTokenWithPrefix<string>(tokenNames.labelFontSize).withDefault(
    (element: HTMLElement) => getLabelTextSizeForTheme(element)
);
export const contentFontSize = createTokenWithPrefix<string>(tokenNames.contentFontSize).withDefault(BodySize);
export const groupLabelFontSize = createTokenWithPrefix<string>(
    tokenNames.groupLabelFontSize
).withDefault(GroupLabel1Size);
export const drawerHeaderFontSize = createTokenWithPrefix<string>(
    tokenNames.drawerHeaderFontSize
).withDefault(Title2Size);

// Font Weight Tokens
export const groupLabelFontWeight = createTokenWithPrefix<string>(
    tokenNames.groupLabelFontWeight
).withDefault(GroupLabel1Weight);

export const labelFontWeight = createTokenWithPrefix<string>(tokenNames.labelFontWeight).withDefault(ControlLabel1Weight);

// Font Color Tokens
export const labelFontColor = createTokenWithPrefix<string>(tokenNames.labelFontColor).withDefault(
    (element: HTMLElement) => hexToRgba(getDefaultFontColorForTheme(element), 0.6)
);

export const groupLabelFontColor = createTokenWithPrefix<string>(
    tokenNames.groupLabelFontColor
).withDefault((element: HTMLElement) => getDefaultFontColorForTheme(element));

export const contentFontColor = createTokenWithPrefix<string>(
    tokenNames.contentFontColor
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, Black88));

export const buttonContentFontColor = createTokenWithPrefix<string>(
    tokenNames.buttonContentFontColor
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, SlLegacyBlue));

export const labelFontColorDisabled = createTokenWithPrefix<string>(
    tokenNames.labelFontColorDisabled
).withDefault((element: HTMLElement) => hexToRgba(getDefaultLineColorForTheme(element), 0.3));

export const labelTextTransform = createTokenWithPrefix<string>(
    tokenNames.labelTextTransform
).withDefault((element: HTMLElement) => getLabelTextTransformForTheme(element));

export const groupLabelTextTransform = createTokenWithPrefix<string>(
    tokenNames.groupLabelTextTransform
).withDefault((element: HTMLElement) => getGroupLabelTextTransformForTheme(element));

export const contentFontColorDisabled = createTokenWithPrefix<string>(
    tokenNames.contentFontColorDisabled
).withDefault((element: HTMLElement) => hexToRgba(getColorForTheme(element, Black91, Black15, White, Black88), 0.3));

// Animation Tokens
export const smallDelay = createTokenWithPrefix<string>(tokenNames.smallDelay).withDefault(SmallDelay);
export const mediumDelay = createTokenWithPrefix<string>(tokenNames.mediumDelay).withDefault(MediumDelay);
export const drawerAnimationDurationMs = DesignToken.create<number>(
    tokenNames.drawerAnimationDurationMs
).withDefault(250);

// Filter Tokens
export const passwordRevealFilter = createTokenWithPrefix<string>(
    tokenNames.passwordRevealFilter
).withDefault((element: HTMLElement) => getPasswordRevealFilterForTheme(element));

// Localization Tokens
export const direction = createTokenWithPrefix<Direction>(tokenNames.direction).withDefault(
    Direction.ltr
);

// Private helpers functions

function createTokenWithPrefix<T>(name: string): CSSDesignToken<T> {
    return DesignToken.create<T>(`ni-nimble-${name}`);
}

function rgbString(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function hexToRgba(hexValue: string, alpha: number): string {
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
        case NimbleTheme.Light:
            return lightThemeColor;
        case NimbleTheme.Dark:
            return darkThemeColor;
        case NimbleTheme.Color:
            return colorThemeColor;
        case NimbleTheme.LegacyBlue:
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
    return getColorForTheme(
        element,
        Black91,
        Black15,
        White,
        Black91
    );
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    return getColorForTheme(
        element,
        Black91,
        Black15,
        White,
        Black75
    );
}

function getFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${BodyFamily}`;
    }
}

function getLabelFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${ControlLabel1Family}, ${BodyFamily}`;
    }
}

function getGroupLabelFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return `${LegacyContentFamily}`;
        default:
            return `${GroupLabel1Family}, ${BodyFamily}`;
    }
}

function getGroupLabelTextTransformForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return 'none';
        default:
            return 'uppercase';
    }
}

function getLabelTextTransformForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return 'none';
        default:
            return 'none';
    }
}

function getLabelTextSizeForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return '13px';
        default:
            return ControlLabel1Size;
    }
}

function getPasswordRevealFilterForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Color:
        case NimbleTheme.Dark:
            return 'invert(100%)';
        default:
            return 'invert(0%)';
    }
}

function getFillColorSelectedForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Selection100, Selection100, White, SlLegacyBlue);
}

function getFillColorHoverForTheme(element: HTMLElement): string {
    return getColorForTheme(element, Black91, Black15, White, SlLegacyBlue);
}
