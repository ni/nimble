import { Drawer, UserDismissed as DrawerUserDismissed, drawerTag } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation } from '@ni/nimble-components/dist/esm/drawer/types';
import type { RefAttributes, RefObject } from 'react';
import { wrap } from '../utilities/react-wrapper';

export { drawerTag };
export { type Drawer, DrawerUserDismissed, DrawerLocation };
export const NimbleDrawer = wrap(Drawer);

/**
 * Helper to assign Drawer refs with generics to ref bindings
 * See: https://github.com/ni/nimble/issues/2784
 * @param drawerRef A ref to a drawer created with `useRef`
 * @returns A ref type compatible with normal `ref` bindings
 */
export const fromDrawerRef = <T>(drawerRef: RefObject<Drawer<T> | null>): RefAttributes<Drawer>['ref'] => drawerRef as RefAttributes<Drawer>['ref'];
