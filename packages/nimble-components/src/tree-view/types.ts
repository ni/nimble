export const pinnedSelectedAttribute = 'pinned-selected';
export const groupSelectedAttribute = 'group-selected';

export enum TreeViewSelectionMode {
    All = 'all',
    LeavesOnly = 'leaves-only',
    None = 'none'
}
export type TreeViewSelectionModeAttribute = `${TreeViewSelectionMode}`;
