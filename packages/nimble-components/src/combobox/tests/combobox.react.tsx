import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Combobox } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookCombobox = wrap(Combobox);