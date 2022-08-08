import type { TooltipAppearance } from '../types';

describe('Tooltip type', () => {
    it('TooltipAppearance fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const status: TooltipAppearance = 'hello';
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        expect(status).toEqual('hello');
    });
});
