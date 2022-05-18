import { TextFieldAppearance } from '../types';

describe('TextField type', () => {
    it('TextFieldAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: TextFieldAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });

    it('TextFieldAppearance fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        TextFieldAppearance.block = 'hello';
        expect(TextFieldAppearance.block).toEqual('hello');
    });
});
