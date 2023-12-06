import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { CardButton } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookCardButton = wrap(CardButton);
