import type { CSSDesignToken } from '@ni/fast-foundation';
import { Icon } from '.';

type IconClass = typeof Icon;

/**
 * Factory function to create multi-color icon classes
 * @internal
 */
export function createMultiColorIconClass(
    baseClass: IconClass,
    colors: readonly CSSDesignToken<string>[]
): IconClass {
    // Return a new class that extends the base and adds layer colors
    // Type assertion needed because we're dynamically adding layerColors property
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion
    return class extends baseClass {
        public constructor() {
            super();
            Object.defineProperty(this, 'layerColors', {
                value: colors,
                writable: false
            });
        }
    } as unknown as IconClass;
}
