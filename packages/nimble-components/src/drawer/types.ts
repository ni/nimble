export const DrawerLocation = {
    Left: 'left',
    Right: 'right'
} as const;
export type DrawerLocation = typeof DrawerLocation[keyof typeof DrawerLocation];

export const DrawerState = {
    Opening: 'opening',
    Opened: 'opened',
    Closing: 'closing',
    Closed: 'closed'
} as const;
export type DrawerState = typeof DrawerState[keyof typeof DrawerState];
