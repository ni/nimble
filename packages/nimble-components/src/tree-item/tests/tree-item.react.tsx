import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TreeItem } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTreeItem = wrap(TreeItem);