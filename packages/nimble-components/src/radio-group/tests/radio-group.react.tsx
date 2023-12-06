import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { RadioGroup } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookRadioGroup = wrap(RadioGroup);