import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TableColumnIcon } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTableColumnIcon = wrap(TableColumnIcon);