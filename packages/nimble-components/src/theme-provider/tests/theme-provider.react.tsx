import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { ThemeProvider } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookThemeProvider = wrap(ThemeProvider);