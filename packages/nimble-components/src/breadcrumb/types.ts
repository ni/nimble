/**
 * Predefined icon appearance states
 * @public
 */
export const BreadcrumbAppearance = {
    default: undefined,
    prominent: 'prominent'
} as const;
export type BreadcrumbAppearance =
    typeof BreadcrumbAppearance[keyof typeof BreadcrumbAppearance];
