import {
    Behavior,
    ElementStyles,
    FASTElement,
    Observable
} from '@microsoft/fast-element';

/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
export class MultivaluePropertyStyleSheetBehavior<PropertyType>
implements Behavior {
    /**
     * Constructs a {@link MultivaluePropertyStyleSheetBehavior} instance.
     * @param propertyName - The property name to operate from.
     * @param value - The property value or values to operate from.
     * @param styles - The styles to coordinate with the property.
     */
    public constructor(
        private readonly propertyName: string,
        private readonly value: PropertyType | PropertyType[],
        private readonly styles: ElementStyles
    ) {}

    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    public bind(elementInstance: FASTElement): void {
        Observable.getNotifier(elementInstance).subscribe(
            this,
            this.propertyName
        );
        this.handleChange(elementInstance, this.propertyName);
    }

    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    public unbind(source: FASTElement & HTMLElement): void {
        Observable.getNotifier(source).unsubscribe(this, this.propertyName);
        source.$fastController.removeStyles(this.styles);
    }

    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    public handleChange(source: FASTElement, key: string): void {
        // @ts-expect-error Accessing arbitrary property of an element
        const currentValue: PropertyType = source[key] as PropertyType;
        if (
            Array.isArray(this.value)
                ? this.value.includes(currentValue)
                : this.value === currentValue
        ) {
            source.$fastController.addStyles(this.styles);
        } else {
            source.$fastController.removeStyles(this.styles);
        }
    }
}
