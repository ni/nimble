import type { ButtonAppearance, ButtonAppearanceVariant } from '../types';

describe('Button type', () => {
    it('ButtonAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: ButtonAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });

    it('ButtonAppearanceVariant fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearanceVariant: ButtonAppearanceVariant = 'hello';
        expect(appearanceVariant!).toEqual('hello');
    });
});
