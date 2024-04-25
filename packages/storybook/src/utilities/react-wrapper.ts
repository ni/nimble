/**
 * The React component wrappers are only used in Storybook and will
 * not be in the published package, so are allowed to use devDependencies
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';

export const { wrap } = provideReactWrapper(React);
