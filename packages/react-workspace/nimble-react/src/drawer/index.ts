import { Drawer, UserDismissed } from '@ni/nimble-components/dist/esm/drawer';
import { DrawerLocation } from '@ni/nimble-components/dist/esm/drawer/types';
import type { LegacyRef } from 'react';
import { wrap } from '../utilities/react-wrapper';

export { type Drawer, UserDismissed, DrawerLocation };
export const NimbleDrawer = wrap(Drawer);

export type DrawerRef = LegacyRef<Drawer>;
