/**
 * This interface should be used by components that want to leverage the errorTextTemplate defined in templates.ts
 */
export interface IHasErrorText {
    /**
     * The error text that will be displayed when a component has the 'invalid' class set
     */
    errorText: string | undefined;
}
