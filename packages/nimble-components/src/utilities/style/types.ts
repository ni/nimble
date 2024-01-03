export const ZIndexLevels = {
    zIndex1: '1',
    zIndex100: '100',
    zIndex1000: '1000',
    zIndex10000: '10000'
} as const;
export type ZIndexLevels = (typeof ZIndexLevels)[keyof typeof ZIndexLevels];
