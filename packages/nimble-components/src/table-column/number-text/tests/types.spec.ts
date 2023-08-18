import type { NumberTextFormat } from '../types';

describe('Number-text column types', () => {
    it('NumberTextFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: NumberTextFormat = 'hello';
        expect(format!).toEqual('hello');
    });
});
