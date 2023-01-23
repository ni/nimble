/**
 * Types of banners.
 * @public
 */
export const BannerType = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    default: 'neutral'
} as const;
export type BannerType =
    typeof BannerType[keyof typeof BannerType];
