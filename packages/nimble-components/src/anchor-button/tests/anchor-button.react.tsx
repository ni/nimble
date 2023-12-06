import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { AnchorButton } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchorButton = wrap(AnchorButton);
