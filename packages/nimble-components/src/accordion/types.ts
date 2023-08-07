/**
 * Types of accordion appearances
 * @public
 */
export const AccordionAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;
export type AccordionAppearance =
    (typeof AccordionAppearance)[keyof typeof AccordionAppearance];
