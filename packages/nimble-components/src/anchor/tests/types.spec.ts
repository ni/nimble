import type { AnchorAppearance, AnchorAppearanceVariant } from '../types';

describe('Anchor type', () => {
    it('AnchorAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: AnchorAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });

    it('AnchorAppearanceVariant fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearanceVariant: AnchorAppearanceVariant = 'hello';
        expect(appearanceVariant!).toEqual('hello');
    });
});
