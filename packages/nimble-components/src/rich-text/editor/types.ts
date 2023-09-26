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

/**
 * Representation for JSON-serialized prosemirror node
 */
export interface NodeObj {
    type: string;
    content?: NodeObj[];
    marks?: MarkObj[];
    text: string;
}

/**
 * Representation for JSON-serialized prosemirror mark
 */
export interface MarkObj {
    type: string;
    attrs?: { href: string };
}
