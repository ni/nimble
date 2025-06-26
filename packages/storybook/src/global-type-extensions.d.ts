// Note: This file should be kept in sync with other copies of global-type-extensions.d.ts in the monorepo

// This file has modifications to global types used for nimble-components builds:
// - The types file should not be in the build output
//   - You should not see a file with these types created in the dist build
// - Type additions added to this file should not appear in any public API definitions
//   - The fields added to global types should not be observable in any built .d.ts file by TypeScript. To verify you can do a text search of generated .d.ts files in the dist folder for the fields being added and verify they are not associated with the augmented types.
// -  This file should only impact the nimble-components library build and not users of nimble-components. Any type changes that impact clients should not be placed here.

declare namespace Intl {
    // roundingPriority has been supported by browsers since 8/23, but TypeScript still hasn't
    // added it to the type definition. See https://github.com/microsoft/TypeScript/issues/56269
    interface NumberFormatOptions {
        roundingPriority?:
        | 'auto'
        | 'morePrecision'
        | 'lessPrecision'
        | undefined;
    }
}
