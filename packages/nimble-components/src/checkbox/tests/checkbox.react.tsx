import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Checkbox } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookCheckbox = wrap(Checkbox);