import type { MappingKeyType } from '../types';

describe('TableColumnEnumBase types', () => {
    it('MappingKeyType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const keyType: MappingKeyType = 'hello';
        expect(keyType).toEqual('hello');
    });
});
