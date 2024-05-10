import {
    AttachedBehaviorHTMLDirective,
    FASTElement,
    Observable,
    type Behavior,
    type CaptureType
} from '@microsoft/fast-element';
import { Anchor } from '@microsoft/fast-foundation';
import { MenuButton } from '../../menu-button';
import { Button } from '../../button';
import { ToggleButton } from '../../toggle-button';

/**
 * Sets tabindex to -1 (non-focusable by keyboard) for an element.
 * Can override an element setting tabindex in it's template by waiting until after it's connected.
 *
 * TODO this directive will go away with the tabindex work in https://github.com/ni/nimble/issues/2094
 */
export class NotFocusableBehavior implements Behavior {
    public constructor(private readonly target: FASTElement & HTMLElement) {}

    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    public bind(_source: unknown): void {
        const notifier = Observable.getNotifier(this.target);
        notifier.subscribe(this, 'isConnected');
        if (this.target.$fastController.isConnected) {
            this.updateTabIndex();
        }
    }

    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    public unbind(_source: unknown): void {
        const notifier = Observable.getNotifier(this.target);
        notifier.unsubscribe(this, 'isConnected');
    }

    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    public handleChange(source: FASTElement & HTMLElement, key: string): void {
        if (key === 'isConnected' && source.$fastController.isConnected) {
            this.updateTabIndex();
        }
    }

    private updateTabIndex(): void {
        getTabIndexTarget(this.target).tabIndex = -1;
    }
}

/**
 * Directive that handles setting tabindex to -1 (non-focusable by keyboard) for an element.
 * Can override an element setting tabindex in it's template by waiting until after it's connected.
 * @public
 */
export function notFocusable<T = unknown>(): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        'nimble-not-focusable',
        NotFocusableBehavior,
        {}
    );
}

/**
 * Get the tabindex target for an element (possibly something in its shadow root)
 *
 * TODO this will go away with the tabindex work in https://github.com/ni/nimble/issues/2094
 * @param element Element
 * @returns Tab index target element
 */
export function getTabIndexTarget(element: HTMLElement): HTMLElement {
    if (element instanceof MenuButton) {
        return element.toggleButton!.control;
    }
    if (element instanceof ToggleButton) {
        return element.control;
    }
    if (element instanceof Anchor) {
        return element.control!;
    }
    if (element instanceof Button) {
        return element.control;
    }
    return element;
}
