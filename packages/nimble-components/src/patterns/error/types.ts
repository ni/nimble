import { attr, FASTElement, observable } from '@microsoft/fast-element';

export interface ErrorPattern {
    errorText?: string;
    errorVisible: boolean;
    errorHasOverflow: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FASTElementConstructor = abstract new (...args: any[]) => FASTElement;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinErrorPattern<TBase extends FASTElementConstructor>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to support being resized
     * proportionally within a Table.
     */
    abstract class ErrorPatternElement extends base implements ErrorPattern {
        /**
         * The error text that will be displayed when a component is in the error appearance
         */
        public errorText?: string;

        /*
         * Show the error appearance of the control
         */
        public errorVisible = false;

        /* @internal
         * Indicates if the error text has overflowed its container. The value should not be
         * set directly. Instead, it is used with the `overflow` directive.
         */
        public errorHasOverflow = false;
    }

    attr({ attribute: 'error-text' })(
        ErrorPatternElement.prototype,
        'errorText'
    );
    attr({ attribute: 'error-visible', mode: 'boolean' })(
        ErrorPatternElement.prototype,
        'errorVisible'
    );
    observable(
        ErrorPatternElement.prototype,
        'errorHasOverflow'
    );
    return ErrorPatternElement;
}
