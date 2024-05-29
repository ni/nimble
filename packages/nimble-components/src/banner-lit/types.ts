/**
 * Severities of banners.
 * @public
 */
export const BannerSeverityLit = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    information: 'information'
} as const;

export type BannerSeverityLit =
    (typeof BannerSeverityLit)[keyof typeof BannerSeverityLit];

/**
 * The type of the detail associated with the `toggle`
 * event on the banner.
 */
export interface BannerLitToggleEventDetail {
    newState: boolean;
    oldState: boolean;
}
