import type { ValueConverter } from '@microsoft/fast-element';

// Should be used for attributes that are optional booleans, where true, false, and undefined all
// have separate meanings and must have distinct representations.
export const optionalBooleanConverter: ValueConverter = {
    toView(value: unknown): string | null {
        return typeof value === 'boolean' ? value.toString() : null;
    },

    fromView(value: string): boolean | undefined {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return undefined;
    }
};
