// import type { Locale } from '../localization/Locale';
// import { currentLocale } from '../localization';

export interface DatePickerLocale {
    months: {
        name: string[],
        shorthand: string[]
    };
    weekdays: {
        name: string[],
        shorthand: string[]
    };
    firstDayOfWeek: number;
    dateFormat: string;
    dateFormatPlaceholder: string;
    chooseDateLabel: string;
    changeDateLabel: (date: string) => string;
    chooseDatesLabel: string;
    changeDatesLabel: (range: string) => string;
    prevYearLabel: string;
    prevMonthLabel: string;
    nextMonthLabel: string;
    nextYearLabel: string;
    clearLabel: string;
    okLabel: string;
    invalidDateError: string;
    invalidDateRangeError: string;
    startDateAfterMinDateError: (minDate: string) => string;
    endDateBeforeMaxDateError: (maxDate: string) => string;
}

export interface Locale {
    lang: string;
    common: {
        useCommaAsDecimalSeparator: boolean
    };
    datePicker: DatePickerLocale;
    // timePicker: TimePickerLocale;
    // filePicker: FilePickerLocale;
    // audioPlayer: AudioPlayerLocale;
    // alert: AlertLocale;
    // dialog: DialogLocale;
    // banner: BannerLocale;
    // numberField: NumberFieldLocale;
    // splitButton: SplitButtonLocale;
    // videoPlayer: VideoPlayerLocale;
    // rangeSlider: RangeSliderLocale;
    // dialPad: DialPadLocale;
}

/**
 * TODO
 */
export class Localized {
    public get locale(): Locale {
        // return currentLocale.locale;
        return {
            lang: 'en-US',
            common: { useCommaAsDecimalSeparator: false },
            datePicker: {
                months: {
                    name: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                weekdays: {
                    name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                },
                firstDayOfWeek: 0,
                dateFormat: 'MM/dd/yyyy',
                dateFormatPlaceholder: 'MM/DD/YYYY',
                chooseDateLabel: 'Choose date',
                chooseDatesLabel: 'Choose dates',
                prevYearLabel: 'Previous year',
                prevMonthLabel: 'Previous month',
                nextMonthLabel: 'Next month',
                nextYearLabel: 'Next year',
                clearLabel: 'Clear',
                okLabel: 'OK',
                invalidDateError: 'Please enter a valid date.',
                invalidDateRangeError: 'Please enter a valid date range.',
                changeDateLabel: function (date: string): string {
                    return `Change date, ${date}`;
                },
                changeDatesLabel: function (range: string): string {
                    return `Change dates, ${range}`;
                },
                startDateAfterMinDateError: function (minDate: string): string {
                    return `The start date must be ${minDate} or later.`;
                },
                endDateBeforeMaxDateError: function (maxDate: string): string {
                    return `The end date must be ${maxDate} or earlier.`;
                }
            }
        };
    }
}
