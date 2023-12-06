import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Card } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookCard = wrap(Card);
