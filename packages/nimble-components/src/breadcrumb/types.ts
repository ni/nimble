/**
 * Predefined icon appearance states
 * @public
 */
export const BreadcrumbAppearance = {
    default: undefined,
    prominent: 'prominent'
} as const;
export type BreadcrumbAppearance =
    (typeof BreadcrumbAppearance)[keyof typeof BreadcrumbAppearance];

/**
 * @internal
 */
export const CollapseState = {
    none: 'collapse-none',
    collapseMiddle: 'collapse-middle',
    collapseExceptCurrent: 'collapse-except-current'
} as const;
export type CollapseState = (typeof CollapseState)[keyof typeof CollapseState];
