export const AccordionItemAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;
export type AccordionItemAppearance = (typeof AccordionItemAppearance)[keyof typeof AccordionItemAppearance];
