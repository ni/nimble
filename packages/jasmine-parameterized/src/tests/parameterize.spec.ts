import { parameterize } from '../parameterize.js';

// The following aliases are just to reduce the number
// of eslint disables in this test file. In normal
// test code use the globals directly so eslint can
// guard accidental check-ins of fit, etc.
// eslint-disable-next-line no-restricted-globals
const FIT = fit;
const IT = it;
const XIT = xit;

interface ParameterizeSpecTestArgs {
    spec: typeof IT | typeof XIT | typeof FIT;
    name: string;
    value: unknown;
}
const paramertizeSpecTestArgs = ([
    spec,
    name,
    value
]: unknown[]): ParameterizeSpecTestArgs => ({
    spec,
    name,
    value
} as ParameterizeSpecTestArgs);

describe('Function parameterize with specs', () => {
    describe('can parameterize simple objects', () => {
        it('with test enabled', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('spec', testcases, spy);

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeSpecTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(IT);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with test focused', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('spec', testcases, spy, {
                case1: FIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeSpecTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(FIT);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with test disabled', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('spec', testcases, spy, {
                case1: XIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeSpecTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(XIT);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with various test cases enabled and disabled', () => {
            const testcases = {
                case1: 'one',
                case2: 'two',
                case3: 'three'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('spec', testcases, spy, {
                case2: XIT,
                case3: FIT
            });

            expect(spy).toHaveBeenCalledTimes(3);
            {
                const { spec, name, value } = paramertizeSpecTestArgs(
                    spy.calls.argsFor(0)
                );
                expect(spec).toBe(IT);
                expect(name).toBe('case1');
                expect(value).toBe('one');
            }
            {
                const { spec, name, value } = paramertizeSpecTestArgs(
                    spy.calls.argsFor(1)
                );
                expect(spec).toBe(XIT);
                expect(name).toBe('case2');
                expect(value).toBe('two');
            }
            {
                const { spec, name, value } = paramertizeSpecTestArgs(
                    spy.calls.argsFor(2)
                );
                expect(spec).toBe(FIT);
                expect(name).toBe('case3');
                expect(value).toBe('three');
            }
        });
    });
    describe('errors', () => {
        it('for override not in test cases', () => {
            const testcases = {
                case1: 'one'
            } as { [key: string]: string };

            expect(() => {
                parameterize('spec', testcases, () => {}, {
                    unknown: XIT
                });
            }).toThrowError(/override names must match test case name/);
        });
        it('for override not referencing supported xit or fit', () => {
            const testcases = {
                case1: 'one'
            } as const;

            expect(() => {
                parameterize('spec', testcases, () => {}, {
                    case1: IT
                });
            }).toThrowError(/jasmine spec functions: fit or xit/);
        });
    });
});

// eslint-disable-next-line no-restricted-globals
const FDESCRIBE = fdescribe;
const DESCRIBE = describe;
const XDESCRIBE = xdescribe;

interface ParameterizeSuiteTestArgs {
    spec: typeof DESCRIBE | typeof XDESCRIBE | typeof FDESCRIBE;
    name: string;
    value: unknown;
}
const parameterizeSuiteTestArgs = ([
    spec,
    name,
    value
]: unknown[]): ParameterizeSuiteTestArgs => ({
    spec,
    name,
    value
} as ParameterizeSuiteTestArgs);

describe('Function parameterize with suites', () => {
    describe('can parameterize simple objects', () => {
        it('with test enabled', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('suite', testcases, spy);

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = parameterizeSuiteTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(DESCRIBE);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with test focused', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('suite', testcases, spy, {
                case1: FDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = parameterizeSuiteTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(FDESCRIBE);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with test disabled', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('suite', testcases, spy, {
                case1: XDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = parameterizeSuiteTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(XDESCRIBE);
            expect(name).toBe('case1');
            expect(value).toBe('one');
        });

        it('with various test cases enabled and disabled', () => {
            const testcases = {
                case1: 'one',
                case2: 'two',
                case3: 'three'
            } as const;
            const spy = jasmine.createSpy();
            parameterize('suite', testcases, spy, {
                case2: XDESCRIBE,
                case3: FDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(3);
            {
                const { spec, name, value } = parameterizeSuiteTestArgs(
                    spy.calls.argsFor(0)
                );
                expect(spec).toBe(DESCRIBE);
                expect(name).toBe('case1');
                expect(value).toBe('one');
            }
            {
                const { spec, name, value } = parameterizeSuiteTestArgs(
                    spy.calls.argsFor(1)
                );
                expect(spec).toBe(XDESCRIBE);
                expect(name).toBe('case2');
                expect(value).toBe('two');
            }
            {
                const { spec, name, value } = parameterizeSuiteTestArgs(
                    spy.calls.argsFor(2)
                );
                expect(spec).toBe(FDESCRIBE);
                expect(name).toBe('case3');
                expect(value).toBe('three');
            }
        });
    });
    describe('errors', () => {
        it('for override not in test cases', () => {
            const testcases = {
                case1: 'one'
            } as { [key: string]: string };

            expect(() => {
                parameterize('suite', testcases, () => {}, {
                    unknown: XDESCRIBE
                });
            }).toThrowError(/override names must match test case name/);
        });
        it('for override not referencing supported xit or fit', () => {
            const testcases = {
                case1: 'one'
            } as const;

            expect(() => {
                parameterize('suite', testcases, () => {}, {
                    case1: DESCRIBE
                });
            }).toThrowError(/jasmine suite functions: fdescribe or xdescribe/);
        });
    });
});
