import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { MenuButton } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookMenuButton = wrap(MenuButton);