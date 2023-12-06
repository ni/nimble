import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { MappingSpinner } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookMappingSpinner = wrap(MappingSpinner);