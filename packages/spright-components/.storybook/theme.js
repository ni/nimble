import { create } from '@storybook/theming/create';
import {
    Black91,
    Brand85,
    White,
    Black7,
    Black15,
    DigitalGreenDark105,
    Black30,
    Black,
    Black75
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import logo from './spright-ui-logo.svg';

export default create({
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

    brandTitle: 'Spright components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logo
});
