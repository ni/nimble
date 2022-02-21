/**
 * This file specifies the public names for theme-aware tokens. Use the following structure when creating new tokens.
 *
 * [element]-[part]-[state]-[token_type]
 *
 * 1. Where [element] is the type to which the token applies (e.g. 'application' or 'body' or 'title').
 * 2. Where [part] is the specific part of the element to which the token applies (e.g. 'border' or 'background' or shadow).
 * 3. Where [state] is the more specific state descriptor (e.g. 'selected' or 'disabled').
 * 4. Where [token_type] is the token category (e.g. 'color' or 'font' or 'size').
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
    fillSelectedHoverColor: 'fill-selected-hover-color',
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
    headlineLargeFont: 'headline-large-font',
    headlineRegularFont: 'headline-regular-font',
    titleXLargeFont: 'title-xlarge-font',
    titleLargeFont: 'title-large-font',
    titleRegularFont: 'title-regular-font',
    subtitleLargeFont: 'subtitle-large-font',
    subtitleRegularFont: 'subtitle-regular-font',
    linkStandardFont: 'link-standard-font',
    placeholderFont: 'placeholder-font',
    bodyEmphasizedFont: 'body-emphasized-font',
    bodyFont: 'body-font',
    groupHeaderFont: 'group-header-font',
    controlLabelFont: 'control-label-font',
    buttonLabelFont: 'button-label-font',
    tooltipCaptionFont: 'tooltip-caption-font',
    headlineLargeFontColor: 'headline-large-font-color',
    headlineRegularFontColor: 'headline-regular-color',
    titleXLargeFontColor: 'title-xlarge-color',
    titleLargeFontColor: 'title-large-color',
    titleRegularFontColor: 'title-regular-color',
    subtitleLargeFontColor: 'subtitle-large-color',
    subtitleRegularFontColor: 'subtitle-regular-color',
    linkStandardFontColor: 'link-standard-font-color',
    placeholderFontColor: 'placeholder-font-color',
    bodyEmphasizedFontColor: 'body-emphasized-font-color',
    bodyFontColor: 'body-font-color',
    groupHeaderFontColor: 'group-header-font-color',
    controlLabelFontColor: 'control-label-font-color',
    buttonLabelFontColor: 'button-label-font-color',
    tooltipCaptionFontColor: 'tooltip-caption-font-color',
    headlineLargeFontDisabledColor: 'headline-large-font-disabled-color',
    headlineRegularFontDisabledColor: 'headline-regular-disabled-color',
    titleXLargeFontDisabledColor: 'title-xlarge-disabled-color',
    titleLargeFontDisabledColor: 'title-large-disabled-color',
    titleRegularFontDisabledColor: 'title-regular-disabled-color',
    subtitleLargeFontDisabledColor: 'subtitle-large-disabled-color',
    subtitleRegularFontDisabledColor: 'subtitle-regular-disabled-color',
    linkStandardFontDisabledColor: 'link-standard-font-disabled-color',
    placeholderFontDisabledColor: 'placeholder-font-disabled-color',
    bodyEmphasizedFontDisabledColor: 'body-emphasized-font-disabled-color',
    bodyFontDisabledColor: 'body-font-disabled-color',
    groupHeaderFontDisabledColor: 'group-header-font-disabled-color',
    controlLabelFontDisabledColor: 'control-label-font-disabled-color',
    buttonLabelFontDisabledColor: 'button-label-font-disabled-color',
    tooltipCaptionFontDisabledColor: 'tooltip-caption-font-disabled-color'
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
