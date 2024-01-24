import type { FilterMode } from '../types';

describe('Select type', () => {
    fit('FilterMode fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const filterMode: FilterMode = 'hello';
        expect(filterMode!).toEqual('hello');
    });
});
