import { create } from '@storybook/theming/create';
import {
    Black91,
    Brand100,
    Brand85,
    Black75,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import logo from './nimble-ui-logo.svg';

export default create({
    base: 'light',

    colorPrimary: Brand100,
    colorSecondary: Black75,

    // UI
    appBg: 'white',
    appContentBg: '#F4F4F4',
    appBorderColor: 'grey',
    appBorderRadius: 4,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: Black91,
    textInverseColor: 'rgba(255,255,255,0.9)',

    // Toolbar default and active colors
    barTextColor: White,
    barSelectedColor: White,
    barBg: Brand85,

    // Form colors
    inputBg: 'white',
    inputBorder: 'silver',
    inputTextColor: 'black',
    inputBorderRadius: 4,

    brandTitle: 'Nimble components',
    brandUrl: 'https://github.com/ni/nimble',
    brandImage: logo
});
