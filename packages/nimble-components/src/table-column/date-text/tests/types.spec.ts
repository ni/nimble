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

    it('YearFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: YearFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('MonthFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: MonthFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('DayFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: DayFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('HourFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: HourFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('MinuteFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: MinuteFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('SecondFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: SecondFormat = 'hello';
        expect(format).toEqual('hello');
    });

    it('TimeZoneNameFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: TimeZoneNameFormat = 'hello';
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

    it('HourCycleFormat fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const format: HourCycleFormat = 'hello';
        expect(format).toEqual('hello');
    });
});
