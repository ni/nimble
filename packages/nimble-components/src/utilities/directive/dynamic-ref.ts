import {
    AttachedBehaviorHTMLDirective,
    type Behavior,
    type CaptureType
} from '@microsoft/fast-element';

/**
 * A directive that updates a property with a reference to the element.
 * Similar to RefBehavior, but sets the property back to undefined when unbound
 * (when the source element is removed from the DOM).
 * @public
 */
export class DynamicRefBehavior implements Behavior {
    private readonly target: unknown;
    private propertyName: string;

    /**
     * Creates an instance of DynamicRefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    public constructor(target: unknown, propertyName: string) {
        this.target = target;
        this.propertyName = propertyName;
    }

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     */

    public bind(source: unknown): void {
        // @ts-expect-error set property on source
        source[this.propertyName] = this.target;
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    public unbind(source: unknown): void {
        // @ts-expect-error set property on source
        source[this.propertyName] = undefined;
    }
}

/**
 * A directive that updates a property with a reference to the source element.
 * Similar to RefBehavior, but sets the property back to undefined when unbound
 * (when the source element is removed from the DOM).
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
export function dynamicRef<T = unknown>(
    propertyName: keyof T & string
): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        'nimble-dynamic-ref',
        DynamicRefBehavior,
        propertyName
    );
}
