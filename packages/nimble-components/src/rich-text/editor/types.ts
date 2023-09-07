/**
 * TipTap node types.
 * @public
 */
export const TipTapNodeName = {
    bulletList: 'bulletList',
    numberedList: 'orderedList'
} as const;

export type TipTapNodeName =
    (typeof TipTapNodeName)[keyof typeof TipTapNodeName];
