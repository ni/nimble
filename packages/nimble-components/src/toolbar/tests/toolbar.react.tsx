import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Toolbar } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookToolbar = wrap(Toolbar);