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
    OverlineCapitalizedFamily,
    OverlineCapitalizedSize,
    Warning100LightUi,
    Warning100DarkUi,
    Pass100LightUi,
    Pass100DarkUi,
    Header2Size,
    Header2Family
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { NimbleTheme } from './themes';

function rgbString(hexValue: string): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `${red}, ${green}, ${blue}`;
}

function hexToRgba(hexValue: string, alpha: number): string {
    const { red, green, blue } = hexRgb(hexValue);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const { create } = DesignToken;

export const theme = create<NimbleTheme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(NimbleTheme.Light);

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

function getDefaultLineColorForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Light:
            return Black91;
        case NimbleTheme.Dark:
            return Black15;
        case NimbleTheme.Color:
            return White;
        case NimbleTheme.LegacyBlue:
            return Black91;
        default:
            return Black91;
    }
}

function getDefaultFontColorForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Light:
            return Black91;
        case NimbleTheme.Dark:
            return Black15;
        case NimbleTheme.Color:
            return White;
        case NimbleTheme.LegacyBlue:
            return Black75;
        default:
            return Black91;
    }
}

function getFontForTheme(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return `${BodyFamily}`;
        default:
            return `${OverlineCapitalizedFamily}, ${BodyFamily}`;
    }
}

function getLabelTextTransform(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return 'none';
        default:
            return 'uppercase';
    }
}

function getLabelTextSize(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.LegacyBlue:
            return '13px';
        default:
            return OverlineCapitalizedSize;
    }
}

function getPasswordRevealFilter(element: HTMLElement): string {
    switch (theme.getValueFor(element)) {
        case NimbleTheme.Color:
        case NimbleTheme.Dark:
            return 'invert(100%)';
        default:
            return 'invert(0%)';
    }
}

const fillColorSelectedTheme = (element: HTMLElement): string => getColorForTheme(element, Selection100, Selection100, White, SlLegacyBlue);
const fillColorHoverTheme = (element: HTMLElement): string => getColorForTheme(element, Black91, Black15, White, SlLegacyBlue);

// Color Tokens
export const actionColorRgb = create<string>('action-color-rgb').withDefault(
    (element: HTMLElement) => rgbString(
        getColorForTheme(element, Black91, Black15, White, SlLegacyBlue)
    )
);

export const applicationBackgroundColor = create<string>(
    'application-background-color'
).withDefault((element: HTMLElement) => getColorForTheme(element, White, Black85, Enterprise, White));

export const fillColorSelected = create<string>(
    'fill-color-selected'
).withDefault((element: HTMLElement) => hexToRgba(fillColorSelectedTheme(element), 0.3));

export const fillColorSelectedRgb = create<string>(
    'fill-color-selected-rgb'
).withDefault((element: HTMLElement) => rgbString(fillColorSelectedTheme(element)));

export const fillColorSelectedHover = create<string>(
    'fill-color-selected-hover'
).withDefault((element: HTMLElement) => hexToRgba(fillColorSelectedTheme(element), 0.15));

export const fillColorHover = create<string>('fill-color-hover').withDefault(
    (element: HTMLElement) => hexToRgba(fillColorHoverTheme(element), 0.1)
);

export const borderColor = create<string>('border-color').withDefault(
    (element: HTMLElement) => getDefaultLineColorForTheme(element)
);

export const borderColorRgb = create<string>('border-color-rgb').withDefault(
    (element: HTMLElement) => rgbString(getDefaultLineColorForTheme(element))
);

export const failColorTheme = (element: HTMLElement): string => getColorForTheme(
    element,
    Fail100LightUi,
    Fail100DarkUi,
    Fail100DarkUi,
    Fail100LightUi
);

export const failColor = create<string>('fail-color').withDefault(
    (element: HTMLElement) => failColorTheme(element)
);

export const warningColorTheme = (element: HTMLElement): string => getColorForTheme(
    element,
    Warning100LightUi,
    Warning100DarkUi,
    Warning100DarkUi,
    Warning100LightUi
);

export const warningColor = create<string>('warning-color').withDefault(
    (element: HTMLElement) => warningColorTheme(element)
);

export const passColorTheme = (element: HTMLElement): string => getColorForTheme(
    element,
    Pass100LightUi,
    Pass100DarkUi,
    Pass100DarkUi,
    Pass100LightUi
);

export const passColor = create<string>('pass-color').withDefault(
    (element: HTMLElement) => passColorTheme(element)
);

export const borderColorHover = create<string>(
    'border-color-hover'
).withDefault((element: HTMLElement) => getColorForTheme(
    element,
    Selection100,
    Selection100,
    White,
    hexToRgba(SlLegacyBlue, 0.9)
));

export const popupBoxShadowColor = create<string>(
    'popup-box-shadow-color'
).withDefault((element: HTMLElement) => hexToRgba(
    getColorForTheme(element, Black75, Black85, Black85, Black75),
    0.3
));

export const popupBorderColor = create<string>(
    'popup-border-color'
).withDefault((element: HTMLElement) => hexToRgba(getColorForTheme(element, Black91, Black15, White, Black91), 0.3));

// Component Sizing Tokens
export const controlHeight = create<string>('control-height').withDefault('32px');
export const standardPadding = create<string>('standard-padding').withDefault('16px');
export const labelHeight = create<string>('label-height').withDefault('16px');
export const borderWidth = create<string>('border-width').withDefault('1px');
export const iconSize = create<string>('icon-size').withDefault('16px');
export const drawerWidth = create<string>('drawer-width').withDefault('784px');

// Font Family Tokens
export const fontFamily = create<string>('font-family').withDefault(BodyFamily);
export const labelFontFamily = create<string>('label-font-family').withDefault(
    (element: HTMLElement) => getFontForTheme(element)
);
export const drawerHeaderFontFamily = create<string>(
    'drawer-header-font-family'
).withDefault(Header2Family);

// Font Sizing Tokens
export const labelFontSize = create<string>('label-font-size').withDefault(
    (element: HTMLElement) => getLabelTextSize(element)
);
export const contentFontSize = create<string>('content-font-size').withDefault(BodySize);
export const drawerHeaderFontSize = create<string>(
    'drawer-header-font-size'
).withDefault(Header2Size);

// Font Color Tokens
export const labelFontColor = create<string>('label-font-color').withDefault(
    (element: HTMLElement) => getDefaultFontColorForTheme(element)
);

export const contentFontColor = create<string>(
    'content-font-color'
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, Black88));

export const buttonContentFontColor = create<string>(
    'button-content-font-color'
).withDefault((element: HTMLElement) => getColorForTheme(element, Black91, Black15, White, SlLegacyBlue));

export const labelFontColorDisabled = create<string>(
    'label-font-color-disabled'
).withDefault((element: HTMLElement) => hexToRgba(getDefaultLineColorForTheme(element), 0.3));

export const labelTextTransform = create<string>(
    'label-text-transform'
).withDefault((element: HTMLElement) => getLabelTextTransform(element));

export const contentFontColorDisabled = create<string>(
    'content-font-color-disabled'
).withDefault((element: HTMLElement) => hexToRgba(getColorForTheme(element, Black91, Black15, White, Black88), 0.3));

// Animation Tokens
export const smallDelay = create<string>('small-delay').withDefault(SmallDelay);
export const mediumDelay = create<string>('medium-delay').withDefault(MediumDelay);
export const drawerAnimationDurationMs = create<number>(
    'drawer-animation-duration-ms'
).withDefault(250);

// Filter Tokens
export const passwordRevealFilter = create<string>(
    'password-reveal-filter'
).withDefault((element: HTMLElement) => getPasswordRevealFilter(element));
