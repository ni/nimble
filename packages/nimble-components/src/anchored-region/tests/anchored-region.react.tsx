import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { AnchoredRegion } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchoredRegion = wrap(AnchoredRegion);
