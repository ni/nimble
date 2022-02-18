import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tokenNames: { readonly [key in TokenName]: string } = {
    actionColorRgbPartial: 'action-color-rgb-partial',
    applicationBackgroundColor: 'application-background-color',
    headerBackgroundColor: 'header-background-color',
    sectionBackgroundColor: 'section-background-color',
    fillColorSelected: 'fill-color-selected',
    fillColorSelectedRgbPartial: 'fill-color-selected-rgb-partial',
    fillColorSelectedHover: 'fill-color-selected-hover',
    fillColorHover: 'fill-color-hover',
    borderColor: 'border-color',
    borderColorRgbPartial: 'border-color-rgb-partial',
    failColor: 'fail-color',
    warningColor: 'warning-color',
    passColor: 'pass-color',
    borderColorHover: 'border-color-hover',
    iconColor: 'icon-color',
    popupBoxShadowColor: 'popup-box-shadow-color',
    popupBorderColor: 'popup-border-color',
    controlHeight: 'control-height',
    standardPadding: 'standard-padding',
    labelHeight: 'label-height',
    borderWidth: 'border-width',
    iconSize: 'icon-size',
    groupHeader1TextTransform: 'group-header1-text-transform',
    drawerWidth: 'drawer-width',
    smallDelay: 'small-delay',
    mediumDelay: 'medium-delay',
    largeDelay: 'large-delay',
    headline2Font: 'headline2-font',
    headline1Font: 'headline1-font',
    title3Font: 'title3-font',
    title2Font: 'title2-font',
    title1Font: 'title1-font',
    subtitle2Font: 'subtitle2-font',
    subtitle1Font: 'subtitle1-font',
    linkStandard1Font: 'link-standard1-font',
    placeholderFont: 'placeholder-font',
    bodyEmphasizedFont: 'body-emphasized-font',
    bodyFont: 'body-font',
    groupHeader1Font: 'group-header1-font',
    controlLabel1Font: 'control-label1-font',
    buttonLabel1Font: 'button-label1-font',
    tooltipCaptionFont: 'tooltip-caption-font',
    headline2FontColor: 'headline2-font-color',
    headline1FontColor: 'headline1-font-color',
    title3FontColor: 'title3-font-color',
    title2FontColor: 'title2-font-color',
    title1FontColor: 'title1-font-color',
    subtitle2FontColor: 'subtitle2-font-color',
    subtitle1FontColor: 'subtitle1-font-color',
    standard1FontColor: 'link-standard1-font-color',
    placeholderFontColor: 'placeholder-font-color',
    bodyEmphasizedFontColor: 'body-emphasized-font-color',
    bodyFontColor: 'body-font-color',
    groupHeader1FontColor: 'group-header1-font-color',
    controlLabel1FontColor: 'control-label1-font-color',
    buttonLabel1FontColor: 'button-label1-font-color',
    tooltipCaptionFontColor: 'tooltip-caption-font-color',
    headline2FontColorDisabled: 'headline2-font-color-disabled',
    headline1FontColorDisabled: 'headline1-font-color-disabled',
    title3FontColorDisabled: 'title3-font-color-disabled',
    title2FontColorDisabled: 'title2-font-color-disabled',
    title1FontColorDisabled: 'title1-font-color-disabled',
    subtitle2FontColorDisabled: 'subtitle2-font-color-disabled',
    subtitle1FontColorDisabled: 'subtitle1-font-color-disabled',
    standard1FontColorDisabled: 'link-standard1-font-color-disabled',
    placeholderFontColorDisabled: 'placeholder-font-color-disabled',
    bodyEmphasizedFontColorDisabled: 'body-emphasized-font-color-disabled',
    bodyFontColorDisabled: 'body-font-color-disabled',
    groupHeader1FontColorDisabled: 'group-header1-font-color-disabled',
    controlLabel1FontColorDisabled: 'control-label1-font-color-disabled',
    buttonLabel1FontColorDisabled: 'button-label1-font-color-disabled',
    tooltipCaptionFontColorDisabled: 'tooltip-caption-font-color-disabled'
};

const prefix = 'ni-nimble';

export const styleNameFromTokenName = (tokenName: string): string => `${prefix}-${tokenName}`;
export const cssPropertyFromTokenName = (tokenName: string): string => `--${prefix}-${tokenName}`;
export const scssPropertyFromTokenName = (tokenName: string): string => `$${prefix}-${tokenName}`;
export const scssInternalPropertyFromTokenName = (tokenName: string): string => `$${prefix}-internal-${tokenName}`;
export const scssInternalPropertySetterMarkdown = (
    tokenName: string,
    property: string
): string => `\`#{$${prefix}-internal-${tokenName}}: ${property};\``;
