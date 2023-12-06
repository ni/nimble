import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { RichTextViewer } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookRichTextViewer = wrap(RichTextViewer);