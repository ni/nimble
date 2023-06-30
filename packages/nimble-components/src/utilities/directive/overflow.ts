import {
    AttachedBehaviorHTMLDirective,
    type Behavior,
    type CaptureType
} from '@microsoft/fast-element';

/**
 * The runtime behavior for template overflow detection.
 * @public
 */
export class OverflowBehavior implements Behavior {
    private mouseOverHandler!: () => void;
    private mouseOutHandler!: () => void;

    /**
     * Creates an instance of OverflowBehavior.
     * @param target - The element to check for overflow.
     * @param propertyName - The name of the property to assign the overflow state to.
     */
    public constructor(
        private readonly target: HTMLElement,
        private propertyName: string
    ) {}

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    public bind(source: unknown): void {
        // @ts-expect-error set property on source
        source[this.propertyName] = false;
        this.mouseOverHandler = () => {
            const hasOverflow = this.target.offsetWidth < this.target.scrollWidth;
            // @ts-expect-error set property on source
            source[this.propertyName] = hasOverflow;
        };
        this.mouseOutHandler = () => {
            // @ts-expect-error set property on source
            source[this.propertyName] = false;
        };
        this.target.addEventListener('mouseover', this.mouseOverHandler);
        this.target.addEventListener('mouseout', this.mouseOutHandler);
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    public unbind(): void {
        this.target.removeEventListener('mouseover', this.mouseOverHandler);
        this.target.removeEventListener('mouseout', this.mouseOutHandler);
    }
}

/**
 * A directive that observes if an element has overflow and sets a flag.
 * @param propertyName - The name of the property to assign the overflow flag.
 * @public
 */
export function overflow<T = unknown>(
    propertyName: keyof T & string
): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        'nimble-overflow',
        OverflowBehavior,
        propertyName
    );
}
