import type { IconSeverity } from '../types';

describe('Icon type', () => {
    it('IconSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const severity: IconSeverity = 'hello';
        expect(severity!).toEqual('hello');
    });
});
