export const FvDashboardCardLayout = {
    standard: 'standard',
    hero: 'hero'
} as const;
export type FvDashboardCardLayout = (typeof FvDashboardCardLayout)[keyof typeof FvDashboardCardLayout];

export const FvDashboardCardCorners = {
    rounded: 'rounded',
    square: 'square'
} as const;
export type FvDashboardCardCorners = (typeof FvDashboardCardCorners)[keyof typeof FvDashboardCardCorners];

export const FvDashboardCardSeverity = {
    none: 'none',
    critical: 'critical',
    warning: 'warning',
    information: 'information',
    success: 'success'
} as const;
export type FvDashboardCardSeverity = (typeof FvDashboardCardSeverity)[keyof typeof FvDashboardCardSeverity];
