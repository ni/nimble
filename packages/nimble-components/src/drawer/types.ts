export enum DrawerLocation {
    Left = 'left',
    Right = 'right'
}
export type DrawerLocationAttribute = `${DrawerLocation}`;

export enum DrawerState {
    Opening = 'opening',
    Opened = 'opened',
    Closing = 'closing',
    Closed = 'closed'
}
export type DrawerStateAttribute = `${DrawerState}`;
