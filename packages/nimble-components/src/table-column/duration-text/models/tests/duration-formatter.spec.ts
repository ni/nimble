import { parameterizeNamedList } from '@ni/jasmine-parameterized/dist/esm/parameterized';
import { DurationFormatter } from '../duration-formatter';

describe('Duration Formatter', () => {
    const formatter = new DurationFormatter('en-EN');
    describe('displays expected duration', () => {
        const goodValueData = [
            {
                name: '0d 1h 1m 1s',
                value: 3661000,
                expected: '1 hr, 1 min, 1 sec'
            },
            {
                name: '1d 0h 1m 1s',
                value: 86461000,
                expected: '1 day, 1 min, 1 sec'
            },
            {
                name: '1d 1h 0m 1s',
                value: 90001000,
                expected: '1 day, 1 hr, 1 sec'
            },
            {
                name: '1d 1h 1m 0s',
                value: 90060000,
                expected: '1 day, 1 hr, 1 min'
            },
            {
                name: '1d 1h 1m 0.0005s',
                value: 90060000.5,
                expected: '1 day, 1 hr, 1 min, 0.001 sec'
            },
            {
                name: '1d 1h 1m 0.00049s',
                value: 90060000.49,
                expected: '1 day, 1 hr, 1 min'
            },
            { name: '0s', value: 0, expected: '0 sec' },
            { name: '-0s', value: -0, expected: '0 sec' },
            { name: '1.5s', value: 1500, expected: '1.5 sec' },
            { name: '1.555s', value: 1555, expected: '1.555 sec' },
            {
                name: '1.5556s',
                value: 1555.6,
                expected: '1.556 sec'
            },
            {
                name: '1.5554s',
                value: 1555.4,
                expected: '1.555 sec'
            },
            {
                name: '59999.9999999999997s',
                value: 59999.9999999999997,
                expected: '1 min'
            },
            {
                name: '999 days',
                value: 8.63136e10,
                expected: '999 days'
            },
            {
                name: '1000 days',
                value: 8.64e10,
                expected: '8.64E7 sec'
            },
            { name: '1ms', value: 1, expected: '0.001 sec' },
            { name: '0.99ms', value: 0.99, expected: '9.9E-4 sec' },
            {
                name: 'MIN_VALUE',
                value: Number.MIN_VALUE,
                expected: '0 sec'
            },
            {
                name: 'MIN_VALUE * 1000',
                value: Number.MIN_VALUE * 1000,
                expected: '5E-324 sec'
            },
            {
                name: 'MAX_VALUE',
                value: Number.MAX_VALUE,
                expected: '1.798E305 sec'
            }
        ] as const;

        parameterizeNamedList(goodValueData, (spec, name, value) => {
            spec(name, () => {
                const formattedValue = formatter.format(value.value);
                expect(formattedValue).toBe(value.expected);
            });
        });
    });

    describe('displays blank when', () => {
        const badValueData = [
            { name: 'value is null', value: null },
            { name: 'value is undefined', value: undefined },
            {
                name: 'value is Inf',
                value: Number.POSITIVE_INFINITY
            },
            {
                name: 'value is -Inf',
                value: Number.NEGATIVE_INFINITY
            },
            { name: 'value is NaN', value: Number.NaN },
            {
                name: 'value is negative',
                value: -1
            },
            {
                name: 'value is not a number',
                value: 'foo' as unknown as number
            }
        ] as const;

        parameterizeNamedList(badValueData, (spec, name, value) => {
            spec(name, () => {
                const formattedValue = formatter.format(value.value);
                expect(formattedValue).toBe('');
            });
        });
    });
});
