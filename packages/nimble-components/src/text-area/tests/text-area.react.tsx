import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TextArea } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTextArea = wrap(TextArea);