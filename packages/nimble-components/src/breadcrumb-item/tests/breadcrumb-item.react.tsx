import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { BreadcrumbItem } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookBreadcrumbItem = wrap(BreadcrumbItem);
