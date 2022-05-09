export const pinnedSelectedAttribute = 'pinned-selected';
export const groupSelectedAttribute = 'group-selected';

export const TreeViewSelectionMode = {
    All: 'all',
    LeavesOnly: 'leaves-only',
    None: 'none'
} as const;
export type TreeViewSelectionModeAttribute =
    typeof TreeViewSelectionMode[keyof typeof TreeViewSelectionMode];
