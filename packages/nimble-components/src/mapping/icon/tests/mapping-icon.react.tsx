import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { MappingIcon } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookMappingIcon = wrap(MappingIcon);