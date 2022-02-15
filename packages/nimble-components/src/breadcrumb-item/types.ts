/**
 * Types of breadcrumb item appearance.
 * @public
 */
export enum BreadcrumbItemAppearance {
    Hypertext = 'hypertext',
    HoverFill = 'hover-fill',
    Outline = 'outline',
    Ghost = 'ghost',
    Block = 'block'
}

export type BreadcrumbIteAppearanceAttribute = `${BreadcrumbItemAppearance}`;
