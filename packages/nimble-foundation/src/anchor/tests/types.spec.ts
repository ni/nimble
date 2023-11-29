import type { AnchorAppearance } from '../types';

describe('Anchor type', () => {
    it('AnchorAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const appearance: AnchorAppearance = 'hello';
        expect(appearance!).toEqual('hello');
    });
});
