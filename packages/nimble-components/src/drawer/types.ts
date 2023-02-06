export const DrawerLocation = {
    left: 'left',
    right: 'right'
} as const;
export type DrawerLocation = typeof DrawerLocation[keyof typeof DrawerLocation];
