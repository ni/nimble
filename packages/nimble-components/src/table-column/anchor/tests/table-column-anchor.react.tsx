import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TableColumnAnchor } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTableColumnAnchor = wrap(TableColumnAnchor);