import type { ExampleSortType } from './types';

describe('Table column base type', () => {
    it('ExampleSortType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const sortType: ExampleSortType = 'hello';
        expect(sortType).toEqual('hello');
    });
});
