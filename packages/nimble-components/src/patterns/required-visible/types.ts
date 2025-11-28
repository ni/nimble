import { attr, FASTElement } from '@ni/fast-element';

export interface RequiredVisiblePattern {
    /**
     * Whether or not to show the required appearance of the control
     */
    requiredVisible: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FASTElementConstructor = abstract new (...args: any[]) => FASTElement;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinRequiredVisiblePattern<
    TBase extends FASTElementConstructor
>(base: TBase) {
    /**
     * The Mixin that provides the requiredVisible property and required-visible attribute
     * to a component.
     */
    abstract class RequiredVisibleElement
        extends base
        implements RequiredVisiblePattern
    {
        /*
         * Show the required appearance of the control
         */
        public requiredVisible = false;
    }

    attr({ attribute: 'required-visible', mode: 'boolean' })(
        RequiredVisibleElement.prototype,
        'requiredVisible'
    );
    return RequiredVisibleElement;
}
