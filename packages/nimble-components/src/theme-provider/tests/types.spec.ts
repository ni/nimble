import type { Theme } from '../types';
import type { PropertyFormat } from './types';

describe('ThemeProvider type', () => {
    it('Theme fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const theme: Theme = 'hello';
        expect(theme).toEqual('hello');
    });

    it('PropertyFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: PropertyFormat = 'hello';
        expect(format).toEqual('hello');
    });
});
