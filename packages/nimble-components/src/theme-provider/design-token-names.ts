import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tokenNames: { [key in TokenName]: string } = {
    actionColorRgbPartial: 'action-color-rgb-partial',
    applicationBackgroundColor: 'application-background-color',
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
    drawerWidth: 'drawer-width',
    fontFamily: 'font-family',
    labelFontFamily: 'label-font-family',
    groupLabelFontFamily: 'group-label-font-family',
    drawerHeaderFontFamily: 'drawer-header-font-family',
    labelFontSize: 'label-font-size',
    contentFontSize: 'content-font-size',
    groupLabelFontSize: 'group-label-font-size',
    drawerHeaderFontSize: 'drawer-header-font-size',
    groupLabelFontWeight: 'group-label-font-weight',
    labelFontWeight: 'label-font-weight',
    labelFontColor: 'label-font-color',
    groupLabelFontColor: 'group-label-font-color',
    contentFontColor: 'content-font-color',
    buttonContentFontColor: 'button-content-font-color',
    labelFontColorDisabled: 'label-font-color-disabled',
    labelTextTransform: 'label-text-transform',
    groupLabelTextTransform: 'group-label-text-transform',
    contentFontColorDisabled: 'content-font-color-disabled',
    smallDelay: 'small-delay',
    mediumDelay: 'medium-delay',
    drawerAnimationDurationMs: 'drawer-animation-duration-ms',
    passwordRevealFilter: 'password-reveal-filter'
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
