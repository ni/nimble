import { Theme } from '../types';
import { PropertyFormat } from './types';

describe('ThemeProvider type', () => {
    it('Theme fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const theme: Theme = 'hello';
        expect(theme).toEqual('hello');
    });

    it('Theme fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        Theme.color = 'hello';
        expect(Theme.color).toEqual('hello');
    });

    it('PropertyFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: PropertyFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('PropertyFormat fails compile if reassigning items', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        PropertyFormat.css = 'hello';
        expect(PropertyFormat.css).toEqual('hello');
    });
});
