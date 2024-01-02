export const ZIndexLevels = {
    justBelowDefault: '-1',
    justAboveDefault: '1',
    high: '100',
    higher: '1000',
    veryHigh: '10000'
} as const;
export type ZIndexLevels = (typeof ZIndexLevels)[keyof typeof ZIndexLevels];
