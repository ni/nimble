// The following aliases are just to reduce the number
// of eslint disables in this source file. In normal
// test code use the globals directly so eslint can
// guard accidental check-ins of fit, etc.
// eslint-disable-next-line no-restricted-globals
export type Fit = typeof fit;
export type Xit = typeof xit;
export type It = typeof it;
/**
 * One of the jasmine spec functions: fit, xit, or it
 */
export type Spec = Fit | Xit | It;
/**
 * One of the jasmine spec functions: fit or xit
 */
export type SpecOverride = Fit | Xit;

// eslint-disable-next-line no-restricted-globals
export type Fdescribe = typeof fdescribe;
export type Xdescribe = typeof xdescribe;
export type Describe = typeof describe;
/**
 * One of the jasmine spec functions: fit, xit, or it
 */
export type Suite = Fdescribe | Xdescribe | Describe;
/**
 * One of the jasmine spec functions: fit or xit
 */
export type SuiteOverride = Fdescribe | Xdescribe;

export type ObjectFromNamedList<T extends readonly { name: string }[]> = {
    [K in T extends readonly { name: infer U }[] ? U : never]: T[number];
};
