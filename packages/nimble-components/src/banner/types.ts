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

/**
 * Button appearances for the banner's action button.
 * @public
 */
export const BannerActionButtonAppearance = {
    ghost: 'ghost',
    outline: 'outline'
} as const;
export type BannerActionButtonAppearance =
    typeof BannerActionButtonAppearance[keyof typeof BannerActionButtonAppearance];