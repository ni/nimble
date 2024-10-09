/**
 * This interface should be used by components that want to leverage the error pattern. The error pattern conditionally adds error text to the template when an error is configured to be visible.
 */
export interface ErrorPattern {
    /**
     * The error text that will be displayed when a component is in the error appearance
     */
    errorText?: string;

    /*
     * Show the error appearance of the control
     */
    errorVisible: boolean;

    /* @internal
     * Indicates if the error text has overflowed its container. The value should not be
     * set directly. Instead, it is used with the `overflow` directive. When declared in an
     * implementation of `ErrorPattern`, it must be declared as `@observable`.
     */
    errorHasOverflow: boolean;
}
