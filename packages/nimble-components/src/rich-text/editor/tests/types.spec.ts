import type { ArrowKeyButton, ToolbarButton } from '../testing/types';
import type { TipTapNodeName } from '../types';

describe('Editor Toolbar button page object types', () => {
    it('ToolbarButton fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: ToolbarButton = 'hello';
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        expect(value).toEqual('hello');
    });
});

describe('Tiptap node types', () => {
    it('TipTapNodeName fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: TipTapNodeName = 'hello';
        expect(value).toEqual('hello');
    });
});

describe('Arrow key button page object types', () => {
    it('Arrow key fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const value: ArrowKeyButton = 'hello';
        expect(value).toEqual('hello');
    });
});
