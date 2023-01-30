/**
 * Severities of banners.
 * @public
 */
export const BannerSeverity = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    default: undefined
} as const;
export type BannerSeverity = typeof BannerSeverity[keyof typeof BannerSeverity];
