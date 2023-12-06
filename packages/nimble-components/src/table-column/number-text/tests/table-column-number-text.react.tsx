import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TableColumnNumberText } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTableColumnNumberText = wrap(TableColumnNumberText);