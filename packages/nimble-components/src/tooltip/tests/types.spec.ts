import type { TooltipSeverity } from '../types';

describe('Tooltip type', () => {
    it('TooltipSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const severity: TooltipSeverity = 'hello';
        expect(severity!).toEqual('hello');
    });
});
