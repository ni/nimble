import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { AnchorTabs } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchorTabs = wrap(AnchorTabs);
