/**
 * Design token names should follow the token naming convention:
 * See: https://github.com/ni/nimble/blob/main/packages/nimble-components/CONTRIBUTING.md#token-naming
 */

import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tokenNames: { readonly [key in TokenName]: string } = {
    actionRgbPartialColor: 'action-rgb-partial-color',
    applicationBackgroundColor: 'application-background-color',
    headerBackgroundColor: 'header-background-color',
    sectionBackgroundColor: 'section-background-color',
    fillColorSelected: 'fill-color-selected',
    fillSelectedRgbPartialColor: 'fill-selected-rgb-partial-color',
    fillHoverSelectedColor: 'fill-selected-hover-color',
    fillHoverColor: 'fill-hover-color',
    borderColor: 'border-color',
    borderRgbPartialColor: 'border-rgb-partial-color',
    failColor: 'fail-color',
    warningColor: 'warning-color',
    passColor: 'pass-color',
    borderHoverColor: 'border-hover-color',
    iconColor: 'icon-color',
    popupBoxShadowColor: 'popup-box-shadow-color',
    popupBorderColor: 'popup-border-color',
    controlHeight: 'control-height',
    smallPadding: 'small-padding',
    standardPadding: 'standard-padding',
    labelHeight: 'label-height',
    borderWidth: 'border-width',
    iconSize: 'icon-size',
    groupHeaderTextTransform: 'group-header-text-transform',
    drawerWidth: 'drawer-width',
    smallDelay: 'small-delay',
    mediumDelay: 'medium-delay',
    largeDelay: 'large-delay',
    headlinePlus1Font: 'headline-plus-1-font',
    headlineFont: 'headline-font',
    titlePlus2Font: 'title-plus-2-font',
    titlePlus1Font: 'title-plus-1-font',
    titleFont: 'title-font',
    subtitlePlus1Font: 'subtitle-plus-1-font',
    subtitleFont: 'subtitle-font',
    linkStandardFont: 'link-standard-font',
    placeholderFont: 'placeholder-font',
    bodyEmphasizedFont: 'body-emphasized-font',
    bodyFont: 'body-font',
    groupHeaderFont: 'group-header-font',
    controlLabelFont: 'control-label-font',
    buttonLabelFont: 'button-label-font',
    tooltipCaptionFont: 'tooltip-caption-font',
    headlinePlus1FontColor: 'headline-plus-1-font-color',
    headlineFontColor: 'headline-font-color',
    titlePlus2FontColor: 'title-plus-2-font-color',
    titlePlus1FontColor: 'title-plus-1-font-color',
    titleFontColor: 'title-font-color',
    subtitlePlus1FontColor: 'subtitle-plus-1-font-color',
    subtitleFontColor: 'subtitle-font-color',
    linkStandardFontColor: 'link-standard-font-color',
    placeholderFontColor: 'placeholder-font-color',
    bodyEmphasizedFontColor: 'body-emphasized-font-color',
    bodyFontColor: 'body-font-color',
    groupHeaderFontColor: 'group-header-font-color',
    controlLabelFontColor: 'control-label-font-color',
    buttonLabelFontColor: 'button-label-font-color',
    tooltipCaptionFontColor: 'tooltip-caption-font-color',
    headlinePlus1DisabledFontColor: 'headline-plus-1-disabled-font-color',
    headlineDisabledFontColor: 'headline-disabled-font-color',
    titlePlus2DisabledFontColor: 'title-plus-2-disabled-font-color',
    titlePlus1DisabledFontColor: 'title-plus-1-disabled-font-color',
    titleDisabledFontColor: 'title-disabled-font-color',
    subtitlePlus1DisabledFontColor: 'subtitle-plus-1-disabled-font-color',
    subtitleDisabledFontColor: 'subtitle-disabled-font-color',
    linkStandardDisabledFontColor: 'link-standard-disabled-font-color',
    placeholderDisabledFontColor: 'placeholder-disabled-font-color',
    bodyEmphasizedDisabledFontColor: 'body-emphasized-disabled-font-color',
    bodyDisabledFontColor: 'body-disabled-font-color',
    groupHeaderDisabledFontColor: 'group-header-disabled-font-color',
    controlLabelDisabledFontColor: 'control-label-disabled-font-color',
    buttonLabelDisabledFontColor: 'button-label-disabled-font-color',
    tooltipCaptionDisabledFontColor: 'tooltip-caption-disabled-font-color'
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
