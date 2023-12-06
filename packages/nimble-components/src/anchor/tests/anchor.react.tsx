import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Anchor } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchor = wrap(Anchor);
