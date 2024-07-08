import { html, ref, when } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { unitByteTag } from '../../../../../nimble-components/src/unit/byte';
import { unitCelsiusTag } from '../../../../../nimble-components/src/unit/celsius';
import { unitFahrenheitTag } from '../../../../../nimble-components/src/unit/fahrenheit';
import { unitVoltTag } from '../../../../../nimble-components/src/unit/volt';
import { tableColumnNumberTextTag } from '../../../../../nimble-components/src/table-column/number-text';
import {
    NumberTextAlignment,
    NumberTextFormat
} from '../../../../../nimble-components/src/table-column/number-text/types';
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
        age: 45.2358734623,
        favoriteNumber: Math.PI,
        measurement: 1
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 42.918275125,
        favoriteNumber: 28729375089724643,
        measurement: 28729375089724643
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 13.5689,
        favoriteNumber: 1000,
        measurement: 1000
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        age: 1.238957645,
        favoriteNumber: 0,
        measurement: 0
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 14.1,
        favoriteNumber: -0.00000064532623,
        measurement: undefined
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Number Text',
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

interface NumberTextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    placeholder: string;
    format: keyof typeof NumberTextFormat;
    alignment: keyof typeof NumberTextAlignment;
    decimalDigits: number;
    decimalMaximumDigits: number;
    unit: string;
    checkValidity: () => void;
    validity: () => void;
}

const formatDescription = `Configures the way that the numeric value is formatted to render within the column.

<details>
    <summary>Format Options</summary>

    <ul>
        <li>\`default\`: Integers are shown with no trailing zeros, the value is limited to 6 digits, and exponential notation is used for numbers that are large (\`>= 1e6\`) or small (\`< 1e-3\`) in magnitude.
        </li>
        <li>\`decimal\`: Values as are formatted as decimal values, with a number of digits after the separator dictated by \`decimal-digits\` or \`decimal-maximum-digits\`, and never displaying exponential notation. Setting \`decimal-digits\` to \`0\`
        will display the value as an integer without a decimal separator.
        </li>
    </ul>
</details>
`;

const alignmentDescription = `Configures the alignment of the value within the column.

To improve the ability for users to visually scan values, applications should select \`right\` if it is known that the decimal separators of all values in the column will align in the given the format.

<details>
    <summary>Default Alignment</summary>

    The default alignment of the value depends on the column's configuration.
    <ul>
        <li>\`default\` format: Values are left-aligned.
        </li>
        <li>\`decimal\` format: Values are left-aligned if \`decimal-maximum-digits\` is set, otherwise right-aligned.
        </li>
    </ul>
</details>
`;

const unitDescription = `A unit for the column may be configured by providing a \`nimble-unit-<name>\` element as content (in addition to the column label). Unit elements represent a set of related, scaled units, e.g. \`nimble-unit-byte\` represents bytes, KB, MB, etc. Values are converted from a source unit (e.g. bytes) to the largest scaled unit (e.g. KB, MB, etc.) that can represent that value with magnitude >= 1. The source data for the column is expected to be given in the base unit specified in the tag name, e.g. for \`nimble-unit-byte\`, a source value should be a number of bytes.

<details>
    <summary>Unit Elements</summary>

    <ul>
        <li>\`nimble-unit-byte\`: Labels in this unit scale are \`byte\`/\`bytes\`, \`KB\`, \`MB\`, \`GB\`, \`TB\`, and \`PB\`. Translations exist for all languages supported by the runtime environment.
            <ul>
                <li>\`binary\` - boolean attribute that indicates a binary conversion factor of 1024 should be used rather than 1000. The resulting unit labels are \`byte\`/\`bytes\`, \`KiB\`, \`MiB\`, \`GiB\`, \`TiB\`, and \`PiB\`. Translations exist for English, French, German, Japanese, and Chinese.</li>
            </ul>
        </li>
        <li>\`nimble-unit-celsius\`: This unit label is \`°C\`. Translations exist for all languages supported by the runtime environment.
        </li>
        <li>\`nimble-unit-fahrenheit\`: This unit label is \`°F\`. Translations exist for all languages supported by the runtime environment.
        </li>
        <li>\`nimble-unit-volt\`: Labels in this unit scale are \`fV\`, \`pV\`, \`nV\`, \`μV\`, \`mV\`, \`cV\`, \`dV\`, \`volt\`/\`volts\`, \`kV\`, \`MV\`, \`GV\`, \`TV\`, \`PV\`, and \`EV\`. Translations exist for English, French, German, Japanese, and Chinese.
        </li>
    </ul>
</details>
`;

export const numberTextColumn: StoryObj<NumberTextColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<NumberTextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag} field-name="firstName">
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="lastName">
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnNumberTextTag} field-name="age" format="${x => NumberTextFormat[x.format]}" alignment="${x => NumberTextAlignment[x.alignment]}" decimal-digits="${x => x.decimalDigits}" decimal-maximum-digits="${x => x.decimalMaximumDigits}">
                Age
            </${tableColumnNumberTextTag}>
            <${tableColumnNumberTextTag} field-name="favoriteNumber" format="${x => NumberTextFormat[x.format]}" alignment="${x => NumberTextAlignment[x.alignment]}" decimal-digits="${x => x.decimalDigits}" decimal-maximum-digits="${x => x.decimalMaximumDigits}" placeholder="${x => x.placeholder}">
                Favorite Number
            </${tableColumnNumberTextTag}>
            <${tableColumnNumberTextTag} field-name="measurement" format="${x => NumberTextFormat[x.format]}" alignment="${x => NumberTextAlignment[x.alignment]}" decimal-digits="${x => x.decimalDigits}" decimal-maximum-digits="${x => x.decimalMaximumDigits}" placeholder="${x => x.placeholder}">
                Measurement
                ${when(x => x.unit === 'byte', html`<${unitByteTag}></${unitByteTag}>`)}
                ${when(x => x.unit === 'byte (1024)', html`<${unitByteTag} binary></${unitByteTag}>`)}
                ${when(x => x.unit === 'degrees Celsius', html`<${unitCelsiusTag}></${unitCelsiusTag}>`)}
                ${when(x => x.unit === 'degrees Fahrenheit', html`<${unitFahrenheitTag}></${unitFahrenheitTag}>`)}
                ${when(x => x.unit === 'volt', html`<${unitVoltTag}></${unitVoltTag}>`)}
            </${tableColumnNumberTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number`.',
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
            options: Object.keys(NumberTextFormat),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        alignment: {
            description: alignmentDescription,
            options: Object.keys(NumberTextAlignment),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        decimalDigits: {
            name: 'decimal-digits',
            description:
                "The number of decimal places to format values to when the column's `format` is configured to be `decimal`. If neither `decimal-digits` or `decimal-maximum-digits` are set, a default value of `2` is used. `decimal-digits` and `decimal-maximum-digits` cannot both be set at the same time. The value must be in the range 0 - 20 (inclusive).",
            options: [undefined, 0, 1, 2, 3],
            control: { type: 'select' },
            table: { category: apiCategory.attributes }
        },
        decimalMaximumDigits: {
            name: 'decimal-maximum-digits',
            description:
                "The maximum number of decimal places to format values to when the column's `format` is configured to be `decimal`. This differs from `decimal-digits` in that trailing zeros are omitted. `decimal-digits` and `decimal-maximum-digits` cannot both be set at the same time. The value must be in the range 0 - 20 (inclusive).",
            options: [undefined, 0, 1, 2, 3, 20],
            control: { type: 'select' },
            table: { category: apiCategory.attributes }
        },
        unit: {
            description: unitDescription,
            options: [
                'default',
                'byte',
                'byte (1024)',
                'degrees Celsius',
                'degrees Fahrenheit',
                'volt'
            ],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'number text column'
            }),
            control: false,
            table: { category: apiCategory.methods }
        },
        validity: {
            description: validityDescription({
                colloquialName: 'column',
                validityObjectType: 'TableColumnValidity',
                validityFlags: [
                    {
                        flagName: 'invalidDecimalDigits',
                        description:
                            '`true` when `format` is configured to `decimal` and `decimal-digits` is set to a number less than 0 or greater than 20.'
                    },
                    {
                        flagName: 'invalidDecimalMaximumDigits',
                        description:
                            '`true` when `format` is configured to `decimal` and `decimal-maximum-digits` is set to a number less than 0 or greater than 20.'
                    },
                    {
                        flagName:
                            'decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits',
                        description:
                            '`true` when `format` is configured to `decimal` and both `decimal-digits` and `decimal-maximum-digits` are set.'
                    }
                ]
            }),
            control: false,
            table: { category: apiCategory.nonAttributeProperties }
        }
    },
    args: {
        fieldName: undefined,
        format: 'default',
        alignment: 'default',
        decimalDigits: 2,
        decimalMaximumDigits: undefined,
        unit: 'volt',
        placeholder: 'Unknown voltage'
    }
};
