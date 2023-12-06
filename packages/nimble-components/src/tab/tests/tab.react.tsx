import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Tab } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTab = wrap(Tab);