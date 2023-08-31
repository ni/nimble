import type { ToolbarButton } from '../testing/types';

describe('Editor Toolbar button page object types', () => {
    it('ToolbarButton fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: ToolbarButton = 'hello';
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        expect(value).toEqual('hello');
    });
});
