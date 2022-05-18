import type { TreeViewSelectionMode } from '../types';

describe('TreeView type', () => {
    it('TreeViewSelectionMode fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const mode: TreeViewSelectionMode = 'hello';
        expect(mode).toEqual('hello');
    });
});
