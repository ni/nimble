export const ZIndexLevels = {
    zIndex1: '1',
    zIndex1000: '1000'
} as const;
export type ZIndexLevels = (typeof ZIndexLevels)[keyof typeof ZIndexLevels];
