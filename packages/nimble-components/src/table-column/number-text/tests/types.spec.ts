import type { NumberTextFormat, NumberTextAlignment } from '../types';

describe('Number-text column types', () => {
    it('NumberTextFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: NumberTextFormat = 'hello';
        expect(format!).toEqual('hello');
    });

    it('NumberTextAlignment fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const alignment: NumberTextAlignment = 'hello';
        expect(alignment!).toEqual('hello');
    });
});
