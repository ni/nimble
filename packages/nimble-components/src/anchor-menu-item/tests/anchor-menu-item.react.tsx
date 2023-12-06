import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { AnchorMenuItem } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchorMenuItem = wrap(AnchorMenuItem);
