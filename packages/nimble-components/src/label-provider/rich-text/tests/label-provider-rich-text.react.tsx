import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { LabelProviderRichText } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookLabelProviderRichText = wrap(LabelProviderRichText);