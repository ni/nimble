import type { ComboboxAutocomplete } from '../types';

describe('ComboboxAutocomplete type', () => {
    it('ComboboxAutocomplete fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const autocomplete: ComboboxAutocomplete = 'hello';
        expect(autocomplete!).toEqual('hello');
    });
});
