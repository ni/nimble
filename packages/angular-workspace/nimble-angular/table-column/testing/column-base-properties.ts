export const actionMenuSlot1 = 'my-slot' as const;
export const actionMenuSlot2 = 'new-slot' as const;
export const actionMenuLabel1 = 'my menu' as const;
export const actionMenuLabel2 = 'another menu' as const;
export const columnId1 = 'my-column' as const;
export const columnId2 = 'new-column' as const;
export const columnHidden1 = true as const;
export const columnHidden2 = false as const;

export const columnBaseProperties = [
    { name: 'actionMenuSlot', property: 'actionMenuSlot', defaultValue: undefined, value1: actionMenuSlot1, value2: actionMenuSlot2 },
    { name: 'actionMenuLabel', property: 'actionMenuLabel', defaultValue: undefined, value1: actionMenuLabel1, value2: actionMenuLabel2 },
    { name: 'columnId', property: 'columnId', defaultValue: undefined, value1: columnId1, value2: columnId2 },
    { name: 'columnHidden', property: 'columnHidden', defaultValue: false, value1: columnHidden1, value2: columnHidden2 }
] as const;