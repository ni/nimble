/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { vi } from 'vitest';

/**
 * Creates a spy object with the given method names.
 * This is a shim for `vi.fnObj`.
 *
 * @param baseName The base name for the spy object (optional, ignored in Vitest shim but kept for compatibility)
 * @param methodNames An array of method names to spy on
 */
export function createSpyObj<T = any>(
    baseNameOrMethodNames: string | string[],
    methodNames?: string[]
): T {
    let methods: string[] = [];
    if (Array.isArray(baseNameOrMethodNames)) {
        methods = baseNameOrMethodNames;
    } else if (methodNames) {
        methods = methodNames;
    }

    const obj: any = {};
    for (const method of methods) {
        obj[method] = vi.fn();
    }
    return obj as T;
}
