import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { ToggleButton } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookToggleButton = wrap(ToggleButton);