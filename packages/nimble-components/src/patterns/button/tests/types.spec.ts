import { ButtonAppearance } from '../types';

describe('Button type', () => {
    it('ButtonAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: ButtonAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });

    it('ButtonAppearance fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        ButtonAppearance.block = 'hello';
        expect(ButtonAppearance.block).toEqual('hello');
    });
});
