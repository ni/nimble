import { IconStatus } from '../types';

describe('Icon type', () => {
    it('IconStatus fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const status: IconStatus = 'hello';
        expect(status).toEqual('hello');
    });

    it('IconStatus fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        IconStatus.fail = 'hello';
        expect(IconStatus.fail).toEqual('hello');
    });
});
