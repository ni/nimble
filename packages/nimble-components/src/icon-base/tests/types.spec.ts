import type { IconStatus } from '../types';

describe('Icon type', () => {
    it('IconStatus fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const status: IconStatus = 'hello';
        expect(status).toEqual('hello');
    });
});
