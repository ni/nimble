export const DrawerLocation = {
    left: 'left',
    right: 'right'
} as const;
export type DrawerLocation = typeof DrawerLocation[keyof typeof DrawerLocation];

export const DrawerState = {
    opening: 'opening',
    opened: 'opened',
    closing: 'closing',
    closed: 'closed'
} as const;
export type DrawerState = typeof DrawerState[keyof typeof DrawerState];
