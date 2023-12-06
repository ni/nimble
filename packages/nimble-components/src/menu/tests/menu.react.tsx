import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Menu } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookMenu = wrap(Menu);