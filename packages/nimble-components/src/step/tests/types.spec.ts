import type { StepSeverity } from '../types';

describe('Step type', () => {
    it('StepSeverity fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const stepSeverity: StepSeverity = 'hello';
        expect<string | undefined>(stepSeverity).toEqual('hello');
    });
});
