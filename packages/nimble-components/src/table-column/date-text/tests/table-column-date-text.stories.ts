import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnDateTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';
import {
    DateTextFormat,
    DateStyle,
    DayPeriodFormat,
    EraFormat,
    FormatMatcherAlgorithm,
    HourCycle,
    LocaleMatcherAlgorithm,
    MonthFormat,
    SimpleNumberFormat,
    TimeStyle,
    TimeZoneFormat,
    WeekdayFormat
} from '../types';

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
        firstName: 'Maggie',
        lastName: 'Simpson',
        birthday: new Date(2022, 0, 12, 20, 4, 37, 975).valueOf()
    }
];

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Incubating/Table Column Types',
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
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
    format: keyof typeof DateTextFormat;
    customDateStyle: keyof typeof DateStyle;
    customTimeStyle: keyof typeof TimeStyle;
    customWeekday: keyof typeof WeekdayFormat;
    customDay: keyof typeof SimpleNumberFormat;
    customMonth: keyof typeof MonthFormat;
    customYear: keyof typeof SimpleNumberFormat;
    customEra: keyof typeof EraFormat;
    customHour: keyof typeof SimpleNumberFormat;
    customMinute: keyof typeof SimpleNumberFormat;
    customSecond: keyof typeof SimpleNumberFormat;
    customHour12: boolean;
    customHourCycle: keyof typeof HourCycle;
    customTimeZoneName: keyof typeof TimeZoneFormat;
    customTimeZone?: string;
    customDayPeriod: keyof typeof DayPeriodFormat;
    customCalendar?: string;
    customNumberingSystem?: string;
    customFormatMatcher: keyof typeof FormatMatcherAlgorithm;
    customLocaleMatcher: keyof typeof LocaleMatcherAlgorithm;
    checkValidity: () => void;
    validity: () => void;
}

const dateTextColumnDescription = 'The `nimble-table-column-date-text` column is used to display date-time fields as text in the `nimble-table`. The date-time values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the [JavaScript `Date` type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).';

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:
-   \`invalidCustomOptionsCombination\`: \`true\` when an invalid combination of formatting options (i.e. \`custom-*\`) have been specified. To determine which specific options are in conflict, you may use [MDN's Try It widget](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#try_it) or a browser console to get a detailed exception message.
`;

export const dateTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: dateTextColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        ${incubatingWarning({
        componentName: 'table',
        statusLink: 'https://github.com/orgs/ni/projects/7/views/21'
    })}
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
                format="${x => DateTextFormat[x.format]}"
                custom-date-style="${x => DateStyle[x.customDateStyle]}"
                custom-time-style="${x => TimeStyle[x.customTimeStyle]}"
                custom-weekday="${x => WeekdayFormat[x.customWeekday]}"
                custom-day="${x => SimpleNumberFormat[x.customDay]}"
                custom-month="${x => MonthFormat[x.customMonth]}"
                custom-year="${x => SimpleNumberFormat[x.customYear]}"
                custom-era="${x => EraFormat[x.customEra]}"
                custom-hour="${x => SimpleNumberFormat[x.customHour]}"
                custom-minute="${x => SimpleNumberFormat[x.customMinute]}"
                custom-second="${x => SimpleNumberFormat[x.customSecond]}"
                ?custom-hour12="${x => x.customHour12}"
                custom-hour-cycle="${x => HourCycle[x.customHourCycle]}"
                custom-time-zone-name="${x => TimeZoneFormat[x.customTimeZoneName]}"
                custom-time-zone="${x => x.customTimeZone}"
                custom-day-period="${x => DayPeriodFormat[x.customDayPeriod]}"
                custom-calendar="${x => x.customCalendar}"
                custom-numbering-system="${x => x.customNumberingSystem}"
                custom-format-matcher="${x => FormatMatcherAlgorithm[x.customFormatMatcher]}"
                custom-locale-matcher="${x => LocaleMatcherAlgorithm[x.customLocaleMatcher]}"
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
            control: { type: 'none' }
        },
        format: {
            description:
                'By default, dates are formatted like "Jan 1, 2023, 12:00:00 AM". To use a different format, set this attribute to `custom` and provide additional attributes corresponding to [`Intl.DateTimeFormat()` options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). Each `Intl.DateTimeFormat()` option has a corresponding attribute whose name is kebab-cased and prefixed with `custom-` e.g. `custom-date-style` corresponds to `dateStyle`.',
            options: Object.keys(DateTextFormat),
            control: { type: 'radio' }
        },
        customDateStyle: {
            name: 'custom-date-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(DateStyle),
            control: { type: 'radio' }
        },
        customTimeStyle: {
            name: 'custom-time-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(TimeStyle),
            control: { type: 'radio' }
        },
        customWeekday: {
            name: 'custom-weekday',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(WeekdayFormat),
            control: { type: 'radio' }
        },
        customDay: {
            name: 'custom-day',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(SimpleNumberFormat),
            control: { type: 'radio' }
        },
        customMonth: {
            name: 'custom-month',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(MonthFormat),
            control: { type: 'radio' }
        },
        customYear: {
            name: 'custom-year',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(SimpleNumberFormat),
            control: { type: 'radio' }
        },
        customEra: {
            name: 'custom-era',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(EraFormat),
            control: { type: 'radio' }
        },
        customHour: {
            name: 'custom-hour',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(SimpleNumberFormat),
            control: { type: 'radio' }
        },
        customMinute: {
            name: 'custom-minute',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(SimpleNumberFormat),
            control: { type: 'radio' }
        },
        customSecond: {
            name: 'custom-second',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(SimpleNumberFormat),
            control: { type: 'radio' }
        },
        customHour12: {
            name: 'custom-hour12',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).'
        },
        customHourCycle: {
            name: 'custom-hour-cycle',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(HourCycle),
            control: { type: 'radio' }
        },
        customTimeZoneName: {
            name: 'custom-time-zone-name',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(TimeZoneFormat),
            control: { type: 'radio' }
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
            control: { type: 'radio' }
        },
        customDayPeriod: {
            name: 'custom-day-period',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(DayPeriodFormat),
            control: { type: 'radio' }
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
            control: { type: 'radio' }
        },
        customNumberingSystem: {
            name: 'custom-numbering-system',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat). The values presented here are not a comprehensive list.',
            options: [undefined, 'arab', 'fullwide', 'latn', 'tamldec'],
            control: { type: 'radio' }
        },
        customFormatMatcher: {
            name: 'custom-format-matcher',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(FormatMatcherAlgorithm),
            control: { type: 'radio' }
        },
        customLocaleMatcher: {
            name: 'custom-locale-matcher',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: Object.keys(LocaleMatcherAlgorithm),
            control: { type: 'radio' }
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'Returns `true` if the column configuration is valid, otherwise `false`.'
        },
        validity: {
            description: validityDescription
        }
    },
    args: {
        fieldName: 'firstName',
        format: 'default',
        customDateStyle: 'default',
        customTimeStyle: 'default',
        customWeekday: 'default',
        customDay: 'default',
        customMonth: 'default',
        customYear: 'default',
        customEra: 'default',
        customHour: 'default',
        customMinute: 'default',
        customSecond: 'default',
        customHour12: false,
        customHourCycle: 'default',
        customTimeZoneName: 'default',
        customTimeZone: undefined,
        customDayPeriod: 'default',
        customCalendar: undefined,
        customNumberingSystem: undefined,
        customFormatMatcher: 'default',
        customLocaleMatcher: 'default',
        checkValidity: () => {},
        validity: () => {}
    }
};
