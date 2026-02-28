import { attr, FASTElement, observable } from '@ni/fast-element';

export const Severity = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    success: 'success',
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

export interface SeverityPattern {
    severityText?: string;
    severity: Severity;
    severityHasOverflow: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FASTElementConstructor = abstract new (...args: any[]) => FASTElement;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinSeverityPattern<TBase extends FASTElementConstructor>(
    base: TBase
) {
    /**
     * Mixin to provide severity text related properties to an element
     */
    abstract class SeverityPatternElement extends base implements SeverityPattern {
        /**
         * The severity state of the element
         */
        public abstract severity: Severity;

        /**
         * The severity text that will be displayed when a component is not in the default severity state
         */
        public severityText?: string;

        /* @internal
         * Indicates if the severity text has overflowed its container. The value should not be
         * set directly. Instead, it is used with the `overflow` directive.
         */
        public severityHasOverflow = false;
    }
    attr({ attribute: 'severity-text' })(
        SeverityPatternElement.prototype,
        'severityText'
    );
    observable(SeverityPatternElement.prototype, 'severityHasOverflow');
    return SeverityPatternElement;
}
