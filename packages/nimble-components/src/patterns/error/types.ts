/**
 * This interface should be used by components that want to leverage the error pattern
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
}
