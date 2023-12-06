// template-folder-name -> dialog.js

import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Dialog } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleStorybookDialog = wrap(Dialog);