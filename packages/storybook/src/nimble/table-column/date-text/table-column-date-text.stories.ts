import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { tableColumnDateTextTag } from '../../../../../nimble-components/src/table-column/date-text';
import {
    DateTextFormat,
    DateStyle,
    DayPeriodFormat,
    EraFormat,
    FormatMatcherAlgorithm,
    HourCycleFormat,
    LocaleMatcherAlgorithm,
    YearFormat,
    MonthFormat,
    DayFormat,
    HourFormat,
    MinuteFormat,
    SecondFormat,
    TimeStyle,
    TimeZoneNameFormat,
    WeekdayFormat
} from '../../../../../nimble-components/src/table-column/date-text/types';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    validityDescription
} from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        birthday: new Date(1984, 4, 12, 14, 34, 19, 377).valueOf()
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        birthday: new Date(1984, 2, 19, 7, 6, 48, 584).valueOf()
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        birthday: new Date(2013, 3, 1, 20, 4, 37, 975).valueOf()
    },
    {
        firstName: 'Abbey',
        lastName: 'Simpson?',
        birthday: undefined
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Date Text',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    placeholder: string;
    format: keyof typeof DateTextFormat;
    customDateStyle: DateStyle;
    customTimeStyle: TimeStyle;
    customWeekday: WeekdayFormat;
    customDay: DayFormat;
    customMonth: MonthFormat;
    customYear: YearFormat;
    customEra: EraFormat;
    customHour: HourFormat;
    customMinute: MinuteFormat;
    customSecond: SecondFormat;
    customHour12?: boolean;
    customHourCycle: HourCycleFormat;
    customTimeZoneName: TimeZoneNameFormat;
    customTimeZone?: string;
    customDayPeriod: DayPeriodFormat;
    customCalendar?: string;
    customNumberingSystem?: string;
    customFormatMatcher: FormatMatcherAlgorithm;
    customLocaleMatcher: LocaleMatcherAlgorithm;
    checkValidity: () => void;
    validity: () => void;
}

const formatDescription = `By default, dates are formatted similar to "Jan 1, 2023, 12:00:00 AM". To use a different format, set this attribute to
\`custom\` and provide additional attributes corresponding to [\`Intl.DateTimeFormat()\` options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).
Each \`Intl.DateTimeFormat()\` option has a corresponding attribute whose name is kebab-cased and prefixed with \`custom-\` e.g. \`custom-date-style\`
corresponds to \`dateStyle\`.

Note: The exact formatting of the resulting date time string is browser-specific and may vary slightly between browsers.
`;

export const dateTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                field-name="${x => x.fieldName}"
            >
            Name
            </${tableColumnTextTag}>
            <${tableColumnDateTextTag}
                field-name="birthday"
                placeholder="${x => x.placeholder}"
                format="${x => DateTextFormat[x.format]}"
                custom-date-style="${x => x.customDateStyle}"
                custom-time-style="${x => x.customTimeStyle}"
                custom-weekday="${x => x.customWeekday}"
                custom-day="${x => x.customDay}"
                custom-month="${x => x.customMonth}"
                custom-year="${x => x.customYear}"
                custom-era="${x => x.customEra}"
                custom-hour="${x => x.customHour}"
                custom-minute="${x => x.customMinute}"
                custom-second="${x => x.customSecond}"
                custom-hour12="${x => x.customHour12}"
                custom-hour-cycle="${x => x.customHourCycle}"
                custom-time-zone-name="${x => x.customTimeZoneName}"
                custom-time-zone="${x => x.customTimeZone}"
                custom-day-period="${x => x.customDayPeriod}"
                custom-calendar="${x => x.customCalendar}"
                custom-numbering-system="${x => x.customNumberingSystem}"
                custom-format-matcher="${x => x.customFormatMatcher}"
                custom-locale-matcher="${x => x.customLocaleMatcher}"
            >
            Birthday
            </${tableColumnDateTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the `Date` type.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description:
                'The placeholder text to display when the field value is `undefined` or `null` for a record.',
            table: { category: apiCategory.attributes }
        },
        format: {
            description: formatDescription,
            options: Object.keys(DateTextFormat),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customDateStyle: {
            name: 'custom-date-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'full', 'long', 'medium', 'short'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customTimeStyle: {
            name: 'custom-time-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'full', 'long', 'medium', 'short'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customWeekday: {
            name: 'custom-weekday',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'long', 'short', 'narrow'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customDay: {
            name: 'custom-day',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customMonth: {
            name: 'custom-month',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [
                undefined,
                'numeric',
                '2-digit',
                'long',
                'short',
                'narrow'
            ],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customYear: {
            name: 'custom-year',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customEra: {
            name: 'custom-era',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'long', 'short', 'narrow'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customHour: {
            name: 'custom-hour',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customMinute: {
            name: 'custom-minute',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customSecond: {
            name: 'custom-second',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customHour12: {
            name: 'custom-hour12',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, true, false],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customHourCycle: {
            name: 'custom-hour-cycle',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'h11', 'h12', 'h23', 'h24'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customTimeZoneName: {
            name: 'custom-time-zone-name',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [
                undefined,
                'long',
                'short',
                'longOffset',
                'shortOffset',
                'longGeneric',
                'shortGeneric'
            ],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customTimeZone: {
            name: 'custom-time-zone',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). The values presented here are not a comprehensive list.',
            options: [
                undefined,
                'UTC',
                'America/Chicago',
                'America/New York',
                'Europe/Paris'
            ],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customDayPeriod: {
            name: 'custom-day-period',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'narrow', 'short', 'long'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customCalendar: {
            name: 'custom-calendar',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). The values presented here are not a comprehensive list.',
            options: [
                undefined,
                'iso8601',
                'chinese',
                'gregory',
                'hebrew',
                'islamic-civil'
            ],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customNumberingSystem: {
            name: 'custom-numbering-system',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). The values presented here are not a comprehensive list.',
            options: [undefined, 'arab', 'fullwide', 'latn', 'tamldec'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customFormatMatcher: {
            name: 'custom-format-matcher',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'basic', 'best-fit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        customLocaleMatcher: {
            name: 'custom-locale-matcher',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'lookup', 'best-fit'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'date text column'
            }),
            table: { category: apiCategory.methods },
            control: false
        },
        validity: {
            description: validityDescription({
                colloquialName: 'column',
                validityObjectType: 'TableColumnValidity',
                validityFlags: [
                    {
                        flagName: 'invalidCustomOptionsCombination',
                        description:
                            "`true` when an invalid combination of formatting options (i.e. `custom-*`) have been specified. To determine which specific options are in conflict, you may use [MDN's Try It widget](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#try_it) or a browser console to get a detailed exception message."
                    }
                ]
            }),
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        }
    },
    args: {
        fieldName: 'firstName',
        placeholder: 'Unknown birthday',
        format: 'default',
        customDateStyle: undefined,
        customTimeStyle: undefined,
        customWeekday: undefined,
        customDay: undefined,
        customMonth: undefined,
        customYear: undefined,
        customEra: undefined,
        customHour: undefined,
        customMinute: undefined,
        customSecond: undefined,
        customHour12: undefined,
        customHourCycle: undefined,
        customTimeZoneName: undefined,
        customTimeZone: undefined,
        customDayPeriod: undefined,
        customCalendar: undefined,
        customNumberingSystem: undefined,
        customFormatMatcher: undefined,
        customLocaleMatcher: undefined,
        checkValidity: () => {},
        validity: () => {}
    }
};
