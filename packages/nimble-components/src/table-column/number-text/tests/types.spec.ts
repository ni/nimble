import type { Format } from '../types';

describe('NumberColumn type', () => {
    it('Format fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: Format = 'hello';
        expect(format!).toEqual('hello');
    });
});
