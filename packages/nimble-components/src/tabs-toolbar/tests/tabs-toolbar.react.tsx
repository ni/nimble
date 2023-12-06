import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TabsToolbar } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTabsToolbar = wrap(TabsToolbar);