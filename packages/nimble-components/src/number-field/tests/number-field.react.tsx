import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { NumberField } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookNumberField = wrap(NumberField);