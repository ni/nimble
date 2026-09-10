export const FvSummaryPanelSize = {
    default: 'default',
    compact: 'compact'
} as const;

export type FvSummaryPanelSize = (typeof FvSummaryPanelSize)[keyof typeof FvSummaryPanelSize];