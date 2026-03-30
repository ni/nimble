import type { AnchorStepSeverity } from '../types';

describe('Anchor step type', () => {
    it('AnchorStepSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const anchorStepSeverity: AnchorStepSeverity = 'hello';
        expect<string | undefined>(anchorStepSeverity).toEqual('hello');
    });
});
