/**
 * Severities of banners.
 * @public
 */
export const BannerSeverity = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    information: 'information'
} as const;

export type BannerSeverity =
    (typeof BannerSeverity)[keyof typeof BannerSeverity];

/**
 * The type of the detail associated with the `toggle`
 * event on the banner.
 */
export interface BannerToggleEventDetail {
    newState: boolean;
    oldState: boolean;
}
