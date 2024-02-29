export const ZIndexLevels = {
    zIndex1: '1',
    // Original usages of 1000 were to compete with jqx grid usage of z-index 200 for table headers
    // See: https://github.com/ni/nimble/pull/530#discussion_r863076750
    zIndex1000: '1000'
} as const;
export type ZIndexLevels = (typeof ZIndexLevels)[keyof typeof ZIndexLevels];
