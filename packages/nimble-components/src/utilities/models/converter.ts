import { booleanConverter, ValueConverter } from '@microsoft/fast-element';

export const optionalBooleanConverter: ValueConverter = {
    toView(value: unknown): string {
        return typeof value === 'boolean' ? value.toString() : '';
    },

    fromView(value: unknown): unknown {
        if (value === undefined) {
            return undefined;
        }
        if (value === null) {
            return null;
        }
        return booleanConverter.fromView(value);
    }
};
