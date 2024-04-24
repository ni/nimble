import { parameterizeSuite } from '../parameterizeSuite.js';

// The following aliases are just to reduce the number
// of eslint disables in this test file. In normal
// test code use the globals directly so eslint can
// guard accidental check-ins of fit, etc.
// eslint-disable-next-line no-restricted-globals
const FDESCRIBE = fdescribe;
const DESCRIBE = describe;
const XDESCRIBE = xdescribe;

interface ParameterizeListTestArgs {
    suite: typeof DESCRIBE | typeof XDESCRIBE | typeof FDESCRIBE;
    name: string;
}
const paramertizeListTestArgs = ([
    suite,
    name
]: unknown[]): ParameterizeListTestArgs => ({
    suite,
    name
} as ParameterizeListTestArgs);

describe('Function parameterizeSuite', () => {
    describe('can parameterize simple lists', () => {
        it('with test enabled', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSuite(testcases, spy);

            expect(spy).toHaveBeenCalledTimes(1);
            const { suite, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(suite).toBe(DESCRIBE);
            expect(name).toBe('case1');
        });

        it('with test focused', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSuite(testcases, spy, {
                case1: FDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { suite, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(suite).toBe(FDESCRIBE);
            expect(name).toBe('case1');
        });

        it('with test disabled', () => {
            const testcases = [{ name: 'case1' }] as const;
            const spy = jasmine.createSpy();
            parameterizeSuite(testcases, spy, {
                case1: XDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(1);
            const { suite, name } = paramertizeListTestArgs(
                spy.calls.argsFor(0)
            );
            expect(suite).toBe(XDESCRIBE);
            expect(name).toBe('case1');
        });

        it('with various test cases enabled and disabled', () => {
            const testcases = [
                { name: 'case1' },
                { name: 'case2' },
                { name: 'case3' }
            ] as const;
            const spy = jasmine.createSpy();
            parameterizeSuite(testcases, spy, {
                case2: XDESCRIBE,
                case3: FDESCRIBE
            });

            expect(spy).toHaveBeenCalledTimes(3);
            {
                const { suite, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(0)
                );
                expect(suite).toBe(DESCRIBE);
                expect(name).toBe('case1');
            }
            {
                const { suite, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(1)
                );
                expect(suite).toBe(XDESCRIBE);
                expect(name).toBe('case2');
            }
            {
                const { suite, name } = paramertizeListTestArgs(
                    spy.calls.argsFor(2)
                );
                expect(suite).toBe(FDESCRIBE);
                expect(name).toBe('case3');
            }
        });
    });
    describe('errors', () => {
        it('for override not in test cases', () => {
            const testcases = [{ name: 'case1' }] as { name: string }[];

            expect(() => {
                parameterizeSuite(testcases, () => {}, {
                    unknown: XDESCRIBE
                });
            }).toThrowError(/override names must match test case name/);
        });
        it('for override not referencing supported xit or fit', () => {
            const testcases = [{ name: 'case1' }] as const;

            expect(() => {
                parameterizeSuite(testcases, () => {}, {
                    case1: DESCRIBE
                });
            }).toThrowError(/jasmine suite functions: fdescribe or xdescribe/);
        });
    });
});
