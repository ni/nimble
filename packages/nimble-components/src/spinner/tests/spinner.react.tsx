import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Spinner } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookSpinner = wrap(Spinner);