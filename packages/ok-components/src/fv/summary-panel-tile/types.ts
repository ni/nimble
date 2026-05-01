export const FvSummaryPanelTileTextPosition = {
    beside: 'beside',
    under: 'under'
} as const;

export type FvSummaryPanelTileTextPosition = (typeof FvSummaryPanelTileTextPosition)[keyof typeof FvSummaryPanelTileTextPosition];