/**
 * This is a workaround for an incomplete definition of the native dialog element. Remove when using Typescript >=4.8.3.
 * https://github.com/microsoft/TypeScript/issues/48267
 * @internal
 */
interface HTMLDialogElement {
    showModal(): void;
    close(): void;
}

declare namespace Intl {
    // roundingPriority has been supported by browsers since 8/23, but TypeScript still hasn't
    // added it to the type definition. See https://github.com/microsoft/TypeScript/issues/56269
    interface NumberFormatOptions {
        roundingPriority?: 'auto' | 'morePrecision' | 'lessPrecision';
    }
}
