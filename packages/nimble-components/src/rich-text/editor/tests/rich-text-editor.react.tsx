import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { RichTextEditor } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookRichTextEditor = wrap(RichTextEditor);