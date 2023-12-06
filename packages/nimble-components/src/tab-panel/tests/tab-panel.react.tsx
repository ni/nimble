import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TabPanel } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTabPanel = wrap(TabPanel);