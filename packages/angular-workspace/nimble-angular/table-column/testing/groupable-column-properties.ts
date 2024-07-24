export const groupIndexValue1 = 0 as const;
export const groupIndexValue2 = 1 as const;
export const groupingDisabledValue1 = true as const;
export const groupingDisabledValue2 = false as const;

export const groupableColumnProperties = [
    { name: 'groupIndex', defaultValue: undefined, value1: groupIndexValue1, value2: groupIndexValue2 },
    { name: 'groupingDisabled', defaultValue: false, value1: groupingDisabledValue1, value2: groupingDisabledValue2 }
] as const;