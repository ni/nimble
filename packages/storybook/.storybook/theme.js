import { create, getPreferredColorScheme } from 'storybook/theming';
import { tokenValues } from '@ni/nimble-components/dist/esm/theme-provider/design-token-values';
import logoLight from './nimble-light.svg';
import logoDark from './nimble-dark.svg';

const light = create({
    base: 'light',

    // Brand
    brandTitle: 'Nimble components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logoLight,

    // Brand colors
    colorPrimary: tokenValues.linkProminentFontColor.light,
    colorSecondary: tokenValues.linkProminentFontColor.light,

    // UI
    appBg: tokenValues.applicationBackgroundColor.light,
    appContentBg: tokenValues.applicationBackgroundColor.light,
    appHoverBg: tokenValues.fillHoverColor.light,
    appPreviewBg: tokenValues.applicationBackgroundColor.light,
    appBorderColor: tokenValues.tableRowBorderColor.light,
    appBorderRadius: 1,

    // Text colors
    textColor: tokenValues.bodyFontColor.light,
    textInverseColor: tokenValues.bodyFontColor.dark,
    textMutedColor: tokenValues.bodyDisabledFontColor.light,

    // Toolbar default and active colors
    barTextColor: tokenValues.bodyFontColor.light,
    barHoverColor: tokenValues.fillHoverColor.light,
    barSelectedColor: tokenValues.fillHoverSelectedColor.light,
    barBg: tokenValues.headerBackgroundColor.light,

    // Form colors
    buttonBg: tokenValues.buttonFillPrimaryColor.light,
    buttonBorder: tokenValues.popupBorderColor.light,
    booleanBg: tokenValues.fillHoverColor.light,
    booleanSelectedBg: tokenValues.fillSelectedColor.light,
    inputBg: tokenValues.applicationBackgroundColor.light,
    inputBorder: tokenValues.tableRowBorderColor.light,
    inputTextColor: tokenValues.bodyFontColor.light,
    inputBorderRadius: 1,
});

const dark = create({
    base: 'dark',

    // Brand
    brandTitle: 'Nimble components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logoDark,

    // Brand colors
    colorPrimary: tokenValues.linkProminentFontColor.dark,
    colorSecondary: tokenValues.linkProminentFontColor.dark,

    // UI
    appBg: tokenValues.applicationBackgroundColor.dark,
    appContentBg: tokenValues.applicationBackgroundColor.dark,
    appHoverBg: tokenValues.fillHoverColor.dark,
    appPreviewBg: tokenValues.applicationBackgroundColor.dark,
    appBorderColor: tokenValues.tableRowBorderColor.dark,
    appBorderRadius: 1,

    // Text colors
    textColor: tokenValues.bodyFontColor.dark,
    textInverseColor: tokenValues.bodyFontColor.light,
    textMutedColor: tokenValues.bodyDisabledFontColor.dark,

    // Toolbar default and active colors
    barTextColor: tokenValues.bodyFontColor.dark,
    barHoverColor: tokenValues.fillHoverColor.dark,
    barSelectedColor: tokenValues.fillHoverSelectedColor.dark,
    barBg: tokenValues.headerBackgroundColor.dark,

    // Form colors
    buttonBg: tokenValues.buttonFillPrimaryColor.dark,
    buttonBorder: tokenValues.popupBorderColor.dark,
    booleanBg: tokenValues.fillHoverColor.dark,
    booleanSelectedBg: tokenValues.fillSelectedColor.dark,
    inputBg: tokenValues.applicationBackgroundColor.dark,
    inputBorder: tokenValues.tableRowBorderColor.dark,
    inputTextColor: tokenValues.bodyFontColor.dark,
    inputBorderRadius: 1,
});

export const theme = getPreferredColorScheme() === 'dark' ? dark : light;
