import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TreeView } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTreeView = wrap(TreeView);