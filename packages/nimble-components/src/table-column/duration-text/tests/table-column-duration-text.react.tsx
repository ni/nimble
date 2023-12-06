import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { TableColumnDurationText } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTableColumnDurationText = wrap(TableColumnDurationText);