export const FvAccordionItemAppearance = {
    outline: 'outline',
    ghost: 'ghost',
    block: 'block'
} as const;
export type FvAccordionItemAppearance = (typeof FvAccordionItemAppearance)[keyof typeof FvAccordionItemAppearance];
