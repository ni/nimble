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
    format?: 'custom';
    customDateStyle?: string;
    customTimeStyle?: string;
    customWeekday?: string;
    customDay?: string;
    customMonth?: string;
    customYear?: string;
    customEra?: string;
    customHour?: string;
    customMinute?: string;
    customSecond?: string;
    customHour12: boolean;
    customHourCycle?: string;
    customTimeZoneName?: string;
    customTimeZone?: string;
    customDayPeriod?: string;
    customCalendar?: string;
    customNumberingSystem?: string;
    customFormatMatcher?: string;
    customLocaleMatcher?: string;
}

const dateTextColumnDescription = 'The `nimble-table-column-date-text` column is used to display date-time fields as text in the `nimble-table`. The date-time values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the [JavaScript `Date` type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).';

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
                format="${x => x.format}"
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
                ?custom-hour12="${x => x.customHour12}"
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
            control: { type: 'none' }
        },
        format: {
            description:
                'By default, dates are formatted like "Jan 1, 2023, 12:00:00 AM". To use a different format, set this attribute to `custom` and provide additional attributes corresponding to [`Intl.DateTimeFormat()` options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'custom'],
            control: { type: 'radio' }
        },
        customDateStyle: {
            name: 'custom-date-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'full', 'long', 'medium', 'short'],
            control: { type: 'radio' }
        },
        customTimeStyle: {
            name: 'custom-time-style',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'full', 'long', 'medium', 'short'],
            control: { type: 'radio' }
        },
        customWeekday: {
            name: 'custom-weekday',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'long', 'short', 'narrow'],
            control: { type: 'radio' }
        },
        customDay: {
            name: 'custom-day',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' }
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
            control: { type: 'radio' }
        },
        customYear: {
            name: 'custom-year',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' }
        },
        customEra: {
            name: 'custom-era',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'long', 'short', 'narrow'],
            control: { type: 'radio' }
        },
        customHour: {
            name: 'custom-hour',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' }
        },
        customMinute: {
            name: 'custom-minute',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
            control: { type: 'radio' }
        },
        customSecond: {
            name: 'custom-second',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [undefined, 'numeric', '2-digit'],
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
            options: [undefined, 'h11', 'h12', 'h23', 'h24'],
            control: { type: 'radio' }
        },
        customTimeZoneName: {
            name: 'custom-time-zone-name',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            options: [
                undefined,
                'short',
                'long',
                'shortOffset',
                'longOffset',
                'shortGeneric',
                'longGeneric'
            ],
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
            options: [undefined, 'narrow', 'short', 'long'],
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
            defaultValue: { summary: 'best fit' },
            options: [undefined, 'best fit', 'basic'],
            control: { type: 'radio' }
        },
        customLocaleMatcher: {
            name: 'custom-local-matcher',
            description:
                'Refer to the option [documentation for the `Intl.DateTimeFormat()` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).',
            defaultValue: { summary: 'best fit' },
            options: [undefined, 'best fit', 'lookup'],
            control: { type: 'radio' }
        }
    },
    args: {
        fieldName: 'firstName',
        format: undefined,
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
        customHour12: false,
        customHourCycle: undefined,
        customTimeZoneName: undefined,
        customTimeZone: undefined,
        customDayPeriod: undefined,
        customCalendar: undefined,
        customNumberingSystem: undefined,
        customFormatMatcher: undefined,
        customLocaleMatcher: undefined
    }
};
