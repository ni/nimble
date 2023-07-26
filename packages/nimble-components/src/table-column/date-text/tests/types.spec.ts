import type { DateTextFormat } from '../types';

describe('Date-text column types', () => {
    it('DateTextFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: DateTextFormat = 'hello';
        expect(format!).toEqual('hello');
    });

    it('LocaleMatcherAlgorithm fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: LocaleMatcherAlgorithm = 'hello';
        expect(format).toEqual('hello');
    });

    it('WeekdayFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: WeekdayFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('EraFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: EraFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('SimpleNumberFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: SimpleNumberFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('MonthFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: MonthFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('TimeZoneFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: TimeZoneFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('FormatMatcherAlgorithm fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: FormatMatcherAlgorithm = 'hello';
        expect(format).toEqual('hello');
    });

    it('DayPeriodFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: DayPeriodFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('DateStyle fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: DateStyle = 'hello';
        expect(format).toEqual('hello');
    });

    it('TimeStyle fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: TimeStyle = 'hello';
        expect(format).toEqual('hello');
    });

    it('HourCycle fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: HourCycle = 'hello';
        expect(format).toEqual('hello');
    });
});
