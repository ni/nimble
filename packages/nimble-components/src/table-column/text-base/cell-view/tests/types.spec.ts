import type { TextCellViewBaseAlignment } from '../types';

describe('TableColumnTextCellViewBase types', () => {
    it('TextCellViewBaseAlignment fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const alignment: TextCellViewBaseAlignment = 'hello';
        expect(alignment).toEqual('hello');
    });
});
