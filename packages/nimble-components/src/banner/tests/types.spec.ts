import type { BannerSeverity } from '../types';

describe('Banner type', () => {
    it('BannerSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const severity: BannerSeverity = 'hello';
        expect(severity).toEqual('hello');
    });
});
