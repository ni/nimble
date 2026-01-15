import { Dialog, UserDismissed as DialogUserDismissed } from '@ni/nimble-components/dist/esm/dialog';
import type { RefAttributes, RefObject } from 'react';
import { wrap } from '../utilities/react-wrapper';

export { type Dialog, DialogUserDismissed };
export const NimbleDialog = wrap(Dialog);

/**
 * Helper to assign Dialog refs with generics to ref bindings
 * See: https://github.com/ni/nimble/issues/2784
 * @param dialogRef A ref to a dialog created with `useRef`
 * @returns A ref type compatible with normal `ref` bindings
 */
export const fromDialogRef = <T>(dialogRef: RefObject<Dialog<T> | null>): RefAttributes<Dialog>['ref'] => dialogRef as RefAttributes<Dialog>['ref'];
