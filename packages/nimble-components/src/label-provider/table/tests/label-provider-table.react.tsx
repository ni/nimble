import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { LabelProviderTable } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookLabelProviderTable = wrap(LabelProviderTable);