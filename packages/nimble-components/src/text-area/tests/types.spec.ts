import type { TextAreaAppearance } from '../types';

describe('TextArea type', () => {
    it('TextAreaAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: TextAreaAppearance = 'hello';
        expect(appearance).toEqual('hello');
    });
});
