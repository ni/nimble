// template-folder-name -> dialog.js

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import { Dialog } from '..';

const { wrap } = provideReactWrapper(React);

export const NimbleButton = wrap(Dialog);