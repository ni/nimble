import type { NumberFieldAppearance } from '../types';

describe('NumberField type', () => {
    it('NumberFieldAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: NumberFieldAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });
});
