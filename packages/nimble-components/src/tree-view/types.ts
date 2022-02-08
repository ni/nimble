export const pinnedSelectedAttribute = 'pinned-selected';
export const groupSelectedAttribute = 'group-selected';

export enum TreeViewSelectionMode {
    All = 'all',
    LeavesOnly = 'leaves-only'
}
export type TreeViewSelectionModeAttribute = `${TreeViewSelectionMode}`;
