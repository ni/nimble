import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TextField } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTextField = wrap(TextField);