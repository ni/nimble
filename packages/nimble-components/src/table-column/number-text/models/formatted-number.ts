/**
 * The result of formatting a number, which can involve rounding (both string and numeric representations)
 */
export class FormattedNumber {
    public static empty = new FormattedNumber(NaN, '');
    public constructor(
        public readonly number: number,
        public readonly string: string
    ) {}
}
