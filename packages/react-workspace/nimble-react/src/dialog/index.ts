import { Dialog, UserDismissed } from '@ni/nimble-components/dist/esm/dialog';
import type { LegacyRef } from 'react';
import { wrap } from '../utilities/react-wrapper';

export { type Dialog, UserDismissed };
export const NimbleDialog = wrap(Dialog);

export type DialogRef = LegacyRef<Dialog>;
