import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Select } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookSelect = wrap(Select);