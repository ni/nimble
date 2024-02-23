import type { ModalState } from '../types';

describe('Modal types', () => {
    it('ModalState fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const state: ModalState = 'hello';
        expect(state).toEqual('hello');
    });
});
