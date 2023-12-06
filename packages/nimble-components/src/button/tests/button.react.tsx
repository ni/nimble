import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Button } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookButton = wrap(Button);
