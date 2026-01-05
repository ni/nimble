import { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { wrap } from '../utilities/react-wrapper';

export { type ThemeProvider, Theme };
export const NimbleThemeProvider = wrap(ThemeProvider);
