export const DrawerLocation = {
    Left: 'left',
    Right: 'right'
} as const;
export type DrawerLocationAttribute =
    typeof DrawerLocation[keyof typeof DrawerLocation];

export const DrawerState = {
    Opening: 'opening',
    Opened: 'opened',
    Closing: 'closing',
    Closed: 'closed'
} as const;
export type DrawerStateAttribute = typeof DrawerState[keyof typeof DrawerState];
