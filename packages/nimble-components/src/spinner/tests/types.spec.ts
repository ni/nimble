import type { SpinnerAppearance } from '../types';

describe('Spinner appearance', () => {
    it('SpinnerAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: SpinnerAppearance = 'hello';
        expect(appearance!).toEqual('hello');
    });
});
