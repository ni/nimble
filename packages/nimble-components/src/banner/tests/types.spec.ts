import type { BannerAppearance, BannerSeverity } from '../types';

describe('Banner appearance', () => {
    it('BannerAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: BannerAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });
});

describe('Banner type', () => {
    it('BannerSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const severity: BannerSeverity = 'hello';
        expect(severity!).toEqual('hello');
    });
});
