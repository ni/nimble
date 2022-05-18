import type { ButtonAppearance } from '../types';

describe('Button type', () => {
    it('ButtonAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: ButtonAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });
});
