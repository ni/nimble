import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TableColumnText } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTableColumnText = wrap(TableColumnText);