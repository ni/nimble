import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { AnchorTreeItem } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookAnchorTreeItem = wrap(AnchorTreeItem);
