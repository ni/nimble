import type { TooltipAppearance } from '../types';

describe('Tooltip type', () => {
    it('TooltipStatus fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const status: TooltipStatus = 'hello';
        expect(status).toEqual('hello');
    });
});
