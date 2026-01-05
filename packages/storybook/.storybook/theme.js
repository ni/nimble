import { create, getPreferredColorScheme } from 'storybook/theming';
import {
    Black91,
    Brand85,
    White,
    Black7,
    Black15,
    DigitalGreenDark105,
    Black30,
    Black,
    Black75,
    Black95,
    Black80
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import logoLight from './nimble-light.svg';
import logoDark from './nimble-dark.svg';

const light = create({
    base: 'light',
    colorPrimary: Brand85,
    colorSecondary: DigitalGreenDark105,

    // UI
    appBg: White,
    appContentBg: White,
    appBorderColor: Black30,
    appBorderRadius: 5,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: Black91,
    textInverseColor: Black15,
    textMutedColor: Black75,

    // Toolbar default and active colors
    barTextColor: White,
    barHoverColor: Black15,
    barSelectedColor: Black7,
    barBg: Brand85,

    // Form colors
    buttonBg: White,
    buttonBorder: Black75,
    booleanBg: White,
    booleanSelectedBg: Black30,
    inputBg: White,
    inputBorder: Black75,
    inputTextColor: Black,
    inputBorderRadius: 4,

    brandTitle: 'Nimble components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logoLight
});

const dark = create({
    base: 'dark',
    colorPrimary: Brand85,
    colorSecondary: DigitalGreenDark105,

    // UI
    appBg: Black,
    appContentBg: Black,
    appBorderColor: Black75,
    appBorderRadius: 5,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: Black7,
    textInverseColor: Black95,
    textMutedColor: Black15,

    // Toolbar default and active colors
    barTextColor: Black,
    barHoverColor: Black80,
    barSelectedColor: Black95,
    barBg: Brand85,

    // Form colors
    buttonBg: Black,
    buttonBorder: Black30,
    booleanBg: Black,
    booleanSelectedBg: Black75,
    inputBg: Black,
    inputBorder: Black30,
    inputTextColor: White,
    inputBorderRadius: 4,

    brandTitle: 'Nimble components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logoDark
});

export const theme = getPreferredColorScheme() === 'dark' ? dark : light;
