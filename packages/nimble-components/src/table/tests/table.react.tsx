import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Table } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookTable = wrap(Table);