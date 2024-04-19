import type {
    TableColumnMappingWidthMode
} from '../types';

describe('Icon column type', () => {
    it('TableColumnMappingWidthMode fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const widthMode: TableColumnMappingWidthMode = 'hello';
        expect(widthMode!).toEqual('hello');
    });
});
