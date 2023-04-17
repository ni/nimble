export const pinnedSelectedAttribute = 'pinned-selected';
export const groupSelectedAttribute = 'group-selected';

export const TreeViewSelectionMode = {
    all: 'all',
    leavesOnly: 'leaves-only',
    none: 'none'
} as const;
export type TreeViewSelectionMode =
    (typeof TreeViewSelectionMode)[keyof typeof TreeViewSelectionMode];
