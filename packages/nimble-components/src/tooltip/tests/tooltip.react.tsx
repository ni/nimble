import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Tooltip } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTooltip = wrap(Tooltip);