import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Switch } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookSwitch = wrap(Switch);