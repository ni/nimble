/**
 * TipTap node types.
 * @public
 */

export const TipTapNodeNames = {
    bulletList: 'bulletList',
    numberedList: 'orderedList'
} as const;

export type TipTapNodeNames =
    (typeof TipTapNodeNames)[keyof typeof TipTapNodeNames];
