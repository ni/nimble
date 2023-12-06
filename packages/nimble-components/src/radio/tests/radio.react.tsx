import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Radio } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookRadio = wrap(Radio);