import { parameterize, parameterizeSpec } from '../parameterized.js';

// The following aliases are just to reduce the number
// of eslint disables in this test file. In normal
// test code use the globals directly so eslint can
// guard accidental check-ins of fit, etc.
// eslint-disable-next-line no-restricted-globals
const FIT = fit;
const IT = it;
const XIT = xit;

interface ParameterizeTestArgs {
    spec: typeof IT | typeof XIT | typeof FIT;
    name: string;
    value: unknown;
}
const paramertizeTestArgs = ([
    spec,
    name,
    value
]: unknown[]): ParameterizeTestArgs => ({
    spec,
    name,
    value
} as ParameterizeTestArgs);

describe('Funtion parameterize', () => {
    describe('can parameterize simple objects', () => {
        it('with test enabled', () => {
            const testcases = {
                case1: 'one'
            } as const;
            const spy = jasmine.createSpy();
            parameterize(testcases, spy);

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeTestArgs(
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
            parameterize(testcases, spy, {
                case1: FIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeTestArgs(
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
            parameterize(testcases, spy, {
                case1: XIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name, value } = paramertizeTestArgs(
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
            parameterize(testcases, spy, {
                case2: XIT,
                case3: FIT
            });

            expect(spy).toHaveBeenCalledTimes(3);
            {
                const { spec, name, value } = paramertizeTestArgs(
                    spy.calls.argsFor(0)
                );
                expect(spec).toBe(IT);
                expect(name).toBe('case1');
                expect(value).toBe('one');
            }
            {
                const { spec, name, value } = paramertizeTestArgs(
                    spy.calls.argsFor(1)
                );
                expect(spec).toBe(XIT);
                expect(name).toBe('case2');
                expect(value).toBe('two');
            }
            {
                const { spec, name, value } = paramertizeTestArgs(
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
                parameterize(testcases, () => {}, {
                    unknown: XIT
                });
            }).toThrowError(/override names must match test case name/);
        });
        it('for override not referencing supported xit or fit', () => {
            const testcases = {
                case1: 'one'
            } as const;

            expect(() => {
                parameterize(testcases, () => {}, {
                    case1: IT
                });
            }).toThrowError(/jasmine spec functions: fit or xit/);
        });
    });
});

interface ParameterizeListTestArgs {
    spec: typeof IT | typeof XIT | typeof FIT;
    name: string;
}
const paramertizeListTestArgs = ([
    spec,
    name
]: unknown[]): ParameterizeListTestArgs => ({
    spec,
    name
} as ParameterizeListTestArgs);

describe('Funtion parameterizeSpec', () => {
    describe('can parameterize simple lists', () => {
        it('with test enabled', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSpec(testcases, spy);

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(IT);
            expect(name).toBe('case1');
        });

        it('with test focused', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSpec(testcases, spy, {
                case1: FIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(FIT);
            expect(name).toBe('case1');
        });

        it('with test disabled', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSpec(testcases, spy, {
                case1: XIT
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { spec, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(spec).toBe(XIT);
            expect(name).toBe('case1');
        });

        it('with various test cases enabled and disabled', () => {
            const testcases = [
                { name: 'case1' },
                { name: 'case2' },
                { name: 'case3' }
            ] as const;
            const spy = jasmine.createSpy();
            parameterizeSpec(testcases, spy, {
                case2: XIT,
                case3: FIT
            });

            expect(spy).toHaveBeenCalledTimes(3);
            {
                const { spec, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(0)
                );
                expect(spec).toBe(IT);
                expect(name).toBe('case1');
            }
            {
                const { spec, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(1)
                );
                expect(spec).toBe(XIT);
                expect(name).toBe('case2');
            }
            {
                const { spec, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(2)
                );
                expect(spec).toBe(FIT);
                expect(name).toBe('case3');
            }
        });
    });
    describe('errors', () => {
        it('for override not in test cases', () => {
            const testcases = [{ name: 'case1' }] as { name: string }[];

            expect(() => {
                parameterizeSpec(testcases, () => {}, {
                    unknown: XIT
                });
            }).toThrowError(/override names must match test case name/);
        });
        it('for override not referencing supported xit or fit', () => {
            const testcases = [{ name: 'case1' }] as const;

            expect(() => {
                parameterizeSpec(testcases, () => {}, {
                    case1: IT
                });
            }).toThrowError(/jasmine spec functions: fit or xit/);
        });
    });
});
